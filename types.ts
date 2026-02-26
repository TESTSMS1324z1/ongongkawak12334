
export enum QuestionType {
  MCQ = 'MCQ',
  SHORT_QUESTION = 'SHORT_QUESTION',
  DATA_RESPONSE = 'DATA_RESPONSE'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Topic {
  id: string;
  name: string;
  nameEn: string;
  category: 'Micro' | 'Macro';
}

export interface MCQExplanation {
  option: string; // A, B, C, D
  explanation: string;
  isCorrect: boolean;
}

export interface GeneratedQuestion {
  title: string;
  content: string;
  data?: string;
  options?: string[];
  correctOption?: number;
  // For MCQ, we use optionExplanations; for SQ/DRQ we use markingScheme
  optionExplanations?: MCQExplanation[];
  markingScheme: {
    point: string;
    explanation: string;
    marks: number;
  }[];
  totalMarks: number;
}
