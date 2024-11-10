import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

interface Option {
    id: number;
    name: string;
    code: string;
}

interface SearchableSelectProps {
    onOptionsChange: (options: Option[]) => void;
    selectedOptions: Option[];
    searchFunction: (search: string) => Promise<Option[]>;
    placeholder: string;
}

const SelectContainer = styled.div`
    position: relative;
    width: 100%;
`;

const InputContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 4px;
    border: 1px solid #ddd;
    min-height: 42px;
    align-items: center;
    
    &:focus-within {
        border-color: var(--app-yellow);
    }
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
    min-width: 120px;
    color: var(--grey);
    padding: 4px;
`;

const Chip = styled.div`
    display: flex;
    align-items: center;
    background-color: var(--app-yellow);
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 0.9em;
    gap: 6px;
`;

const ChipText = styled.span`
    color: var(--dark-grey);
`;

const ChipDelete = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--dark-grey);
    cursor: pointer;
    padding: 0;
    font-size: 0.9em;
    
    &:hover {
        opacity: 0.7;
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

const OptionItem = styled.div<{ isSelected: boolean }>`
    padding: 8px;
    cursor: pointer;
    background-color: ${props => props.isSelected ? 'var(--app-yellow)' : 'white'};
    color: ${props => props.isSelected ? 'var(--dark-grey)' : 'black'};

    &:hover {
        background-color: ${props => props.isSelected ? '#e6c200' : '#e9ecef'};
    }
`;

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    onOptionsChange,
    selectedOptions,
    searchFunction,
    placeholder
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadOptions = async () => {
            if (searchTerm.length > 0) {
                const results = await searchFunction(searchTerm);
                // Filtrar opciones ya seleccionadas
                const filteredResults = results.filter(
                    result => !selectedOptions.some(selected => selected.id === result.id)
                );
                setOptions(filteredResults);
            } else {
                setOptions([]);
            }
        };
        loadOptions();
    }, [searchTerm, searchFunction, selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        } else if (e.key === 'Backspace' && searchTerm === '' && selectedOptions.length > 0) {
            // Eliminar el último chip si el input está vacío y se presiona backspace
            const newSelectedOptions = [...selectedOptions];
            newSelectedOptions.pop();
            onOptionsChange(newSelectedOptions);
        }
    };

    const handleOptionSelect = (option: Option) => {
        const newSelectedOptions = [...selectedOptions, option];
        onOptionsChange(newSelectedOptions);
        setSearchTerm('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleRemoveOption = (optionToRemove: Option) => {
        const newSelectedOptions = selectedOptions.filter(
            option => option.id !== optionToRemove.id
        );
        onOptionsChange(newSelectedOptions);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    return (
        <SelectContainer ref={containerRef}>
            <InputContainer>
                {selectedOptions.map(option => (
                    <Chip key={option.id}>
                        <ChipText>{option.name}</ChipText>
                        <ChipDelete onClick={() => handleRemoveOption(option)}>
                            <FaTimes />
                        </ChipDelete>
                    </Chip>
                ))}
                <SearchInput
                    ref={inputRef}
                    type="text"
                    placeholder={selectedOptions.length === 0 ? placeholder : ''}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleInputKeyDown}
                />
            </InputContainer>
            {isOpen && options.length > 0 && (
                <DropdownList>
                    {options.map(option => (
                        <OptionItem
                            key={option.id}
                            isSelected={selectedOptions.some(selected => selected.id === option.id)}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option.name}
                        </OptionItem>
                    ))}
                </DropdownList>
            )}
        </SelectContainer>
    );
};

export default SearchableSelect; 