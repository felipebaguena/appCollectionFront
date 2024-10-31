import styled from 'styled-components';

export const FilterContainer = styled.div`
  width: 15rem;

  @media (max-width: 568px) {
    margin-top: 0.8rem;
  }
`;

export const FilterCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  padding: 1rem;
`;

export const FilterTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--dark-grey);
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--app-yellow);
    box-shadow: 0 0 0 2px var(--app-yellow-focus);
  }
`;

export const ScrollableList = styled.div`
  max-height: 14rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;

    &:hover {
      background: #ccc;
    }
  }
`;

export const FilterItem = styled.div<{ isSelected: boolean }>`
  padding: 3px 8px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'var(--app-yellow)' : 'white'};
  color: var(--dark-grey);
  font-size: 0.875rem;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#e6c200' : '#f5f5f5'};
  }
`;