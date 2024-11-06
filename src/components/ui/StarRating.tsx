import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarsContainer = styled.div<{ $isInteractive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  padding-left: ${props => props.$isInteractive ? '16px' : '0'};
`;

const ZeroRating = styled.div<{ $active: boolean; $readOnly: boolean }>`
  width: 16px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  cursor: ${props => props.$readOnly ? 'default' : 'pointer'};
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &:hover {
    &::after {
    }
  }
`;

const StarWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const HalfStarContainer = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
`;

const Star = styled.div<{ $filled: boolean; $readOnly: boolean }>`
  color: ${({ $filled }) => ($filled ? 'var(--app-yellow)' : '#ccc')};
  transition: color 0.3s ease;

  &:hover {
    opacity: ${({ $readOnly }) => ($readOnly ? 1 : 0.8)};
  }
`;

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    readOnly = false,
    size = 24
}) => {
    const [hover, setHover] = useState<number | null>(null);
    const isInteractive = !readOnly && !!onChange;

    const handleStarClick = (event: React.MouseEvent, rating: number) => {
        if (readOnly || !onChange) return;

        const star = event.currentTarget as HTMLDivElement;
        const rect = star.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const halfWidth = rect.width / 2;

        // Si el click está en la mitad izquierda, asignar .5 menos
        const finalRating = x < halfWidth ? rating - 0.5 : rating;
        onChange(finalRating);
    };

    const handleZeroClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!readOnly && onChange) {
            onChange(0);
        }
    };

    const handleZeroHover = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!readOnly) {
            setHover(0);
        }
    };

    const handleMouseMove = (event: React.MouseEvent, rating: number) => {
        if (readOnly) return;

        const star = event.currentTarget as HTMLDivElement;
        const rect = star.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const halfWidth = rect.width / 2;

        setHover(x < halfWidth ? rating - 0.5 : rating);
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHover(null);
        }
    };

    const renderStar = (rating: number) => {
        const filled = (hover ?? value) >= rating;
        const halfFilled = (hover ?? value) === rating - 0.5;

        return (
            <StarWrapper
                key={rating}
                onClick={(e) => handleStarClick(e, rating)}
                onMouseMove={(e) => handleMouseMove(e, rating)}
                onMouseLeave={handleMouseLeave}
            >
                <Star $filled={filled} $readOnly={readOnly}>
                    <FaStar size={size} />
                </Star>
                {halfFilled && (
                    <HalfStarContainer>
                        <Star $filled={true} $readOnly={readOnly}>
                            <FaStarHalfAlt size={size} />
                        </Star>
                    </HalfStarContainer>
                )}
            </StarWrapper>
        );
    };

    return (
        <StarsContainer
            onMouseLeave={handleMouseLeave}
            $isInteractive={isInteractive}
        >
            {isInteractive && (
                <ZeroRating
                    onClick={handleZeroClick}
                    onMouseEnter={handleZeroHover}
                    $active={hover === 0 || (!hover && value === 0)}
                    $readOnly={readOnly}
                />
            )}
            {[1, 2, 3, 4, 5].map(rating => renderStar(rating))}
        </StarsContainer>
    );
};

export default StarRating;