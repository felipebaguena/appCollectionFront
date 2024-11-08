'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from '@/components/ui/Calendar';
import { DateFormat } from '@/types/date';
import { formatDate } from '@/helpers/dateFormatter';

const DateRangeContainer = styled.div`
  display: flex;
  width: 100%;
`;

const SelectButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 0;
  background-color: ${props => props.$disabled ? '#f5f5f5' : 'white'};
  color: ${props => props.$disabled ? 'var(--grey)' : '#666'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.7 : 1};
  text-align: left;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow-focus);
    border-radius: 0;
  }
`;

const SelectContainer = styled.div`
  position: relative;
  flex: 1;

  &:first-child ${SelectButton} {
    border-right: none;
  }
`;

const CalendarWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 4px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

interface ArticleDateRangeFilterProps {
    value: {
        start: string | null;
        end: string | null;
    };
    onChange: (range: { start: string | null; end: string | null }) => void;
    dateFormat?: DateFormat;
}

const ArticleDateRangeFilter: React.FC<ArticleDateRangeFilterProps> = ({
    value,
    onChange,
    dateFormat = DateFormat.SHORT
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
        <DateRangeContainer>
            <SelectContainer ref={startRef}>
                <SelectButton onClick={() => setIsStartOpen(!isStartOpen)}>
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
        </DateRangeContainer>
    );
};

export default ArticleDateRangeFilter; 