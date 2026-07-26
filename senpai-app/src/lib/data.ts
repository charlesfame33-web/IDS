export type Sentiment = "positive" | "neutral" | "negative";

export interface Fintech {
  id: string;
  name: string;
  guardian: string;
  guardianTitle: string;
  color: string;
  tagline: string;
}

export interface Review {
  id: number;
  fintech: string;
  author: string;
  text: string;
  rating: number;
  sentiment: Sentiment;
  confidence: number;
  source: "Google Play" | "App Store" | "X";
  date: string;
}

export interface FintechStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  score: number;
  trend: number[]; // last 7 days positive %
}

export const FINTECHS: Fintech[] = [
  {
    id: "opay",
    name: "OPay",
    guardian: "Kaizen",
    guardianTitle: "Cyber Samurai",
    color: "#10b981",
    tagline: "Payments, savings & cards",
  },
  {
    id: "palmpay",
    name: "PalmPay",
    guardian: "Shinobi",
    guardianTitle: "Neon Ninja",
    color: "#8b5cf6",
    tagline: "Transfers & bill payments",
  },
  {
    id: "moniepoint",
    name: "Moniepoint",
    guardian: "Ronin",
    guardianTitle: "Tech Warrior",
    color: "#3b82f6",
    tagline: "Business banking & POS",
  },
  {
    id: "fairmoney",
    name: "FairMoney",
    guardian: "Arcane",
    guardianTitle: "Arcane Mage",
    color: "#f59e0b",
    tagline: "Loans & digital banking",
  },
];

export const STATS: Record<string, FintechStats> = {
  opay: {
    total: 14823,
    positive: 81,
    neutral: 10,
    negative: 9,
    score: 8.6,
    trend: [74, 76, 78, 75, 79, 80, 81],
  },
  palmpay: {
    total: 11207,
    positive: 73,
    neutral: 14,
    negative: 13,
    score: 7.9,
    trend: [70, 71, 69, 72, 74, 73, 73],
  },
  moniepoint: {
    total: 9642,
    positive: 67,
    neutral: 18,
    negative: 15,
    score: 7.2,
    trend: [63, 64, 66, 65, 68, 67, 67],
  },
  fairmoney: {
    total: 8459,
    positive: 75,
    neutral: 12,
    negative: 13,
    score: 8.0,
    trend: [71, 72, 74, 73, 75, 76, 75],
  },
};

export const REVIEWS: Review[] = [
  {
    id: 1,
    fintech: "opay",
    author: "Chinedu A.",
    text: "Transfers are instant, even on weekends. Best fintech app I've used this year.",
    rating: 5,
    sentiment: "positive",
    confidence: 0.97,
    source: "Google Play",
    date: "2026-07-13",
  },
  {
    id: 2,
    fintech: "palmpay",
    author: "Aisha B.",
    text: "The cashback on airtime is nice but the app has been logging me out randomly.",
    rating: 3,
    sentiment: "neutral",
    confidence: 0.71,
    source: "Google Play",
    date: "2026-07-13",
  },
  {
    id: 3,
    fintech: "moniepoint",
    author: "Emeka O.",
    text: "POS settlement took 2 days this week. Support kept saying 'be patient'. Not good enough.",
    rating: 2,
    sentiment: "negative",
    confidence: 0.93,
    source: "Google Play",
    date: "2026-07-12",
  },
  {
    id: 4,
    fintech: "fairmoney",
    author: "Blessing E.",
    text: "Loan was approved in under 5 minutes. Interest rate is fair compared to others.",
    rating: 5,
    sentiment: "positive",
    confidence: 0.95,
    source: "Google Play",
    date: "2026-07-12",
  },
  {
    id: 5,
    fintech: "opay",
    author: "Tunde F.",
    text: "Customer care actually picked my call and resolved my failed transaction same day!",
    rating: 5,
    sentiment: "positive",
    confidence: 0.96,
    source: "X",
    date: "2026-07-12",
  },
  {
    id: 6,
    fintech: "palmpay",
    author: "Ngozi K.",
    text: "App keeps crashing since the last update. Please fix it, I can't see my balance.",
    rating: 1,
    sentiment: "negative",
    confidence: 0.94,
    source: "Google Play",
    date: "2026-07-11",
  },
  {
    id: 7,
    fintech: "moniepoint",
    author: "Ibrahim S.",
    text: "The business dashboard is solid. Tracking daily sales has never been easier.",
    rating: 5,
    sentiment: "positive",
    confidence: 0.92,
    source: "Google Play",
    date: "2026-07-11",
  },
  {
    id: 8,
    fintech: "fairmoney",
    author: "Kemi W.",
    text: "Repayment reminders come too often. Otherwise the app works okay.",
    rating: 3,
    sentiment: "neutral",
    confidence: 0.68,
    source: "App Store",
    date: "2026-07-10",
  },
  {
    id: 9,
    fintech: "opay",
    author: "Uche M.",
    text: "Card delivery took 3 weeks and no updates from support. Very frustrating experience.",
    rating: 2,
    sentiment: "negative",
    confidence: 0.91,
    source: "Google Play",
    date: "2026-07-10",
  },
  {
    id: 10,
    fintech: "palmpay",
    author: "Yusuf D.",
    text: "Zero transfer fees is a game changer. I moved all my daily transactions here.",
    rating: 5,
    sentiment: "positive",
    confidence: 0.96,
    source: "Google Play",
    date: "2026-07-10",
  },
  {
    id: 11,
    fintech: "moniepoint",
    author: "Grace T.",
    text: "Opening a business account was smooth, though KYC verification took a bit long.",
    rating: 4,
    sentiment: "neutral",
    confidence: 0.64,
    source: "Google Play",
    date: "2026-07-09",
  },
  {
    id: 12,
    fintech: "fairmoney",
    author: "Segun P.",
    text: "They increased my loan limit after 3 repayments. This app rewards loyalty, love it.",
    rating: 5,
    sentiment: "positive",
    confidence: 0.95,
    source: "Google Play",
    date: "2026-07-09",
  },
];

export const KEYWORDS = {
  positive: [
    { word: "fast transfer", count: 2841 },
    { word: "instant", count: 2130 },
    { word: "reliable", count: 1876 },
    { word: "cashback", count: 1502 },
    { word: "easy to use", count: 1349 },
    { word: "good support", count: 987 },
  ],
  negative: [
    { word: "failed transaction", count: 1204 },
    { word: "app crash", count: 963 },
    { word: "slow support", count: 811 },
    { word: "login issue", count: 645 },
    { word: "network error", count: 590 },
    { word: "card delivery", count: 402 },
  ],
};

export const TREND_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function totalReviews() {
  return Object.values(STATS).reduce((sum, s) => sum + s.total, 0);
}

export function overallSentiment() {
  const values = Object.values(STATS);
  const avg = (key: "positive" | "neutral" | "negative") =>
    Math.round(values.reduce((s, v) => s + v[key], 0) / values.length);
  return { positive: avg("positive"), neutral: avg("neutral"), negative: avg("negative") };
}
