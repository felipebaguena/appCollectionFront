'use client'

import React from 'react';
import {
  BannerContainer,
  BannerBackground,
  HomeContent,
  HomeSection
} from '@/components/home/HomeElements';
import GameGrid from '@/components/home/GameGrid';
import CRTScanlines from '@/components/ui/CRTScanlines';

const BANNER_HOME_IMAGE = "http://localhost:3000/uploads/front/9012830ed42a379256f01ed070157d7f.jpg"

export default function HomePage() {
  return (
    <>
      <BannerContainer height='24rem'>
        <CRTScanlines />
        <BannerBackground
          imageUrl={BANNER_HOME_IMAGE}
          oldTvEffect='vibrant'
        />
      </BannerContainer>
      <HomeContent>
        <HomeSection>
          <GameGrid />
        </HomeSection>
      </HomeContent>
    </>
  );
}