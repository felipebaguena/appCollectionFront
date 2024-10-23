import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

interface FilterInputProps {
    label: string;
    value: any;
    onChange: (value: any) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ label, value, onChange }) => {
    return (
        <div>
            <label>{label}</label>
            <StyledInput
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default FilterInput;
