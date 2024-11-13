'use client'

import styled, { css } from 'styled-components';

interface BannerBackgroundProps {
  imageUrl: string;
  oldTvEffect?: 'classic' | 'vibrant' | 'muted' | 'sepia' | false;
}

interface BannerContainerProps {
  height?: string;
}

const oldTvEffectClassic = css`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right, 
      rgba(255,0,0,0.1), 
      rgba(0,255,0,0.1), 
      rgba(0,0,255,0.1)
    );
    mix-blend-mode: screen;
    pointer-events: none;
  }

  filter: 
    saturate(150%)
    contrast(110%)
    brightness(110%)
    hue-rotate(5deg);
`;

const oldTvEffectVibrant = css`
  filter: 
    saturate(200%)
    contrast(130%)
    brightness(120%)
    hue-rotate(10deg);
`;

const oldTvEffectMuted = css`
  filter: 
    saturate(80%)
    contrast(90%)
    brightness(90%)
    sepia(20%);
`;

const oldTvEffectSepia = css`
  filter: 
    sepia(100%)
    saturate(150%)
    contrast(110%)
    brightness(90%)
    hue-rotate(-10deg);
`;

const getOldTvEffect = (effect: BannerBackgroundProps['oldTvEffect']) => {
  switch (effect) {
    case 'classic':
      return oldTvEffectClassic;
    case 'vibrant':
      return oldTvEffectVibrant;
    case 'muted':
      return oldTvEffectMuted;
    case 'sepia':
      return oldTvEffectSepia;
    default:
      return '';
  }
};

export const BannerContainer = styled.div<BannerContainerProps>`
  width: 100%;
  height: ${props => props.height || '20rem'};
  position: relative;
  overflow: hidden;
  background-color: var(--grey);
`;

export const BannerBackground = styled.div<BannerBackgroundProps>`
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  height: 100%;
  position: relative;
  overflow: hidden;

  ${props => props.oldTvEffect && getOldTvEffect(props.oldTvEffect)}
`;

export const LogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

export const BannerLogo: React.FC = () => {
  return (
    <img
      alt="Logo del banner"
      src="http://localhost:3000/uploads/front/9012830ed42a379256f01ed070157d7f.jpg"
      width={200}
      height={100}
    />
  );
};

export const BannerTextLogo = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--white);
  margin: 0;
  padding: 0;
  text-align: center;
`;

export const HomeContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0rem;

  @media (max-width: 1200px) {
    padding: 1rem 1rem;
  }
`;

export const HomeTitle = styled.h1`
  font-size: 2rem;
  color: var(--dark-grey);
  margin-bottom: 1rem;
`;

export const HomeSection = styled.section`
  margin-bottom: 2rem;
`;

export const InfoCardWrapper = styled.div`
  width: 100%;
  background-color: var(--dark-grey);
`;

export const InfoCardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;