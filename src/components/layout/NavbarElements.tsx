'use client'

import styled from 'styled-components';
import Button, { ButtonProps } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { keyframes } from 'styled-components';
import { FaSync } from 'react-icons/fa';

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

export const LogoHighlight = styled.span<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? 'var(--app-yellow)' : 'var(--grey)'};
  transition: color 0.3s ease;
  font-weight: bold;
`;

export const LogoText = styled.span<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? 'var(--clear-grey)' : 'var(--grey)'};
  transition: color 0.3s ease;
`;

export const LogoContainer = styled.div<{ $isActive?: boolean }>`
  display: flex;
  gap: 0.3rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover ${LogoHighlight} {
    color: var(--app-yellow);
    font-weight: bold;
  }

  &:hover ${LogoText} {
    color: var(--clear-grey);
  }

  @media (max-width: 768px) {
    .full-text {
      display: none;
    }
    .mobile-text {
      display: block;
      color: ${props => props.$isActive ? 'var(--app-yellow)' : 'var(--grey)'};
    }
  }
`;

export const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
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

export const NavLink = styled(Link) <{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.$isActive ? 'var(--app-yellow)' : 'var(--grey)'};
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 1;
    color: var(--app-yellow);
  }

  .nav-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .nav-icon {
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  }

  &.home-link {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const IconNavLink = styled(NavLink)`
  padding: 0.5rem 0.5rem;
`;

export const DropdownTrigger = styled(NavLink) <{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  color: ${props => props.$isActive ? 'var(--app-yellow)' : 'var(--grey)'};

  svg {
    color: ${props => props.$isActive ? 'var(--app-yellow)' : 'var(--grey)'};
  }

  .chevron-icon {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover {
    opacity: 1;
    color: var(--app-yellow);

    svg {
      color: var(--app-yellow);
    }
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

  &[data-open="true"] ${DropdownTrigger} {
    color: var(--app-yellow);
    
    svg {
      color: var(--app-yellow);
    }
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

  @media (max-width: 768px) {
    min-width: 150px;
    right: -50%;
    transform: translateX(50%);
  }
`;

export const DropdownContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 1rem;
`;

export const DropdownItem = styled(NavLink)`
  && {
    display: block;
    padding: 0.5rem 1rem;
    color: var(--grey);
    text-decoration: none;
    width: 100%;
    text-align: left;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--app-yellow);
      color: var(--dark-grey);
      opacity: 1;
    }
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-20px);
  }
  80% {
    opacity: 1;
    transform: translateY(-20px);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
`;

const RefreshMessage = styled.span<{ $isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: -50px;
  transform: translateY(-100%);
  font-size: 0.8rem;
  color: var(--dark-grey);
  pointer-events: none;
  animation: ${fadeInOut} 1.5s ease-in-out;
  opacity: 0;
  white-space: nowrap;
`;

const RefreshButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 0.5rem;
`;

export const RefreshButton = (props: React.ComponentProps<typeof Button>) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  return (
    <RefreshButtonContainer>
      {showMessage && <RefreshMessage $isVisible={showMessage}>¡Refrescado!</RefreshMessage>}
      <Button
        {...props}
        $variant="dark"
        onClick={handleClick}
      >
        <FaSync />
      </Button>
    </RefreshButtonContainer>
  );
};

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const SpinnerCircle = styled.div`
  border: 3px solid var(--mid-grey);
  border-top: 3px solid var(--app-yellow);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
`;

export const NavbarSpinner = styled(SpinnerCircle)`
  width: 1.5rem;
  height: 1.5rem;
  border-width: 3px;
`;

export const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

export const MobileLogoText = styled.span<{ $isActive?: boolean }>`
  display: none;
  color: ${props => props.$isActive ? 'var(--app-yellow)' : 'var(--grey)'};
  font-size: 1.2rem;
  font-weight: bold;

  @media (max-width: 768px) {
    display: block;
  }
`;
