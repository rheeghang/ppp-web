import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Mode, Colors, DeadlineInfo, CellFormat } from './types';
import { fetchSheetData, getSheetCellFormats, updateCellBackground } from './services/sheetService';
import { Modal } from './components/Modal';
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

const Header = styled.div`
  color: black;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 3vh 10vw 0 0;
`;

const HeadText = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

`;

const StyledDeadlineInfo = styled.div`
  cursor: help;
  position: relative;
  margin-top: 5px;

  p {
    margin: 0;
  }

  .remaining-time {
    font-size: 24px;
  }
`;

const ModeSelector = styled.div`
  font-size: 30px;
  display: flex;
  gap: 1rem;
  position: fixed;
  top: 3vh;
  right: 10vw;
`;

const ModeButton = styled.span<{ active: boolean }>`
  cursor: pointer;
  padding: 0 5px;
  text-decoration: ${props => props.active ? 'underline' : 'none'};
  text-underline-offset: 5px;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

const Panel = styled.div<{ bgColor: string; isLeft: boolean }>`
  display: inline-block;
  width: 50%;
  height: 100vh;
  position: fixed;
  padding-top: 30vh;
  top: 0;
  background-color: ${props => props.bgColor};
  ${props => props.isLeft ? 'left: 0;' : 'right: 0;'}
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
      return {
        number: String(baseNumber).padStart(3, '0'),
        date: '03.07 24:00',
        nextDeadline: baseDate
      };
    }

    const timeDiff = now.getTime() - baseDate.getTime();
    const weeksPassed = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)) + 1;
    const number = baseNumber + weeksPassed;

    let nextDeadline = new Date(baseDate);
    nextDeadline.setDate(baseDate.getDate() + weeksPassed * 7);

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
    const range = currentMode === 'R' ? "A:B" : "C:D";
    
    try {
      const [data, formatData] = await Promise.all([
        fetchSheetData(range),
        getSheetCellFormats(range)
      ]);

      if (data?.length > 0 && formatData?.sheets?.[0]?.data?.[0]?.rowData) {
        const availableRows = data.slice(1).filter((_, index) => {
          const rowFormat = formatData.sheets[0].data[0].rowData[index + 1]?.values;
          if (!rowFormat) return true;
          
          return !rowFormat.some((cell: CellFormat) => {
            const bgColor = cell?.effectiveFormat?.backgroundColor;
            return bgColor && (bgColor.red !== 1 || bgColor.green !== 1 || bgColor.blue !== 1);
          });
        });

        if (availableRows.length === 0) {
          setSubjectData("사용 가능한 항목이 없습니다");
          setRuleData("사용 가능한 항목이 없습니다");
        } else {
          const randomA = Math.floor(Math.random() * availableRows.length);
          const randomB = Math.floor(Math.random() * availableRows.length);

          setSubjectData(availableRows[randomA][0] || '');
          setRuleData(availableRows[randomB][1] || '');
        }
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMode]);

  useEffect(() => {
    setDeadlineInfo(getNextDeadline());
    const timer = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AppContainer>
      <Header>
        <HeadText>
          <h1>PPP</h1>
          <StyledDeadlineInfo>
            <p>{deadlineInfo.date}</p>
            <span className="remaining-time">{remainingTime}</span>
          </StyledDeadlineInfo>
        </HeadText>
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
      </Header>
      <Content>
        <Panel bgColor={colors[currentMode].left} isLeft={true}>
          <h2>Subject</h2>
          <br />
          {isLoading ? <Loading /> : <div id="subject-data">{subjectData}</div>}
        </Panel>
        <Panel bgColor={colors[currentMode].right} isLeft={false}>
          <h2>Rule</h2>
          <br />
          {isLoading ? <Loading /> : <div id="rule-data">{ruleData}</div>}
        </Panel>
      </Content>
      <BottomText>
        <Button onClick={loadData}>Pick Random</Button>
        <CheckButton onClick={() => setIsModalOpen(true)}>✓</CheckButton>
      </BottomText>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppContainer>
  );
};

export default App;
