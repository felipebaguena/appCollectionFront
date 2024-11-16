'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticlesArchiveView from '@/components/articles/ArticlesArchiveView';

export default function ArticlesHomePage() {
    const searchParams = useSearchParams();
    const [selectedGameId, setSelectedGameId] = useState<string | null>(() => {
        return searchParams?.get('gameId') || null;
    });
    const [selectedGameTitle, setSelectedGameTitle] = useState<string>(() => {
        const gameTitle = searchParams?.get('gameTitle');
        return gameTitle ? decodeURIComponent(gameTitle) : '';
    });

    useEffect(() => {
        if (searchParams) {
            const gameId = searchParams.get('gameId');
            const gameTitle = searchParams.get('gameTitle');

            if (gameId && gameTitle) {
                const decodedTitle = decodeURIComponent(gameTitle);

                setSelectedGameId(gameId);
                setSelectedGameTitle(decodedTitle);
            }
        }
    }, [searchParams]);

    const handleGameChange = (gameId: string | null, gameTitle: string = '') => {
        setSelectedGameId(gameId);
        setSelectedGameTitle(gameTitle);
    };

    return (
        <ArticlesArchiveView
            key={selectedGameId}
            selectedGameId={selectedGameId}
            selectedGameTitle={selectedGameTitle}
            onGameChange={handleGameChange}
        />
    );
}
