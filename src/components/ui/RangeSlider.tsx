'use client';

import styled from 'styled-components';
import { useRef, useState, useEffect } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    start: number;
    end: number;
    onChange: (range: { start: number; end: number }) => void;
}

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const Track = styled.div`
  position: absolute;
  width: calc(100% - 20px);
  height: 8px;
  background: linear-gradient(to right, 
    #ff4d4d 0%, 
    #ffff4d 50%, 
    #4dff4d 100%
  );
  opacity: 0.5;
  border-radius: 4px;
`;

const Range = styled.div`
  position: absolute;
  height: 8px;
  background: linear-gradient(to right, 
    #ff4d4d 0%, 
    #ffff4d 50%, 
    #4dff4d 100%
  );
  border-radius: 4px;
`;

const Thumb = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translateX(-50%);
  z-index: 2;

  &:active {
    cursor: grabbing;
    transform: translateX(-50%) scale(1.1);
  }
`;

const Value = styled.div<{ $left: number; $visible: boolean }>`
  position: absolute;
  top: -20px;
  left: ${props => props.$left}%;
  transform: translateX(-50%);
  background: var(--dark-grey);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s;
  pointer-events: none;
`;

const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    start,
    end,
    onChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const startThumbRef = useRef<HTMLDivElement>(null);
    const endThumbRef = useRef<HTMLDivElement>(null);
    const [showStartValue, setShowStartValue] = useState(false);
    const [showEndValue, setShowEndValue] = useState(false);
    const [currentValues, setCurrentValues] = useState({ start, end });
    const latestValues = useRef({ start, end });

    useEffect(() => {
        setCurrentValues({ start, end });
        latestValues.current = { start, end };
    }, [start, end]);

    const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;
    const getValueFromPosition = (position: number) => {
        const percentage = position / (containerRef.current?.clientWidth ?? 1);
        return Math.round((percentage * (max - min) + min) * 10) / 10;
    };

    const handleMouseMove = (e: MouseEvent, isStart: boolean) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const position = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const newValue = getValueFromPosition(position);

        const newValues = isStart
            ? { ...latestValues.current, start: Math.min(newValue, latestValues.current.end) }
            : { ...latestValues.current, end: Math.max(newValue, latestValues.current.start) };

        latestValues.current = newValues;
        setCurrentValues(newValues);
    };

    const handleMouseDown = (isStart: boolean) => {
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleMouseUp);
            onChange(latestValues.current);
        };

        const handleMove = (e: MouseEvent) => handleMouseMove(e, isStart);

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <SliderContainer ref={containerRef}>
            <Track />
            <Range
                style={{
                    left: `${getPercentage(currentValues.start)}%`,
                    width: `${getPercentage(currentValues.end) - getPercentage(currentValues.start)}%`
                }}
            />
            <Thumb
                ref={startThumbRef}
                style={{ left: `${getPercentage(currentValues.start)}%` }}
                onMouseDown={() => handleMouseDown(true)}
                onMouseEnter={() => setShowStartValue(true)}
                onMouseLeave={() => setShowStartValue(false)}
            />
            <Value
                $left={getPercentage(currentValues.start)}
                $visible={showStartValue}
            >
                {currentValues.start.toFixed(1)}
            </Value>
            <Thumb
                ref={endThumbRef}
                style={{ left: `${getPercentage(currentValues.end)}%` }}
                onMouseDown={() => handleMouseDown(false)}
                onMouseEnter={() => setShowEndValue(true)}
                onMouseLeave={() => setShowEndValue(false)}
            />
            <Value
                $left={getPercentage(currentValues.end)}
                $visible={showEndValue}
            >
                {currentValues.end.toFixed(1)}
            </Value>
        </SliderContainer>
    );
};

export default RangeSlider; 