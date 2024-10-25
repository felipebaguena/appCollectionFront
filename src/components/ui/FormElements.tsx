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
  margin-bottom: 0.3rem;
  color: var(--light-grey);
  font-weight: bold;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;

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

// Nuevos componentes para ViewGameForm
export const FormContainer = styled.div<{ direction?: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: wrap;
  gap: 1rem;
`;

export const FormColumn = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const FieldValue = styled.div`
  padding: 0.1rem;
  background-color: var(--mid-grey);
  border-radius: 4px;
  color: var(--light-grey);
  margin-bottom: 1rem;
`;

export const ViewForm = styled(StyledForm)`
  color: var(--clear-grey);
`;

export const CoverImage = styled.img`
  width: 100%;
  max-height: 12rem;
  object-fit: cover;
  margin-bottom: 0.5rem;
`;

export const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  min-height: 100px;
`;
