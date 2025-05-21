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