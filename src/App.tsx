import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Mode, Colors, DeadlineInfo, SubjectItem, RuleItem } from './types';
import { fetchSubjects, fetchRules, updateSubjectStatus, updateRuleStatus, testConnection, testTableAccess, resetAllStatusToZero, setCurrentItemsToOne, fetchStatusOneItems } from './services/supabaseService';
import { Modal } from './components/Modal';
import { SecurityModal } from './components/SecurityModal';
import { Loading } from './components/Loading';
import { Tooltip } from './components/Tooltip';

const colors: Colors = {
  R: { left: '#FFFB92', right: '#00F6FF' },
  D: { left: '#FFC2F5', right: '#C3FFC6' }
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2vh 5vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const DateInfo = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const DeadlineBox = styled.div`
  background: white;
  border: 1px solid black;
  padding: 0.2rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CenterTitle = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  
`;

const RightSection = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const StatusOneDisplay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
`;

const StatusOneItem = styled.div`
  background: white;
  border: 1px solid black;
  padding: 0.2rem 0.75rem;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModeSelector = styled.div`
  font-size: 30px;
  display: flex;
  gap: 1rem;
`;

const ModeButton = styled.span<{ active: boolean }>`
  cursor: pointer;
  padding: 0 5px;
  text-decoration: ${props => props.active ? 'underline' : 'none'};
  text-underline-offset: 5px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Panel = styled.div<{ mode: Mode; isTop: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
  position: fixed;
  padding: 15vh 5vw 2vh 5vw;
  ${props => props.isTop ? 'top: 0;' : 'bottom: 0;'}
`;

const SubjectPanel = styled(Panel)`
  background: ${props => props.mode === 'R' 
    ? 'linear-gradient(to top, #FFFB92 15%, white 70%)' 
    : 'linear-gradient(to top, #FFC2F5 15%, white 70%)'};
`;

const RulePanel = styled(Panel)`
  background: ${props => props.mode === 'R' 
    ? 'linear-gradient(to bottom, #00F6FF 15%, white 70%)'
    : 'linear-gradient(to bottom, #C3FFC6 15%, white 70%)'};
  padding: 1vh 5vw 15vh 5vw;
`;

const BottomText = styled.div`
  color: black;
  z-index: 100;
  position: fixed;
  bottom: 7vh;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  font-size: 40px;
  padding: 10px 20px;
  border: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
`;

const CheckButton = styled(Button)`
  font-size: 40px;
  padding: 10px 20px;
  border: 1.5px solid black;
  background-color: white;
  color: black;
`;

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<Mode>('R');
  const [subjectData, setSubjectData] = useState<string>('');
  const [ruleData, setRuleData] = useState<string>('');
  const [currentSubjectId, setCurrentSubjectId] = useState<number | null>(null);
  const [currentRuleId, setCurrentRuleId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [statusOneSubject, setStatusOneSubject] = useState<string>('');
  const [statusOneRule, setStatusOneRule] = useState<string>('');
  const [deadlineInfo, setDeadlineInfo] = useState<DeadlineInfo>({
    number: '',
    date: '',
    nextDeadline: new Date()
  });
  const [remainingTime, setRemainingTime] = useState<string>('');

  const getNextDeadline = (): DeadlineInfo => {
    const now = new Date();
    const baseDate = new Date('2025-03-07T00:00:00');
    const baseNumber = 5;

    if (now < baseDate) {
      const adjustedDeadline = new Date(baseDate);
      adjustedDeadline.setDate(baseDate.getDate() + 1);
      return {
        number: String(baseNumber).padStart(3, '0'),
        date: '03.07 24:00',
        nextDeadline: adjustedDeadline
      };
    }

    const timeDiff = now.getTime() - baseDate.getTime();
    const weeksPassed = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)) + 1;
    const number = baseNumber + weeksPassed;

    let nextDeadline = new Date(baseDate);
    nextDeadline.setDate(baseDate.getDate() + weeksPassed * 7);
    nextDeadline.setDate(nextDeadline.getDate() + 1);

    const month = String(nextDeadline.getMonth() + 1).padStart(2, '0');
    const day = String(nextDeadline.getDate()).padStart(2, '0');

    return {
      number: String(number).padStart(3, '0'),
      date: `${month} / ${day}`,
      nextDeadline
    };
  };

  const updateRemainingTime = () => {
    const { nextDeadline } = getNextDeadline();
    const timeLeft = nextDeadline.getTime() - new Date().getTime();

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setRemainingTime(`${days}days ${hours}hours ${minutes}minutes ${seconds}seconds left`);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // R 모드에서만 작동하도록 제한
      if (currentMode !== 'R') {
        setSubjectData("D 모드는 아직 지원되지 않습니다");
        setRuleData("D 모드는 아직 지원되지 않습니다");
        setIsLoading(false);
        return;
      }

      const [subjects, rules] = await Promise.all([
        fetchSubjects(),
        fetchRules()
      ]);

      if (subjects.length === 0 || rules.length === 0) {
        setSubjectData("사용 가능한 항목이 없습니다");
        setRuleData("사용 가능한 항목이 없습니다");
        setCurrentSubjectId(null);
        setCurrentRuleId(null);
      } else {
        // 랜덤 선택
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const randomRule = rules[Math.floor(Math.random() * rules.length)];

        setSubjectData(randomSubject.subject || '');
        setRuleData(randomRule.rule || '');
        setCurrentSubjectId(randomSubject.id);
        setCurrentRuleId(randomRule.id);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setSubjectData("데이터 로드에 실패했습니다");
      setRuleData("데이터 로드에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // status=1 항목들을 로드하는 함수
  const loadStatusOneItems = async () => {
    try {
      const { subject, rule } = await fetchStatusOneItems();
      setStatusOneSubject(subject?.subject || '');
      setStatusOneRule(rule?.rule || '');
    } catch (error) {
      console.error('Status=1 항목 로드 실패:', error);
    }
  };

  useEffect(() => {
    // 연결 테스트 및 테이블 접근 테스트 후 데이터 로드
    const runTests = async () => {
      await testConnection();
      await testTableAccess();
      loadData();
      loadStatusOneItems(); // status=1 항목들도 로드
    };
    
    runTests();
  }, [currentMode]);

  useEffect(() => {
    setDeadlineInfo(getNextDeadline());
    const timer = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 체크 버튼 클릭 시 보안 모달 열기
  const handleCheckClick = () => {
    setIsSecurityModalOpen(true);
  };

  // 보안 확인 후 실행되는 함수
  const handleSecurityConfirm = async () => {
    if (!currentSubjectId || !currentRuleId) {
      console.error('선택된 항목이 없습니다');
      return;
    }

    try {
      
      // 1. 모든 status=1 항목을 0으로 변경
      const resetSuccess = await resetAllStatusToZero();
      if (!resetSuccess) {
        throw new Error('Status 초기화 실패');
      }

      // 2. 현재 선택된 항목들을 status=1로 변경
      const updateSuccess = await setCurrentItemsToOne(currentSubjectId, currentRuleId);
      if (!updateSuccess) {
        throw new Error('현재 항목 업데이트 실패');
      }

      // 3. 새로운 데이터 로드
      await loadData();
      
      // 4. status=1 항목들 업데이트
      await loadStatusOneItems();

      console.log('✅ 모든 상태 업데이트 완료');
    } catch (error) {
      console.error('❌ 상태 업데이트 실패:', error);
    }
  };

  return (
    <AppContainer>
      <TopBar>
        <LeftSection>
          <DateInfo>
            <p>{deadlineInfo.date}</p>
          </DateInfo>
          <DeadlineBox>
            <span className="remaining-time">{remainingTime}</span>
          </DeadlineBox>
        </LeftSection>
        <CenterTitle>
          <h1 className="text-[6rem] mt-10 font-bold">PPP</h1>
        </CenterTitle>
        <RightSection>
          <StatusOneDisplay>
            {statusOneSubject && (
              <StatusOneItem title={statusOneSubject}>
                {statusOneSubject}
              </StatusOneItem>
            )}
            {statusOneRule && (
              <StatusOneItem title={statusOneRule}>
                {statusOneRule}
              </StatusOneItem>
            )}
          </StatusOneDisplay>
          <ModeSelector>
            <ModeButton
              active={currentMode === 'R'}
              onClick={() => setCurrentMode('R')}
              title="rheeghang"
            >
              R
            </ModeButton>
            /
            <ModeButton
              active={currentMode === 'D'}
              onClick={() => setCurrentMode('D')}
              title="dandan"
            >
              D
            </ModeButton>
          </ModeSelector>
        </RightSection>
      </TopBar>
      <Content>
        <SubjectPanel mode={currentMode} isTop={true} className="items-center justify-center text-center">
          <h2 className="text-4xl font-bold">Subject</h2>
          {isLoading ? <Loading /> : <div id="subject-data" className="text-center w-full text-xl pt-10">{subjectData}</div>}
        </SubjectPanel>
        <RulePanel mode={currentMode} isTop={false} className=" items-center justify-center text-center">
          <h2 className="text-4xl font-bold">Rule</h2>
          {isLoading ? <Loading /> : <div id="rule-data" className="text-center w-full text-xl pt-10">{ruleData}</div>}
        </RulePanel>
      </Content>
      <BottomText>
        <Button onClick={loadData}>Pick Random</Button>
        <CheckButton onClick={handleCheckClick}>✓</CheckButton>
      </BottomText>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SecurityModal 
        isOpen={isSecurityModalOpen} 
        onConfirm={handleSecurityConfirm}
        onCancel={() => setIsSecurityModalOpen(false)}
      />
    </AppContainer>
  );
};

export default App;
