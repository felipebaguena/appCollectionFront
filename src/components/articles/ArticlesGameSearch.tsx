'use client'

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGames } from '@/hooks/useGames';

interface Game {
    id: number;
    title: string;
}

interface ArticlesGameSearchProps {
    onGameChange: (gameId: string | null, gameTitle: string) => void;
    selectedGameId: string | null;
    selectedGameTitle: string;
}

const SelectContainer = styled.div`
    position: relative;
    width: 100%;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    outline: none;
    color: var(--grey);
    
    &:focus {
        border-color: var(--app-yellow);
    }
`;

const DropdownList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-top: none;
    background-color: white;
    color: var(--grey);
    z-index: 1000;
`;

const GameItem = styled.div`
    padding: 8px;
    cursor: pointer;
    background-color: white;
    
    &:hover {
        background-color: #e9ecef;
    }
`;

const ArticlesGameSearch: React.FC<ArticlesGameSearchProps> = ({
    onGameChange,
    selectedGameId,
    selectedGameTitle
}) => {
    const [searchTerm, setSearchTerm] = useState(selectedGameTitle);
    const [games, setGames] = useState<Game[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasSelectedGame, setHasSelectedGame] = useState(!!selectedGameId);
    const { searchGames } = useGames();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(selectedGameTitle);
    }, [selectedGameTitle]);

    useEffect(() => {
        const loadGames = async () => {
            if (searchTerm.length > 0) {
                const results = await searchGames(searchTerm);
                setGames(results);
            } else {
                setGames([]);
                if (hasSelectedGame) {
                    onGameChange(null, '');
                    setHasSelectedGame(false);
                }
            }
        };
        loadGames();
    }, [searchTerm, searchGames]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGameSelect = (game: Game) => {
        onGameChange(game.id.toString(), game.title);
        setSearchTerm(game.title);
        setHasSelectedGame(true);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);
    };

    return (
        <SelectContainer ref={containerRef}>
            <SearchInput
                type="text"
                placeholder="Busca un juego"
                value={searchTerm}
                onChange={handleInputChange}
            />
            {isOpen && games.length > 0 && (
                <DropdownList>
                    {games.map(game => (
                        <GameItem
                            key={game.id}
                            onClick={() => handleGameSelect(game)}
                        >
                            {game.title}
                        </GameItem>
                    ))}
                </DropdownList>
            )}
        </SelectContainer>
    );
};

export default ArticlesGameSearch; 