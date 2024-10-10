'use client'

import React from 'react';
import {
  BannerContainer,
  BannerBackground,
  LogoContainer,
  BannerLogo,
  HomeContent,
  HomeSection
} from '@/components/home/HomeElements';
import GameGrid from '@/components/home/GameGrid';


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
        <HomeSection>
          <GameGrid />
        </HomeSection>
      </HomeContent>
    </>
  );
}