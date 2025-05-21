import React, { useState } from 'react';
import styled from '@emotion/styled';

const TooltipBox = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
  display: ${props => props.x === 0 ? 'none' : 'block'};
`;

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const showTooltip = (event: React.MouseEvent) => {
    setPosition({
      x: event.pageX + 10,
      y: event.pageY + 10
    });
  };

  const hideTooltip = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <TooltipBox x={position.x} y={position.y}>
      {text}
    </TooltipBox>
  );
}; 