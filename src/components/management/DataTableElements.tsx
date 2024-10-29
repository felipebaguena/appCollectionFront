import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaImages, FaPlus, FaSync, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import Button from '../ui/Button';
import { keyframes } from 'styled-components';
import { useState } from 'react';

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-20px);
  }
  80% {
    opacity: 1;
    transform: translateY(-20px);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
`;

const RefreshMessage = styled.span<{ $isVisible: boolean }>`
  position: absolute;
  top: -1rem;
  left: -3rem;
  transform: translateY(-100%);
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--dark-grey);
  pointer-events: none;
  animation: ${fadeInOut} 1.5s ease-in-out;
  opacity: 0;
  white-space: nowrap;
`;

const RefreshButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DataTableContainer = styled.div`
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #ddd;
`;

export const Th = styled.th<{ sortable?: boolean }>`
  padding: 12px;
  background-color: ${props => props.sortable ? '#e8e8e8' : '#f8f9fa'};
  text-align: left;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  font-weight: bold;
  color: #333;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  position: relative;

  &:last-child {
    border-right: none;
  }

  ${props => props.sortable && `
    &:hover {
      background-color: #d0d0d0;
    }
  `}
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  color: #333;

  &:last-child {
    border-right: none;
  }
`;

export const StyledTd = styled(Td)`
  max-height: 4rem;
  vertical-align: top;
  padding: 8px;
`;

export const CellContent = styled.div`
  max-height: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const CoverThumbnail = styled.div`
  width: 4rem;
  height: 4rem;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 1px solid #ddd;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #333;
`;

export const ButtonDataTable = styled(Button)`
  margin: 0 1rem 1rem;
  padding: 10px 10px;
  background-color: var(--app-yellow);
  color: var(--dark-grey);
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const TableContainer = styled.div`
  padding: 1rem;
  overflow: hidden;
`;

export const TableTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: var(--dark-grey);
`;

export const TitleContainer = styled.div`
  background-color: var(--app-yellow);
  padding: 0.3rem 1rem 0.3rem 1rem;
  width: 100%;
`;

export const FiltersContainer = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

export const DataTableButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

export const ActionsTd = styled(StyledTd)`
  vertical-align: middle;
`;

export const ActionButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  width: 1.8rem;
  height: 1.8rem;
  margin: 2px;
  padding: 0;
`;

export const ActionViewButton = styled(ActionButton).attrs({ $variant: 'dark' })``;
export const ActionEditButton = styled(ActionButton).attrs({ $variant: 'primary' })``;
export const ActionDeleteButton = styled(ActionButton).attrs({ $variant: 'danger' })``;
export const ActionGalleryButton = styled(ActionButton).attrs({ $variant: 'dark' })``;

export const ViewButtonDataTable = (props: React.ComponentProps<typeof ActionViewButton>) => (
  <ActionViewButton {...props}>
    <FaEye />
  </ActionViewButton>
);

export const EditButtonDataTable = (props: React.ComponentProps<typeof ActionEditButton>) => (
  <ActionEditButton {...props}>
    <FaEdit />
  </ActionEditButton>
);

export const DeleteButtonDataTable = (props: React.ComponentProps<typeof ActionDeleteButton>) => (
  <ActionDeleteButton {...props}>
    <FaTrash />
  </ActionDeleteButton>
);

export const GalleryButtonDataTable = (props: React.ComponentProps<typeof ActionGalleryButton>) => (
  <ActionGalleryButton {...props}>
    <FaImages />
  </ActionGalleryButton>
);

export const CreateButtonDataTable = (props: React.ComponentProps<typeof Button>) => (
  <Button
    {...props}
    $variant="primary"
  >
    <FaPlus />
  </Button>
);

export const RefreshButton = (props: React.ComponentProps<typeof Button>) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  return (
    <RefreshButtonContainer>
      {showMessage && <RefreshMessage $isVisible={showMessage}>¡Refrescando!</RefreshMessage>}
      <Button
        {...props}
        $variant="dark"
        onClick={handleClick}
      >
        <FaSync />
      </Button>
    </RefreshButtonContainer>
  );
};

export const SortIcon = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

export const ActiveSortIcon = styled(SortIcon) <{ isAsc: boolean }>`
  color: #444;
`;

export const InactiveSortIcon = styled(SortIcon)`
  color: #777;
  opacity: 0.7;
`;

export const SortIconComponent: React.FC<{
  active: boolean;
  direction: 'asc' | 'desc' | null;
}> = ({ active, direction }) => {
  if (!active) {
    return <InactiveSortIcon as={FaSort} />;
  }
  return direction === 'asc' ?
    <ActiveSortIcon as={FaSortUp} isAsc={true} /> :
    <ActiveSortIcon as={FaSortDown} isAsc={false} />;
};

export const ThContent = styled.div`
  padding-right: 20px;
`;