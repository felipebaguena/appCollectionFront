'use client';

import React from 'react';
import Link from 'next/link';
import {
    Container,
    MainTitle,
    CardsContainer,
    Card,
    CardTitle
} from '@/components/management/ManagementElements';
import Button from '@/components/ui/Button';

export default function ManagementPage() {
    const sections = [
        { name: "Juegos", route: "manage-games" },
        { name: "Plataformas", route: "manage-platforms" },
        { name: "Géneros", route: "manage-genres" },
        { name: "Desarrolladores", route: "manage-developers" }
    ];

    return (
        <Container>
            <MainTitle>Gestión de contenido</MainTitle>
            <CardsContainer>
                {sections.map((section) => (
                    <Card key={section.name}>
                        <CardTitle>{section.name}</CardTitle>
                        <Link href={`/management/${section.route}`} passHref>
                            <Button $variant='dark'>Gestionar {section.name}</Button>
                        </Link>
                    </Card>
                ))}
            </CardsContainer>
        </Container>
    );
}
