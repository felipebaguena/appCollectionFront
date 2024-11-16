'use client'

import { useState } from 'react';
import ArticlesArchiveView from '@/components/articles/ArticlesArchiveView';

export default function ArticlesHomePage() {
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [selectedGameTitle, setSelectedGameTitle] = useState<string>('');

    const handleGameChange = (gameId: string | null, gameTitle: string = '') => {
        setSelectedGameId(gameId);
        setSelectedGameTitle(gameTitle);
    };

    return (
        <ArticlesArchiveView
            selectedGameId={selectedGameId}
            selectedGameTitle={selectedGameTitle}
            onGameChange={handleGameChange}
        />
    );
}
