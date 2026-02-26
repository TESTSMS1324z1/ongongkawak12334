
import { Topic } from './types';

export const TOPICS: Topic[] = [
  // Microeconomics
  { id: 'basic_concepts', name: '基本經濟概念', nameEn: 'Basic Concepts', category: 'Micro' },
  { id: 'demand_supply', name: '需求、供應與價格', nameEn: 'Demand, Supply & Price', category: 'Micro' },
  { id: 'elasticity', name: '彈性', nameEn: 'Elasticity', category: 'Micro' },
  { id: 'market_intervention', name: '市場干預', nameEn: 'Market Intervention', category: 'Micro' },
  { id: 'consumer_producer_surplus', name: '消費者及生產者盈餘', nameEn: 'Consumer & Producer Surplus', category: 'Micro' },
  { id: 'production_costs', name: '生產與成本', nameEn: 'Production & Costs', category: 'Micro' },
  { id: 'market_structure', name: '市場結構', nameEn: 'Market Structure', category: 'Micro' },
  { id: 'efficiency', name: '效率、公平與市場失效', nameEn: 'Efficiency, Equity & Market Failure', category: 'Micro' },
  
  // Macroeconomics
  { id: 'national_income', name: '國民收入核算', nameEn: 'National Income Accounting', category: 'Macro' },
  { id: 'as_ad', name: '總需求與總供應', nameEn: 'AS-AD Model', category: 'Macro' },
  { id: 'money_banking', name: '貨幣與銀行', nameEn: 'Money & Banking', category: 'Macro' },
  { id: 'fiscal_monetary', name: '財政政策與貨幣政策', nameEn: 'Fiscal & Monetary Policy', category: 'Macro' },
  { id: 'inflation_unemployment', name: '通脹與失業', nameEn: 'Inflation & Unemployment', category: 'Macro' },
  { id: 'trade', name: '國際貿易', nameEn: 'International Trade', category: 'Macro' },
  { id: 'balance_of_payments', name: '國際收支與匯率', nameEn: 'BOP & Exchange Rate', category: 'Macro' },
];

export const UI = {
  title: "DSE Econ Master",
  configTitle: "出題設定",
  topicLabel: "課題單元",
  typeLabel: "題目種類",
  difficultyLabel: "難度跨度",
  countLabel: "題目數量",
  generateBtn: "生成題目 (英文題/中解)",
  generating: "正在構建試題與詳細題解...",
  printBtn: "列印試卷",
  clearBtn: "清空內容",
  mcq: "多項選擇 (MCQ)",
  short: "短答題 (SQ)",
  data: "資料回應 (DRQ)",
  easy: "基礎鞏固",
  medium: "標準考評",
  hard: "摘星挑戰",
  showAns: "查看中英對照題解",
  hideAns: "隱藏題解",
  markingScheme: "評分準則及詳細解釋 (Marking Scheme)",
  correctAns: "正確答案",
  totalMarks: "總分",
  dataLabel: "資料 (Data Content):",
  placeholder: "請在左側選擇課題，AI 將為您生成英文試題與中文題解",
  error: "API 連線失敗，請檢查網絡或稍後再試。",
  studyTipTitle: "備考小貼士",
  mixedNote: "註：題目內容為英文，題解與解釋為繁體中文。"
};
