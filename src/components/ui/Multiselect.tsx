import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Option {
    id: number;
    name: string;
    code: string;
}

interface MultiSelectProps {
    options: Option[];
    selectedOptions: Option[];
    onChange: (selected: Option[]) => void;
    placeholder: string;
    dropUp?: boolean;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 8px;
  color: var(--grey);
  border: 1px solid #ddd;
  background-color: white;
  text-align: left;
  cursor: pointer;
  outline: none;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow-focus);
    border-radius: 0;
  }
`;

const OptionsList = styled.ul<{ dropUp: boolean }>`
  position: absolute;
  ${props => props.dropUp ? 'bottom: 100%' : 'top: 100%'};
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-${props => props.dropUp ? 'bottom' : 'top'}: none;
  background-color: white;
  z-index: 1;
  padding: 0;
  margin: 0;
  list-style: none;
  
  ${SelectButton}:focus + & {
    border-color: var(--app-yellow);
  }
`;

const OptionItem = styled.li<{ isSelected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'var(--app-yellow)' : 'white'};
  color: ${props => props.isSelected ? 'var(--dark-grey)' : 'black'};

  &:hover {
    background-color: ${props => props.isSelected ? '#e6c200' : '#e9ecef'};
  }
`;

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedOptions, onChange, placeholder, dropUp = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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

    const toggleOption = (option: Option, e: React.MouseEvent) => {
        e.stopPropagation();
        const isSelected = selectedOptions.some(selected => selected.id === option.id);
        if (isSelected) {
            onChange(selectedOptions.filter(selected => selected.id !== option.id));
        } else {
            onChange([...selectedOptions, option]);
        }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <SelectContainer ref={containerRef}>
            <SelectButton onClick={handleButtonClick}>
                {selectedOptions.length > 0 ? selectedOptions.map(o => o.name).join(', ') : placeholder}
            </SelectButton>
            {isOpen && (
                <OptionsList dropUp={dropUp}>
                    {options.map(option => (
                        <OptionItem
                            key={option.id}
                            isSelected={selectedOptions.some(selected => selected.id === option.id)}
                            onClick={(e) => toggleOption(option, e)}
                        >
                            {option.name}
                        </OptionItem>
                    ))}
                </OptionsList>
            )}
        </SelectContainer>
    );
};

export default MultiSelect;
