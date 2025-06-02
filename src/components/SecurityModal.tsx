import React, { useState } from 'react';
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
  background-color: rgba(248, 248, 248, 0.24);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: rgba(255, 255, 255, 0.84);
  border: 1px solid black;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90vw;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #333;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color:rgb(0, 0, 0);
  }
  
  &.error {
    border-color:rgb(255, 0, 191);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const ConfirmButton = styled(Button)`
  background-color:rgb(0, 0, 0);
  color: white;
  
  &:hover {
    background-color:rgb(107, 107, 107);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  
  &:hover {
    background-color: #545b62;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 0.875rem;
  margin: 0.5rem 0;
`;

interface SecurityModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const correctPassword = 'loveisallaround';

  const handleConfirm = async () => {
    if (password !== correctPassword) {
      setError('oops! wrong password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      setError('처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsLoading(false);
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title className='password-title font-bold'>Hello, Punny Poster Pals!</Title>
        <PasswordInput
          type="password"
          placeholder="Enter the password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className={error ? 'error' : ''}
          disabled={isLoading}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonContainer>
          <CancelButton onClick={handleClose} disabled={isLoading}>
            Cancel
          </CancelButton>
          <ConfirmButton onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'loading...' : 'Confirm'}
          </ConfirmButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}; 