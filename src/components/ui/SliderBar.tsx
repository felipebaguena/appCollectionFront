import React from 'react';
import styled from 'styled-components';
import { FaCircle } from 'react-icons/fa';

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const RangeInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, 
    #ff4d4d 0%, 
    #ffff4d 50%, 
    #4dff4d 100%
  );
  border-radius: 4px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:active {
      cursor: grabbing;
      transform: scale(1.1);
    }
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: grab;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:active {
      cursor: grabbing;
      transform: scale(1.1);
    }
  }

  &::-ms-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: grab;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:active {
      cursor: grabbing;
      transform: scale(1.1);
    }
  }
`;

const ValueDisplay = styled.div<{ $value: number }>`
  position: absolute;
  top: -25px;
  left: ${props => props.$value * 10}%;
  transform: translateX(-50%);
  background-color: var(--dark-grey);
  color: white;
  padding: 2px 6px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;

  ${RangeInput}:active ~ & {
    opacity: 1;
  }
  
  ${RangeInput}:hover ~ & {
    opacity: 1;
  }
`;

interface SliderBarProps {
    value: number;
    onChange: (value: number) => void;
}

const SliderBar: React.FC<SliderBarProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onChange(newValue);
    };

    return (
        <SliderContainer>
            <RangeInput
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={value}
                onChange={handleChange}
            />
            <ValueDisplay $value={value}>
                {value.toFixed(1)}
            </ValueDisplay>
        </SliderContainer>
    );
};

export default SliderBar;
