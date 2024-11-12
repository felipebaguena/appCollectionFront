"use client";

import styled, { css } from "styled-components";

export type ButtonVariant =
  | 'dark'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'cancel'
  | 'upload'
  | 'refresh'
  | 'outline'

export interface ButtonProps {
  $variant?: ButtonVariant;
  $customColor?: string;
  $primary?: boolean;
  $fullWidth?: boolean;
  $halfWidth?: boolean;
  disabled?: boolean;
}

const getButtonStyles = (props: ButtonProps) => {
  switch (props.$variant) {
    case "primary":
    case "secondary":
      return css`
        background-color: var(--app-yellow);
        color: var(--dark-grey);
        border: none;
      `;
    case "cancel":
      return css`
        background-color: var(--cancel-grey);
        color: white;
        border: none;
      `;
    case "danger":
      return css`
        background-color: var(--danger-color, #dc3545);
        color: white;
        border: none;
      `;
    case "dark":
      return css`
        background-color: var(--dark-grey, #343a40);
        color: white;
        border: none;
      `;
    case "upload":
      return css`
        background-color: #28a745;
        border: none;
        &:hover {
          background-color: #218838;
        }
      `;
    case "refresh":
      return css`
        background-color: #17a2b8;
        border: none;
        &:hover {
          background-color: #138496;
        }
      `;
    case "outline":
      return css`
        background-color: var(--background, #ffffff);
        color: var(--dark-grey);
        border: 1px solid var(--dark-grey);
        
        svg {
          fill: var(--dark-grey);
        }
        
        &:hover {
          background-color: var(--dark-grey);
          color: var(--background, #ffffff);
          
          svg {
            fill: var(--background, #ffffff);
          }
        }
      `;
    default:
      return css`
        background-color: ${props.$customColor || "var(--background, #ffffff)"};
        color: var(--foreground, #000000);
        border: none;
      `;
  }
};

const Button = styled.button<ButtonProps>`
  ${(props) => getButtonStyles(props)}
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  width: ${(props) =>
    props.$fullWidth ? "100%" :
      props.$halfWidth ? "50%" :
        "auto"};

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
