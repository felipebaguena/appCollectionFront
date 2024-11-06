'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Calendar from '@/components/ui/Calendar';
import { FilterContainer, FilterCard, FilterTitle } from './CollectionFilterElements';

interface CollectionAddedAtRangeFilterProps {
    value: {
        start: string | null;
        end: string | null;
    };
    onChange: (range: { start: string | null; end: string | null }) => void;
}

const FilterContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateButton = styled.button<{ $isActive: boolean }>`
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: ${props => props.$isActive ? 'var(--light-grey)' : 'white'};
  cursor: pointer;
  text-align: left;
  
  &:hover {
    background: var(--light-grey);
  }
`;

const CalendarWrapper = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 4px;
`;

const CollectionAddedAtRangeFilter: React.FC<CollectionAddedAtRangeFilterProps> = ({
    value,
    onChange
}) => {
    const [activeCalendar, setActiveCalendar] = useState<'start' | 'end' | null>(null);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Seleccionar fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDateSelect = (date: Date) => {
        if (activeCalendar === 'start') {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            onChange({
                ...value,
                start: startDate.toISOString()
            });
        } else if (activeCalendar === 'end') {
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            onChange({
                ...value,
                end: endDate.toISOString()
            });
        }
        setActiveCalendar(null);
    };

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Fecha en la que se añadió</FilterTitle>
                <FilterContent>
                    <DateButton
                        $isActive={activeCalendar === 'start'}
                        onClick={() => setActiveCalendar(activeCalendar === 'start' ? null : 'start')}
                    >
                        Desde: {formatDate(value.start)}
                    </DateButton>
                    {activeCalendar === 'start' && (
                        <CalendarWrapper>
                            <Calendar
                                selectedDate={value.start ? new Date(value.start) : null}
                                onChange={handleDateSelect}
                                onClose={() => setActiveCalendar(null)}
                            />
                        </CalendarWrapper>
                    )}
                    <DateButton
                        $isActive={activeCalendar === 'end'}
                        onClick={() => setActiveCalendar(activeCalendar === 'end' ? null : 'end')}
                    >
                        Hasta: {formatDate(value.end)}
                    </DateButton>
                    {activeCalendar === 'end' && (
                        <CalendarWrapper>
                            <Calendar
                                selectedDate={value.end ? new Date(value.end) : null}
                                onChange={handleDateSelect}
                                onClose={() => setActiveCalendar(null)}
                            />
                        </CalendarWrapper>
                    )}
                </FilterContent>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionAddedAtRangeFilter; 