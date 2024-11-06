'use client';

import styled from 'styled-components';
import CustomCheckbox from '@/components/ui/CustomCheckbox';
import { FilterContainer, FilterCard, FilterTitle } from './CollectionFilterElements';

interface CollectionCompleteFilterProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding-top: 0.5rem;
  padding-bottom: 0.2rem;
`;

const Label = styled.label`
  color: var(--dark-grey);
  cursor: pointer;
`;

const CollectionCompleteFilter: React.FC<CollectionCompleteFilterProps> = ({ value, onChange }) => {
    return (
        <FilterContainer>
            <FilterCard>
                <FilterTitle>Elementos del juego</FilterTitle>
                <CheckboxContainer>
                    <CustomCheckbox
                        checked={value}
                        onChange={onChange}
                        id="complete-filter"
                    />
                    <Label htmlFor="complete-filter">Juegos completos</Label>
                </CheckboxContainer>
            </FilterCard>
        </FilterContainer>
    );
};

export default CollectionCompleteFilter; 