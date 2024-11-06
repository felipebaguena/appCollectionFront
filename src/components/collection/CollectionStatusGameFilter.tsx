'use client';

import styled from 'styled-components';
import RangeSlider from '@/components/ui/RangeSlider';
import { FilterContainer, FilterCard, FilterTitle } from './CollectionFilterElements';

interface CollectionStatusGameFilterProps {
    value: { start: number; end: number };
    onChange: (range: { start: number; end: number }) => void;
}

const StatusContainer = styled.div`
  padding: 0 0.5rem 0.1rem;
`;

const CollectionStatusGameFilter: React.FC<CollectionStatusGameFilterProps> = ({ value, onChange }) => {
    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Rango de estado del juego</FilterTitle>
                <StatusContainer>
                    <RangeSlider
                        min={0}
                        max={10}
                        start={value.start}
                        end={value.end}
                        onChange={onChange}
                    />
                </StatusContainer>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionStatusGameFilter; 