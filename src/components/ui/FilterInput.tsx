import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledInput = styled.input`
  padding: 8px;
  padding-right: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &::placeholder {
    color: #999;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

interface FilterInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ label, value, onChange }) => {
  return (
    <InputWrapper>
      <StyledInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
      />
      <IconWrapper>
        <FaSearch />
      </IconWrapper>
    </InputWrapper>
  );
};

export default FilterInput;
