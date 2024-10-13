'use client'

import React from 'react';
import {
  BannerContainer,
  BannerBackground,
  HomeContent,
  HomeSection
} from '@/components/home/HomeElements';
import GameGrid from '@/components/home/GameGrid';
import InfoCard from '@/components/home/InfoCard';
import CRTScanlines from '@/components/ui/CRTScanlines';

const BANNER_HOME_IMAGE = "http://localhost:3000/uploads/front/9012830ed42a379256f01ed070157d7f.jpg"
const INFO_CARD_IMAGE = "http://localhost:3000/uploads/front/garou.jpg"

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
        <HomeSection>
          <InfoCard
            imageUrl={INFO_CARD_IMAGE}
            title="Descubre nuestra colección"
            description="Explora nuestra amplia selección de juegos retro y revive la magia de las épocas doradas del gaming. Desde clásicos arcade hasta joyas de consolas, tenemos algo para cada tipo de jugador nostálgico."
          />
        </HomeSection>
      </HomeContent>
    </>
  );
}
