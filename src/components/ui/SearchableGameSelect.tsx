import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGames } from '@/hooks/useGames';

interface Game {
    id: number;
    title: string;
}

interface SearchableGameSelectProps {
    onGameChange: (gameId: string) => void;
    selectedGameId: string;
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
    z-index: 1000;
`;

const GameItem = styled.div<{ isSelected: boolean }>`
    padding: 8px;
    cursor: pointer;
    background-color: ${props => props.isSelected ? 'var(--app-yellow)' : 'white'};
    color: ${props => props.isSelected ? 'var(--dark-grey)' : 'black'};

    &:hover {
        background-color: ${props => props.isSelected ? '#e6c200' : '#e9ecef'};
    }
`;

const SearchableGameSelect: React.FC<SearchableGameSelectProps> = ({
    onGameChange,
    selectedGameId
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState<Game[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState('');
    const { searchGames } = useGames();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadGames = async () => {
            if (searchTerm.length > 0) {
                const results = await searchGames(searchTerm);
                setGames(results);
            } else {
                setGames([]);
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

    const handleInputFocus = () => {
        setIsOpen(true);
        if (selectedTitle) {
            setSearchTerm(selectedTitle);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleGameSelect = (game: Game) => {
        onGameChange(game.id.toString());
        setSelectedTitle(game.title);
        setSearchTerm(game.title);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    return (
        <SelectContainer ref={containerRef}>
            <SearchInput
                type="text"
                placeholder="Buscar juego"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleInputKeyDown}
            />
            {isOpen && games.length > 0 && (
                <DropdownList onClick={(e) => e.preventDefault()}>
                    {games.map(game => (
                        <GameItem
                            key={game.id}
                            isSelected={selectedGameId === game.id.toString()}
                            onClick={(e) => {
                                e.preventDefault();
                                handleGameSelect(game);
                            }}
                        >
                            {game.title}
                        </GameItem>
                    ))}
                </DropdownList>
            )}
        </SelectContainer>
    );
};

export default SearchableGameSelect; 