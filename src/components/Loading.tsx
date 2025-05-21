import React from 'react';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  position: relative;
  top: 10%;
  left: 55%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
`;

const Dot = styled.div`
  position: absolute;
  width: 17px;
  height: 17px;
  background-color: black;
  border-radius: 50%;
  animation: orbit 1.5s ease-in-out infinite;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.8s; }

  @keyframes orbit {
    0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
    40% { transform: rotate(120deg) translateX(20px) rotate(-120deg); }
    80% { transform: rotate(240deg) translateX(20px) rotate(-240deg); }
    100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
  }
`;

export const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <Dot />
      <Dot />
      <Dot />
    </LoadingContainer>
  );
}; 