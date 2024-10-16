import React, { useState } from 'react';
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
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  text-align: left;
  cursor: pointer;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: white;
  z-index: 1;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const OptionItem = styled.li<{ isSelected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#007bff' : 'white'};
  color: ${props => props.isSelected ? 'white' : 'black'};

  &:hover {
    background-color: ${props => props.isSelected ? '#0056b3' : '#e9ecef'};
  }
`;

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedOptions, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

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
        <SelectContainer>
            <SelectButton onClick={handleButtonClick}>
                {selectedOptions.length > 0 ? selectedOptions.map(o => o.name).join(', ') : placeholder}
            </SelectButton>
            {isOpen && (
                <OptionsList>
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
