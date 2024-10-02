'use client'

import styled, { css } from 'styled-components';

export interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger' | 'dark';
  $customColor?: string;
  $primary?: boolean;
  disabled?: boolean;
}

const getButtonStyles = (props: ButtonProps) => {
  if (props.$primary || props.$variant === 'primary') {
    return css`
      background-color: var(--primary-color, #007bff);
      color: white;
    `;
  }
  switch (props.$variant) {
    case 'secondary':
      return css`
        background-color: var(--secondary-color, #6c757d);
        color: white;
      `;
    case 'danger':
      return css`
        background-color: var(--danger-color, #dc3545);
        color: white;
      `;
    case 'dark':
      return css`
        background-color: var(--dark-color, #343a40);
        color: white;
      `;
    default:
      return css`
        background-color: ${props.$customColor || 'var(--background, #ffffff)'};
        color: var(--foreground, #000000);
      `;
  }
};

const Button = styled.button<ButtonProps>`
  ${props => getButtonStyles(props)}
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;