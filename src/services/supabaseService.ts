import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpvsdangkpiqutxzlczd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdnNkYW5na3BpcXV0eHpsY3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzczODQsImV4cCI6MjA2NDE1MzM4NH0.BS8atDA57_n7vH6AuisY1WOe_Q7Z36KXVp1VcNjYEA8';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 연결 테스트 및 테이블 확인 함수
export const testConnection = async () => {
  try {
    console.log('🔍 Supabase 연결 테스트 시작...');
    
    // R-s 테이블로 연결 테스트
    const { data, error } = await supabase
      .from('R-s')
      .select('*')
      .limit(1);

    console.log('✅ 연결 테스트 결과 (R-s):', { data, error });
    
    if (error) {
      console.error('❌ 연결 테스트 실패:', error);
    } else {
      console.log('✅ 연결 성공! 데이터 샘플:', data);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ 연결 테스트 예외:', error);
    return { data: null, error };
  }
};

// R-s 테이블에서 status가 2인 subject 항목들을 가져오는 함수
export const fetchSubjects = async () => {
  try {
    console.log('🔍 Subject 데이터 요청 시작 (R-s 테이블)...');
    
    // 1단계: 테이블 전체 구조 확인
    console.log('1️⃣ 테이블 구조 확인 중...');
    const { data: allData, error: allError } = await supabase
      .from('R-s')
      .select('*')
      .limit(5);

    console.log('📊 R-s 테이블 전체 데이터 샘플:', { allData, allError });

    if (allError) {
      console.error('❌ 테이블 접근 실패:', allError);
      return [];
    }

    // 2단계: status=2 조건으로 필터링
    console.log('2️⃣ status=2 조건으로 필터링 중...');
    const { data, error } = await supabase
      .from('R-s')
      .select('id, subject, status')
      .eq('status', 2);

    console.log('🎯 R-s status=2 필터링 결과:', { data, error, count: data?.length });

    if (error) {
      console.error('❌ Subject 데이터 로드 실패:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ status=2인 subject 데이터가 없습니다');
    } else {
      console.log('✅ Subject 데이터 로드 성공:', data);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Subject 데이터 로드 예외:', error);
    return [];
  }
};

// R-r 테이블에서 status가 2인 rule 항목들을 가져오는 함수
export const fetchRules = async () => {
  try {
    console.log('🔍 Rule 데이터 요청 시작 (R-r 테이블)...');
    
    // 1단계: 테이블 전체 구조 확인
    console.log('1️⃣ 테이블 구조 확인 중...');
    const { data: allData, error: allError } = await supabase
      .from('R-r')
      .select('*')
      .limit(5);

    console.log('📊 R-r 테이블 전체 데이터 샘플:', { allData, allError });

    if (allError) {
      console.error('❌ 테이블 접근 실패:', allError);
      return [];
    }

    // 2단계: status=2 조건으로 필터링
    console.log('2️⃣ status=2 조건으로 필터링 중...');
    const { data, error } = await supabase
      .from('R-r')
      .select('id, rule, status')
      .eq('status', 2);

    console.log('🎯 R-r status=2 필터링 결과:', { data, error, count: data?.length });

    if (error) {
      console.error('❌ Rule 데이터 로드 실패:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ status=2인 rule 데이터가 없습니다');
    } else {
      console.log('✅ Rule 데이터 로드 성공:', data);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Rule 데이터 로드 예외:', error);
    return [];
  }
};

// R-s 테이블의 subject status를 1로 업데이트하는 함수
export const updateSubjectStatus = async (id: number) => {
  try {
    const { error } = await supabase
      .from('R-s')
      .update({ status: 1 })
      .eq('id', id);

    if (error) {
      console.error('Subject 상태 업데이트 실패:', error);
      return false;
    }

    console.log(`Subject ID ${id} 상태를 1로 업데이트 완료`);
    return true;
  } catch (error) {
    console.error('Subject 상태 업데이트 실패:', error);
    return false;
  }
};

// R-r 테이블의 rule status를 1로 업데이트하는 함수
export const updateRuleStatus = async (id: number) => {
  try {
    const { error } = await supabase
      .from('R-r')
      .update({ status: 1 })
      .eq('id', id);

    if (error) {
      console.error('Rule 상태 업데이트 실패:', error);
      return false;
    }

    console.log(`Rule ID ${id} 상태를 1로 업데이트 완료`);
    return true;
  } catch (error) {
    console.error('Rule 상태 업데이트 실패:', error);
    return false;
  }
};

// 가능한 테이블 이름들을 시도해보는 함수
export const findTableNames = async () => {
  const possibleSubjectNames = ['subject', 'subjects', 'Subject', 'Subjects', 'r_subject', 'r_subjects'];
  const possibleRuleNames = ['rule', 'rules', 'Rule', 'Rules', 'r_rule', 'r_rules'];
  
  console.log('테이블 이름 탐색 시작...');
  
  // Subject 테이블 이름 찾기
  let foundSubjectTable = null;
  for (const tableName of possibleSubjectNames) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`✅ Subject 테이블 발견: ${tableName}`, data);
        foundSubjectTable = tableName;
        break;
      } else {
        console.log(`❌ ${tableName} 테이블 없음:`, error.message);
      }
    } catch (e) {
      console.log(`❌ ${tableName} 테이블 접근 실패`);
    }
  }
  
  // Rule 테이블 이름 찾기
  let foundRuleTable = null;
  for (const tableName of possibleRuleNames) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`✅ Rule 테이블 발견: ${tableName}`, data);
        foundRuleTable = tableName;
        break;
      } else {
        console.log(`❌ ${tableName} 테이블 없음:`, error.message);
      }
    } catch (e) {
      console.log(`❌ ${tableName} 테이블 접근 실패`);
    }
  }
  
  return { foundSubjectTable, foundRuleTable };
};

// 모든 테이블 목록을 가져오는 함수 (가능하다면)
export const listAllTables = async () => {
  try {
    // information_schema를 통해 테이블 목록 조회 시도
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log('데이터베이스 테이블 목록:', { data, error });
    return data;
  } catch (error) {
    console.log('테이블 목록 조회 실패:', error);
    return null;
  }
};

// RLS 정책 및 테이블 상태 확인을 위한 테스트 함수
export const testTableAccess = async () => {
  console.log('🔍 테이블 접근 권한 테스트 시작...');
  
  try {
    // 1. R-s 테이블 테스트 데이터 삽입 시도
    console.log('1️⃣ R-s 테이블 쓰기 권한 테스트...');
    const { data: insertSubject, error: insertSubjectError } = await supabase
      .from('R-s')
      .insert([
        { subject: 'TEST_SUBJECT', status: 2 }
      ])
      .select();

    console.log('R-s 삽입 테스트 결과:', { insertSubject, insertSubjectError });

    // 2. R-r 테이블 테스트 데이터 삽입 시도
    console.log('2️⃣ R-r 테이블 쓰기 권한 테스트...');
    const { data: insertRule, error: insertRuleError } = await supabase
      .from('R-r')
      .insert([
        { rule: 'TEST_RULE', status: 2 }
      ])
      .select();

    console.log('R-r 삽입 테스트 결과:', { insertRule, insertRuleError });

    // 3. 다시 데이터 조회 시도
    console.log('3️⃣ 삽입 후 데이터 조회 테스트...');
    const { data: subjectsAfter, error: subjectsAfterError } = await supabase
      .from('R-s')
      .select('*');

    const { data: rulesAfter, error: rulesAfterError } = await supabase
      .from('R-r')
      .select('*');

    console.log('삽입 후 R-s 데이터:', { subjectsAfter, subjectsAfterError });
    console.log('삽입 후 R-r 데이터:', { rulesAfter, rulesAfterError });

    return {
      insertSubject: { data: insertSubject, error: insertSubjectError },
      insertRule: { data: insertRule, error: insertRuleError },
      subjectsAfter: { data: subjectsAfter, error: subjectsAfterError },
      rulesAfter: { data: rulesAfter, error: rulesAfterError }
    };

  } catch (error) {
    console.error('❌ 테이블 접근 테스트 예외:', error);
    return null;
  }
};

// status=1인 모든 항목을 status=0으로 변경하는 함수
export const resetAllStatusToZero = async () => {
  try {
    console.log('🔄 모든 status=1 항목을 0으로 변경 중...');
    
    const [subjectResult, ruleResult] = await Promise.all([
      supabase
        .from('R-s')
        .update({ status: 0 })
        .eq('status', 1),
      supabase
        .from('R-r')
        .update({ status: 0 })
        .eq('status', 1)
    ]);

    console.log('Subject status=1→0 결과:', subjectResult);
    console.log('Rule status=1→0 결과:', ruleResult);

    if (subjectResult.error || ruleResult.error) {
      console.error('Status 초기화 실패:', { subjectResult, ruleResult });
      return false;
    }

    console.log('✅ 모든 status=1 항목이 0으로 변경됨');
    return true;
  } catch (error) {
    console.error('❌ Status 초기화 예외:', error);
    return false;
  }
};

// 현재 선택된 항목들의 status를 1로 변경하는 함수
export const setCurrentItemsToOne = async (subjectId: number, ruleId: number) => {
  try {
    console.log(`🎯 현재 선택된 항목들을 status=1로 변경 중... (Subject ID: ${subjectId}, Rule ID: ${ruleId})`);
    
    const [subjectResult, ruleResult] = await Promise.all([
      supabase
        .from('R-s')
        .update({ status: 1 })
        .eq('id', subjectId),
      supabase
        .from('R-r')
        .update({ status: 1 })
        .eq('id', ruleId)
    ]);

    console.log('Subject status→1 결과:', subjectResult);
    console.log('Rule status→1 결과:', ruleResult);

    if (subjectResult.error || ruleResult.error) {
      console.error('현재 항목 status 변경 실패:', { subjectResult, ruleResult });
      return false;
    }

    console.log('✅ 현재 선택된 항목들이 status=1로 변경됨');
    return true;
  } catch (error) {
    console.error('❌ 현재 항목 status 변경 예외:', error);
    return false;
  }
};

// status=1인 항목들을 가져오는 함수 (Top Bar 표시용)
export const fetchStatusOneItems = async () => {
  try {
    const [subjectResult, ruleResult] = await Promise.all([
      supabase
        .from('R-s')
        .select('id, subject, status')
        .eq('status', 1)
        .limit(1),
      supabase
        .from('R-r')
        .select('id, rule, status')
        .eq('status', 1)
        .limit(1)
    ]);

    const subject = subjectResult.data?.[0] || null;
    const rule = ruleResult.data?.[0] || null;

    console.log('Status=1 항목들:', { subject, rule });

    return { subject, rule };
  } catch (error) {
    console.error('❌ Status=1 항목 조회 실패:', error);
    return { subject: null, rule: null };
  }
}; 