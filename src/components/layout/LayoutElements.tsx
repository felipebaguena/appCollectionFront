'use client'

import styled, { keyframes, css } from 'styled-components';
import { NAVBAR_HEIGHT } from './NavbarElements';

const filmGrainAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-5%);
  }
  20% {
    transform: translateY(5%);
  }
  30% {
    transform: translateY(-10%);
  }
  40% {
    transform: translateY(15%);
  }
  50% {
    transform: translateY(5%);
  }
  60% {
    transform: translateY(0);
  }
  70% {
    transform: translateY(10%);
  }
  80% {
    transform: translateY(35%);
  }
  90% {
    transform: translateY(10%);
  }
  100% {
    transform: translateY(0);
  }
`;

interface PageWrapperProps {
  enableFilmEffect?: boolean;
}

export const PageWrapper = styled.div<PageWrapperProps>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  & > *:not(nav) {
    position: relative;
    z-index: 1;
  }

  ${props => props.enableFilmEffect && css`
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      pointer-events: none;
    }

    &::before {
      z-index: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.1;
      animation: ${filmGrainAnimation} 8s steps(10) infinite;
    }

    &::after {
      z-index: 0;
      background: 
        radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%),
        linear-gradient(to bottom, rgba(255,255,240,0.1) 0%, rgba(255,255,240,0) 100%);
    }
  `}
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  padding-top: ${NAVBAR_HEIGHT};
`;
