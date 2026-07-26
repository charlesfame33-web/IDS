# SENPAI Workspace Rules

## 1. Folder Structure

```
SENPAI/
├── <project>/               # Each project in its own subdirectory
│   ├── app/                 # Application source
│   ├── src/                 # Source code
│   ├── data/                # Data files
│   ├── models/              # Trained models
│   ├── reports/             # Generated report artifacts
│   └── requirements.txt     # Dependencies
├── shots/                   # Screenshots
│   └── <project>/           # Per-project screenshots
├── _archive/                # Deprecated files
├── build_<project>_report.py     # Report builder scripts
├── build_slides.py               # Unified slides builder
├── report_helpers.py             # Shared helpers
├── convert_all_pdf.ps1           # PDF conversion
├── README.md, CLAUDE.md, CONTRIBUTING.md
```

## 2. Report Standards (CSC/OAUSTECH)

- **Font:** Times New Roman 12pt
- **Page:** A4, margins 40mm left / 25mm others
- **Spacing:** 1.5 line spacing
- **Preliminary pages:** Roman numerals (title page unnumbered)
- **Main body:** Arabic numerals starting at 1
- **Chapters:** Heading 1 (14pt, centered, uppercase)
- **Sections:** Heading 2 (12pt, bold)
- **Subsections:** Heading 3 (12pt, bold italic)
- **References:** APA style with hanging indent
- **Build scripts:** Use `report_helpers.py` helpers

### Chapter Structure
1. Introduction
2. Literature Review
3. Methodology
4. System Implementation, Results and Discussion
5. Summary, Conclusion and Recommendations

## 3. Slide Standards (CSC/OAUSTECH Defence)

- **12 slides:** Title + 10 content + Thank You
- **Black & white** theme only (no color slides)
- **Format:** 13.333" x 7.5" widescreen
- **Font:** Segoe UI throughout
- **Content slides:** kicker, title, accent bar, bullet points or two-column layout

### Standard Slide Deck
1. Title Slide (project, student, supervisor, department)
2. Introduction
3. Motivation / Problem Statement
4. Aim and Objectives
5. Significance of the Study
6. Literature Review
7. Methodology (card layout)
8. Implementation (screenshots)
9. Results and Discussion (screenshots + metrics)
10. Contributions to Knowledge
11. Conclusion and References (two-column)
12. Thank You

## 4. Screenshot Conventions

- **Location:** `shots/<project>/`
- **Resolution:** 1920x1080
- **Files:** descriptive `kebab-case` names (e.g., `dash-farmer.png`)
- **Format:** PNG
- **Capture:** Full-page or element-specific via Playwright scripts

## 5. Git Standards

- **Commit format:** `type: description`
  - `feat:` — new feature
  - `fix:` — bug fix
  - `docs:` — documentation
  - `chore:` — maintenance, config, dependencies
  - `refactor:` — code restructuring
- **Branch:** `main` for production, `dev/<feature>` for development
- **Ignore:** `__pycache__/`, `data/raw/`, `data/processed/`, `.env`, `venv/`

## 6. Build Script Naming

- Report: `build_<project>_report.py`
- Slides: `build_slides.py` (unified, with per-project configs)
- Capture: `shots/capture_<project>.py`
- PDF: `convert_all_pdf.ps1`

## 7. General Conventions

- No AI credits in any documentation or reports
- All reports generated via Python scripts (not manual Word editing)
- All slides generated via Python scripts (not manual PowerPoint editing)
- Screenshots captured programmatically where possible
