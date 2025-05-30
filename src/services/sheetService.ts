import axios from 'axios';
import { SheetData, CellFormat } from '../types';

const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

// 환경 변수 로딩 확인
console.log('SHEET_ID:', SHEET_ID);
console.log('API_KEY:', API_KEY);

// 환경 변수 검증
if (!SHEET_ID || !API_KEY) {
  console.error('환경 변수가 설정되지 않았습니다!');
  console.error('SHEET_ID:', SHEET_ID);
  console.error('API_KEY:', API_KEY);
}

export const fetchSheetData = async (range: string): Promise<string[][]> => {
  try {
    const response = await axios.get<SheetData>(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
    );
    return response.data.values;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    return [];
  }
};

export const getSheetCellFormats = async (range: string) => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?ranges=${range}&fields=sheets.data.rowData.values.effectiveFormat.backgroundColor&key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("포맷 데이터 로드 실패:", error);
    return null;
  }
};

export const updateCellBackground = async (rowIndex: number, mode: 'R' | 'D') => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate?key=${API_KEY}`;
  
  const requestBody = {
    requests: [{
      repeatCell: {
        range: {
          sheetId: 0,
          startRowIndex: rowIndex,
          endRowIndex: rowIndex + 1,
          startColumnIndex: mode === 'R' ? 0 : 2,
          endColumnIndex: mode === 'R' ? 2 : 4
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }
          }
        },
        fields: "userEnteredFormat.backgroundColor"
      }
    }]
  };

  try {
    const response = await axios.post(url, requestBody);
    return response.status === 200;
  } catch (error) {
    console.error("셀 업데이트 실패:", error);
    return false;
  }
}; 