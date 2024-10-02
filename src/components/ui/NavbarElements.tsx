import styled from 'styled-components';
import Button, { ButtonProps } from '@/components/ui/Button';

export const NavbarContainer = styled.nav`
  background-color: #f0f0f0;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0.5rem;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

export const NavButton = styled(Button)<ButtonProps>`
  padding: 8px 16px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;