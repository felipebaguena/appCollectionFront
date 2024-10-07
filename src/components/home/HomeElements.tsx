'use client'

import styled from 'styled-components';

export const BannerContainer = styled.div`
  width: 100%;
  height: 20rem;
  position: relative;
  overflow: hidden;
  background-color: var(--grey)
`;

export const BannerBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/imagen-de-fondo.jpg');
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

export const LogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

export const BannerLogo: React.FC = () => {
    return (
      <img 
        alt="Logo del banner" 
        src="/images/logo.png"
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
  padding: 2rem 1rem;
`;

export const HomeTitle = styled.h1`
  font-size: 2rem;
  color: var(--dark-grey);
  margin-bottom: 1rem;
`;

export const HomeSection = styled.section`
  margin-bottom: 2rem;
`;