'use client'

import styled from 'styled-components';
import Button, { ButtonProps } from '@/components/ui/Button';
import Link from 'next/link';

export const NAVBAR_HEIGHT = '3.5rem';

export const NavbarContainer = styled.nav`
  width: 100%;
  height: ${NAVBAR_HEIGHT};
  display: flex;
  background-color: var(--dark-grey);
  padding: 0.3rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

export const NavbarContent = styled.div`
  display: flex;
  width: 100%;
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
    switch (props.$position) {
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

export const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const NavButton = styled(Button) <ButtonProps>`
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

export const NavLink = styled(Link)`
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
    margin-right: 0.5rem;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 20px;
    background: transparent;
  }
`;

export const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(${NAVBAR_HEIGHT} - 0.5rem);
  right: 0;
  background-color: var(--dark-grey);
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  padding: 0.5rem 0;
  min-width: 200px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;

  margin-top: -20px;
  padding-top: 20px;
`;

export const DropdownContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 1rem;
`;

export const DropdownItem = styled(NavLink)`
  display: block;
  padding: 0.5rem 1rem;
  color: var(--grey);
  text-decoration: none;
  width: 100%;
  text-align: left;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

export const DropdownTrigger = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;
