"use client";

import styled, { css } from "styled-components";

export interface ButtonProps {
  $variant?: "primary" | "secondary" | "danger" | "dark" | "cancel" | "upload" | "refresh";
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
      `;
    case "cancel":
      return css`
        background-color: var(--cancel-grey);
        color: white;
      `;
    case "danger":
      return css`
        background-color: var(--danger-color, #dc3545);
        color: white;
      `;
    case "dark":
      return css`
        background-color: var(--dark-grey, #343a40);
        color: white;
      `;
    case "upload":
      return css`
        background-color: #28a745;
        &:hover {
          background-color: #218838;
        }
      `;
    case "refresh":
      return css`
        background-color: #17a2b8;
        &:hover {
          background-color: #138496;
        }
      `;
    default:
      return css`
        background-color: ${props.$customColor || "var(--background, #ffffff)"};
        color: var(--foreground, #000000);
      `;
  }
};

const Button = styled.button<ButtonProps>`
  ${(props) => getButtonStyles(props)}
  padding: 0.6rem 0.8rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
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
