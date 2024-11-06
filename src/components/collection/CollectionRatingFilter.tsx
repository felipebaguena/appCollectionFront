'use client';

import styled from 'styled-components';
import StarRating from '@/components/ui/StarRating';
import { FilterContainer, FilterCard, FilterTitle } from './CollectionFilterElements';

interface CollectionRatingFilterProps {
    value: { start: number; end: number };
    onChange: (range: { start: number; end: number }) => void;
}

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RangeLabel = styled.span`
  color: var(--dark-grey);
  font-size: 0.9rem;
`;

const CollectionRatingFilter: React.FC<CollectionRatingFilterProps> = ({ value, onChange }) => {
    const handleStartChange = (rating: number) => {
        onChange({ ...value, start: Math.min(rating, value.end) });
    };

    const handleEndChange = (rating: number) => {
        onChange({ ...value, end: Math.max(rating, value.start) });
    };

    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Rango de valoración</FilterTitle>
                <RatingContainer>
                    <RangeContainer>
                        <RangeLabel>Desde:</RangeLabel>
                        <StarRating value={value.start} onChange={handleStartChange} size={20} />
                    </RangeContainer>
                    <RangeContainer>
                        <RangeLabel>Hasta:</RangeLabel>
                        <StarRating value={value.end} onChange={handleEndChange} size={20} />
                    </RangeContainer>
                </RatingContainer>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionRatingFilter; 