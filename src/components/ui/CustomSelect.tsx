import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 12rem;
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
  position: relative;
  padding-right: 30px;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow-focus);
    border-radius: 0;
  }

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--grey);
  }
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
  background-color: white;
  z-index: 1000;
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

const CustomSelect: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Seleccionar...' }) => {
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

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? selectedOption.label : placeholder}
      </SelectButton>
      {isOpen && (
        <OptionsList>
          {options.map(option => (
            <OptionItem
              key={option.value}
              isSelected={option.value === value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectContainer>
  );
};

export default CustomSelect; 