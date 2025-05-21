import React from 'react';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  display: flex;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  background-color: #fefefe;
  padding: 20px;
  width: 70%;
  height: 90vh;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  font-size: 40px;
  z-index: 10001;
  &:hover {
    color: #666;
  }
`;

const SpreadsheetIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <SpreadsheetIframe
          src="https://docs.google.com/spreadsheets/d/16JFMvjIvOBLaO0z0gKxwGRowVXV2SavNhSMU0cUpjPY/edit?usp=sharing"
          title="Spreadsheet"
        />
      </ModalContent>
    </ModalOverlay>
  );
}; 