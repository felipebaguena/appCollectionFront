'use client'

import styled from 'styled-components';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:disabled {
    background-color: #f0f0f0;
    color: var(--dark-grey);
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

interface MessageProps {
  error?: boolean;
}

export const Message = styled.p<MessageProps>`
  margin-top: 1rem;
  color: ${props => props.error ? 'red' : 'green'};
`;

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8em;
  margin-top: 0.2em;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;