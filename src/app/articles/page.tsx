'use client';

import React from 'react';
import { useGames } from '@/hooks/useGames';
import CreateArticleForm from '@/components/articles/CreateArticleForm';
import { useRouter } from 'next/navigation';

export default function CreateArticlePage() {
    const router = useRouter();
    const { genres, platforms, developers } = useGames();

    const handleClose = () => {
        router.push('/management/manage-articles');
    };

    const handleArticleCreated = () => {
        router.push('/management/manage-articles');
    };

    const formattedGenres = genres.map(genre => ({
        id: genre.id,
        name: genre.name,
        code: genre.id.toString()
    }));

    const formattedPlatforms = platforms.map(platform => ({
        id: platform.id,
        name: platform.name,
        code: platform.id.toString()
    }));

    const formattedDevelopers = developers.map(developer => ({
        id: developer.id,
        name: developer.name,
        code: developer.id.toString()
    }));

    return (
        <CreateArticleForm
            onClose={handleClose}
            onArticleCreated={handleArticleCreated}
            genres={formattedGenres}
            platforms={formattedPlatforms}
            developers={formattedDevelopers}
        />
    );
}
