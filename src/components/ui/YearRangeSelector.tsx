import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const YearRangeContainer = styled.div`
  display: flex;
  width: 12rem;
  flex: 0 0 auto;
`;

const SelectContainer = styled.div`
  position: relative;
  width: 50%;
`;

const SelectButton = styled.button<{ $isFirst?: boolean; $disabled?: boolean }>`
  width: 100%;
  padding: 8px;
  color: var(--grey);
  border: 1px solid #ddd;
  background-color: ${props => props.$disabled ? '#f5f5f5' : 'white'};
  text-align: left;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.7 : 1};
  outline: none;
  
  ${props => props.$isFirst && `
    border-right: none;
  `}
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow-focus);
  }

  &::after {
    content: '';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #666;
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
`;

const OptionItem = styled.li<{ $isSelected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background-color: ${props => props.$isSelected ? 'var(--app-yellow)' : 'white'};
  color: ${props => props.$isSelected ? 'var(--dark-grey)' : 'black'};

  &:hover {
    background-color: ${props => props.$isSelected ? '#e6c200' : '#e9ecef'};
  }
`;

interface YearRange {
    start: number | null;
    end: number | null;
}

interface YearRangeSelectorProps {
    value: YearRange | null;
    onChange: (range: YearRange | null) => void;
    startYear?: number;
    endYear?: number;
}

const YearRangeSelector: React.FC<YearRangeSelectorProps> = ({
    value,
    onChange,
    startYear = 1970,
    endYear = new Date().getFullYear()
}) => {
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const startRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => endYear - i
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (startRef.current && !startRef.current.contains(event.target as Node)) {
                setIsStartOpen(false);
            }
            if (endRef.current && !endRef.current.contains(event.target as Node)) {
                setIsEndOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStartSelect = (year: number) => {
        const currentEnd = value?.end ?? null;
        onChange({
            start: year,
            end: currentEnd && currentEnd < year ? year : currentEnd
        });
        setIsStartOpen(false);
    };

    const handleEndSelect = (year: number) => {
        const currentStart = value?.start ?? null;
        onChange({
            start: currentStart,
            end: year
        });
        setIsEndOpen(false);
    };

    const availableEndYears = years.filter(year => !value?.start || year >= value.start);

    return (
        <YearRangeContainer>
            <SelectContainer ref={startRef}>
                <SelectButton
                    onClick={() => setIsStartOpen(!isStartOpen)}
                    $isFirst={true}
                >
                    {value?.start || 'Desde'}
                </SelectButton>
                {isStartOpen && (
                    <OptionsList>
                        {years.map(year => (
                            <OptionItem
                                key={year}
                                $isSelected={year === value?.start}
                                onClick={() => handleStartSelect(year)}
                            >
                                {year}
                            </OptionItem>
                        ))}
                    </OptionsList>
                )}
            </SelectContainer>
            <SelectContainer ref={endRef}>
                <SelectButton
                    onClick={() => setIsEndOpen(!isEndOpen)}
                    disabled={!value?.start}
                    $disabled={!value?.start}
                >
                    {value?.end || 'Hasta'}
                </SelectButton>
                {isEndOpen && value?.start && (
                    <OptionsList>
                        {availableEndYears.map(year => (
                            <OptionItem
                                key={year}
                                $isSelected={year === value?.end}
                                onClick={() => handleEndSelect(year)}
                            >
                                {year}
                            </OptionItem>
                        ))}
                    </OptionsList>
                )}
            </SelectContainer>
        </YearRangeContainer>
    );
};

export default YearRangeSelector;