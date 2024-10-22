'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirectHandler() {
    const router = useRouter();

    useEffect(() => {
        const handleUnauthorized = () => {
            router.push('/');
        };

        window.addEventListener('unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, [router]);

    return null;
}