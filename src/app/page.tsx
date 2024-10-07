'use client'

import React from 'react';
import {
  BannerContainer,
  BannerBackground,
  LogoContainer,
  BannerLogo,
  BannerTextLogo,
  HomeContent,
  HomeTitle,
  HomeSection
} from '@/components/home/HomeElements';

export default function HomePage() {
  return (
    <>
      <BannerContainer>
        <BannerBackground />
        <LogoContainer>
          <BannerLogo/>
        </LogoContainer>
      </BannerContainer>
      <HomeContent>
        <HomeTitle>Página de inicio</HomeTitle>
        <HomeSection>
          {/* Contenido de la sección */}
        </HomeSection>
      </HomeContent>
    </>
  );
}