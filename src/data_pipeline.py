import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import StratifiedShuffleSplit
import joblib
import re


LABEL_MAP = {"benign": 0}
LABEL_COL = "Label"
BINARY_CLASSES = ["BENIGN", "ATTACK"]


def load_raw_data(data_dir: str | Path) -> pd.DataFrame:
    data_dir = Path(data_dir)
    csv_files = sorted(data_dir.rglob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in {data_dir}")

    frames = []
    for f in csv_files:
        df = pd.read_csv(f, low_memory=False)
        df.columns = df.columns.str.strip()
        frames.append(df)

    df = pd.concat(frames, ignore_index=True)
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.replace([np.inf, -np.inf], np.nan)

    nan_frac = df.isna().mean()
    cols_to_drop = nan_frac[nan_frac > 0.5].index
    df = df.drop(columns=cols_to_drop)

    for col in df.select_dtypes(include=[np.number]).columns:
        if df[col].isna().any():
            df[col] = df[col].fillna(df[col].median())

    return df


def consolidate_labels(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df[LABEL_COL] = df[LABEL_COL].astype(str).str.strip()
    df[LABEL_COL] = df[LABEL_COL].apply(
        lambda x: 0 if x.strip().lower() == "benign" else 1
    )
    return df


LEAKAGE_COLUMNS = {
    "Flow ID", "Source IP", "Destination IP", "Timestamp",
    "Fwd Header Length", "SimillarHTTP", "Fwd Avg Bytes/Bulk",
    "Bwd Avg Bytes/Bulk", "Fwd Avg Packets/Bulk", "Bwd Avg Packets/Bulk",
    "Fwd Avg Bulk Rate", "Bwd Avg Bulk Rate",
}


def select_features(df: pd.DataFrame, label_col: str = LABEL_COL) -> pd.DataFrame:
    df = df.copy()
    cols_to_drop = [c for c in df.columns if c in LEAKAGE_COLUMNS]
    remaining = [c for c in df.columns if c not in cols_to_drop and c != label_col]
    feature_cols = []

    for c in remaining:
        if pd.api.types.is_numeric_dtype(df[c]) and df[c].notna().any():
            feature_cols.append(c)

    result = df[feature_cols + [label_col]].copy()
    return result


def split_data(
    df: pd.DataFrame,
    test_size: float = 0.15,
    val_size: float = 0.15,
    random_state: int = 42,
) -> dict[str, pd.DataFrame]:
    first_split = StratifiedShuffleSplit(
        n_splits=1, test_size=test_size, random_state=random_state
    )
    train_idx, test_idx = next(first_split.split(df, df[LABEL_COL]))
    train_val = df.iloc[train_idx]
    test = df.iloc[test_idx]

    adjusted_val = val_size / (1 - test_size)
    second_split = StratifiedShuffleSplit(
        n_splits=1, test_size=adjusted_val, random_state=random_state
    )
    train_idx, val_idx = next(second_split.split(train_val, train_val[LABEL_COL]))
    train = train_val.iloc[train_idx]
    val = train_val.iloc[val_idx]

    return {"train": train, "val": val, "test": test}


def save_processed_data(
    splits: dict[str, pd.DataFrame],
    feature_cols: list[str],
    out_dir: str | Path,
) -> None:
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for name, df in splits.items():
        df.to_csv(out_dir / f"{name}.csv", index=False)
        X = df.drop(columns=[LABEL_COL])
        y = df[[LABEL_COL]]
        X.to_parquet(out_dir / f"X_{name}.parquet", index=False)
        y.to_parquet(out_dir / f"y_{name}.parquet", index=False)

    joblib.dump(feature_cols, out_dir / "feature_columns.joblib")
    print(f"Files written to {out_dir}/")
    print(f"  train.csv       : {len(splits['train']):,} rows")
    print(f"  val.csv         : {len(splits['val']):,} rows")
    print(f"  test.csv        : {len(splits['test']):,} rows")
    print(f"  X/y_*.parquet   : 6 parquet files (X/y for train/val/test)")
    print(f"  feature_columns.joblib: {len(feature_cols)} features")


def run_pipeline(
    data_dir: str | Path = "data/raw",
    out_dir: str | Path = "data/processed",
    random_state: int = 42,
) -> dict:
    print("=== AgriFlow IDS — Data Pipeline ===")
    print(f"[1/5] Loading raw CSVs from {data_dir} ...")
    raw = load_raw_data(data_dir)
    print(f"      Loaded {len(raw):,} rows, {len(raw.columns)} columns")

    print(f"[2/5] Cleaning data ...")
    cleaned = clean_data(raw)
    print(f"      After cleaning: {len(cleaned):,} rows, {len(cleaned.columns)} columns")

    print(f"[3/5] Consolidating labels (binary) ...")
    labeled = consolidate_labels(cleaned)
    benign_cnt = (labeled[LABEL_COL] == 0).sum()
    attack_cnt = (labeled[LABEL_COL] == 1).sum()
    print(f"      BENIGN: {benign_cnt:,}  |  ATTACK: {attack_cnt:,}")

    print(f"[4/5] Selecting features ...")
    selected = select_features(labeled)
    feature_cols = [c for c in selected.columns if c != LABEL_COL]
    print(f"      {len(feature_cols)} numeric feature columns selected")

    print(f"[5/5] Stratified train/val/test split ...")
    splits = split_data(selected, random_state=random_state)

    print(f"\nSplit sizes:")
    for name, df in splits.items():
        bc = (df[LABEL_COL] == 0).sum()
        ac = (df[LABEL_COL] == 1).sum()
        print(f"  {name:>6s}: {len(df):>8,} rows  (BENIGN: {bc:>6,}  ATTACK: {ac:>6,})")

    save_processed_data(splits, feature_cols, out_dir)

    return splits


if __name__ == "__main__":
    splits = run_pipeline()
