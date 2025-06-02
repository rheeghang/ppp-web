export type Mode = 'R' | 'D';

export interface Colors {
  R: { left: string; right: string };
  D: { left: string; right: string };
}

export interface DeadlineInfo {
  number: string;
  date: string;
  nextDeadline: Date;
}

// Supabase 테이블 타입 정의 (id 컬럼 포함)
export interface SubjectItem {
  id: number;
  subject: string;
  status: number;
  created_at?: string;
}

export interface RuleItem {
  id: number;
  rule: string;
  status: number;
  created_at?: string;
}

// 기존 Google Sheets 관련 타입 (호환성을 위해 유지)
export interface SheetData {
  values: string[][];
}

export interface CellFormat {
  effectiveFormat?: {
    backgroundColor?: {
      red: number;
      green: number;
      blue: number;
    };
  };
} 