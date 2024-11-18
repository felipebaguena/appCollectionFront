'use client'

import React from 'react';
import {
  HomeContent,
} from '@/components/home/HomeElements';
import GameGrid from '@/components/home/GameGrid';
import InfoCard from '@/components/home/InfoCard';
import HomeArticlesSection from '@/components/home/HomeArticlesSection';
import CollectionBanner from '@/components/home/CollectionBanner';

const INFO_CARD_IMAGE_CATALOG = "http://localhost:3000/uploads/front/md_collection.jpg"
const INFO_CARD_IMAGE_COLLECTION = "http://localhost:3000/uploads/front/dc_collection.jpg"

export default function HomePage() {
  return (
    <>
      <HomeArticlesSection />
      <CollectionBanner />
      <InfoCard
        imageUrl={INFO_CARD_IMAGE_COLLECTION}
        title="Gestiona tu colección"
        description="Registra tus juegos, valora sus estados de conservación, puntúa la calidad de los títulos y mantén un seguimiento de tus videojuegos retro favoritos."
        contentLeft
        bannerCollection
      />
      <HomeContent>
        <GameGrid />
      </HomeContent>
      <InfoCard
        imageUrl={INFO_CARD_IMAGE_CATALOG}
        title="Descubre nuestro catálogo"
        description="Explora nuestra amplia selección de juegos retro y revive la magia de las épocas doradas del gaming. Desde clásicos arcade hasta joyas de consolas, tenemos algo para cada tipo de jugador."
      />
    </>
  );
}
