import React from 'react';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarContainer = styled.div`
  position: relative;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1;
`;

const HalfStarArea = styled.div`
  width: 50%;
  height: 100%;
`;

const EmptyStar = styled(FaStar)`
  color: #ccc;
`;

const FilledStar = styled(FaStar)`
  color: var(--app-yellow);
`;

const HalfStar = styled(FaStarHalfAlt)`
  color: var(--app-yellow);
`;

interface StarRatingProps {
    value: number;
    onChange: (rating: number) => void;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 24 }) => {
    const handleStarClick = (starIndex: number, isHalf: boolean) => {
        const clickedValue = isHalf ? starIndex + 0.5 : starIndex + 1;

        // Si clickamos en un valor mayor al actual, establecemos ese valor
        if (clickedValue > value) {
            onChange(clickedValue);
        }
        // Si clickamos en el mismo valor o en uno menor, establecemos el valor clickado
        else {
            onChange(clickedValue);
        }
    };

    const renderStar = (index: number) => {
        const isHalf = value === index + 0.5;
        const isFilled = value >= index + 1;

        return (
            <StarContainer key={index}>
                <EmptyStar size={size} />
                <StarOverlay>
                    <HalfStarArea
                        onClick={() => handleStarClick(index, true)}
                    />
                    <HalfStarArea
                        onClick={() => handleStarClick(index, false)}
                    />
                </StarOverlay>
                {isHalf && (
                    <HalfStar
                        size={size}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                )}
                {isFilled && (
                    <FilledStar
                        size={size}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                )}
            </StarContainer>
        );
    };

    return (
        <RatingContainer>
            {[0, 1, 2, 3, 4].map(index => renderStar(index))}
        </RatingContainer>
    );
};

export default StarRating;