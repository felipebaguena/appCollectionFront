import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';

const ChipContainer = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: var(--app-yellow);
  padding: 4px 8px;
  margin: 0 4px;
  font-size: 0.875rem;
  color: var(--dark-grey);
`;

const ChipText = styled.span`
  margin-right: 4px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--dark-grey);
  
  &:hover {
    opacity: 0.7;
  }
`;

interface FilterChipProps {
    label: string;
    onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => (
    <ChipContainer>
        <ChipText>{label}</ChipText>
        <CloseButton onClick={onRemove}>
            <IoClose size={14} />
        </CloseButton>
    </ChipContainer>
);

export default FilterChip;