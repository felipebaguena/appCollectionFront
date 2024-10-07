'use client'

import styled from 'styled-components';
import Button, { ButtonProps } from '@/components/ui/Button';

export const NavbarContainer = styled.nav`
  width: 100%;
  background-color: var(--dark-grey);
  padding: 0.3rem 0;
  position: relative;
`;

export const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const NavbarSection = styled.div<{ $position: 'left' | 'center' | 'right' }>`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: ${props => {
    switch(props.$position) {
      case 'left': return 'flex-start';
      case 'center': return 'center';
      case 'right': return 'flex-end';
    }
  }};
`;

export const Logo = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
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

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  color: var(--grey);
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: opacity 0.3s ease;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.7;
  }

  svg {
    margin-right: 0.5rem; // Añade un pequeño margen a la derecha del icono si hay texto
  }
`;