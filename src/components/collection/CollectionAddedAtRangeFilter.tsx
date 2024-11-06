'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from '@/components/ui/Calendar';
import { FilterContainer, FilterCard, FilterTitle } from './CollectionFilterElements';
import { DateFormat } from '@/types/date';
import { formatDate } from '@/helpers/dateFormatter';

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

const FilterCardOverride = styled(FilterCard)`
  overflow: visible;
`;

const CalendarWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 4px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

interface CollectionAddedAtRangeFilterProps {
    value: {
        start: string | null;
        end: string | null;
    };
    onChange: (range: { start: string | null; end: string | null }) => void;
    dateFormat?: DateFormat;
}

const CollectionAddedAtRangeFilter: React.FC<CollectionAddedAtRangeFilterProps> = ({
    value,
    onChange,
    dateFormat = DateFormat.LONG
}) => {
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const startRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

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

    const handleDateSelect = (date: Date) => {
        if (isStartOpen) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            onChange({
                ...value,
                start: startDate.toISOString()
            });
            setIsStartOpen(false);
        } else if (isEndOpen) {
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            onChange({
                ...value,
                end: endDate.toISOString()
            });
            setIsEndOpen(false);
        }
    };

    return (
        <FilterContainer>
            <FilterCardOverride>
                <FilterTitle>Fecha en la que se añadió</FilterTitle>
                <YearRangeContainer>
                    <SelectContainer ref={startRef}>
                        <SelectButton
                            onClick={() => setIsStartOpen(!isStartOpen)}
                            $isFirst={true}
                        >
                            {formatDate(value.start, { format: dateFormat, defaultText: 'Desde' })}
                        </SelectButton>
                        {isStartOpen && (
                            <CalendarWrapper>
                                <Calendar
                                    selectedDate={value.start ? new Date(value.start) : null}
                                    onChange={handleDateSelect}
                                    onClose={() => setIsStartOpen(false)}
                                    dateFormat={dateFormat}
                                />
                            </CalendarWrapper>
                        )}
                    </SelectContainer>
                    <SelectContainer ref={endRef}>
                        <SelectButton
                            onClick={() => setIsEndOpen(!isEndOpen)}
                            disabled={!value.start}
                            $disabled={!value.start}
                        >
                            {value.end ? formatDate(value.end, { format: dateFormat }) : 'Hasta'}
                        </SelectButton>
                        {isEndOpen && value.start && (
                            <CalendarWrapper>
                                <Calendar
                                    selectedDate={value.end ? new Date(value.end) : null}
                                    onChange={handleDateSelect}
                                    onClose={() => setIsEndOpen(false)}
                                    dateFormat={DateFormat.SHORT}
                                />
                            </CalendarWrapper>
                        )}
                    </SelectContainer>
                </YearRangeContainer>
            </FilterCardOverride>
        </FilterContainer>
    );
};

export default CollectionAddedAtRangeFilter; 