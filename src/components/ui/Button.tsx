"use client";

import styled, { css } from "styled-components";

export interface ButtonProps {
  $variant?: "primary" | "secondary" | "danger" | "dark" | "cancel";
  $customColor?: string;
  $primary?: boolean;
  $fullWidth?: boolean;
  $halfWidth?: boolean;
  disabled?: boolean;
}

const getButtonStyles = (props: ButtonProps) => {
  if (props.$primary || props.$variant === "primary") {
    return css`
      background-color: var(--app-yellow);
      color: var(--dark-grey);
      font-weight: bold;
    `;
  }
  switch (props.$variant) {
    case "secondary":
      return css`
        background-color: var(--app-yellow);
        color: var(--dark-grey);
        font-weight: bold;
      `;
    case "cancel":
      return css`
        background-color: var(--cancel-grey);
        color: white;
        font-weight: bold;
      `;
    case "danger":
      return css`
        background-color: var(--danger-color, #dc3545);
        color: white;
        font-weight: bold;
      `;
    case "dark":
      return css`
        background-color: var(--dark-color, #343a40);
        color: white;
        font-weight: bold;
      `;
    default:
      return css`
        background-color: ${props.$customColor || "var(--background, #ffffff)"};
        color: var(--foreground, #000000);
        font-weight: bold;
      `;
  }
};

const Button = styled.button<ButtonProps>`
  ${(props) => getButtonStyles(props)}
  padding: 0.6rem 3rem;
  border: none;
  border-radius: 1px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  width: ${(props) =>
    props.$fullWidth ? "100%" :
      props.$halfWidth ? "50%" :
        "max-content"};

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
