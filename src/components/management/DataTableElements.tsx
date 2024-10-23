import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaImages, FaPlus, FaSync, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import Button from '../ui/Button';

export const DataTableContainer = styled.div`
  margin: 2rem;
  padding: 1rem;
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
  background-color: ${props => props.sortable ? '#e6f2ff' : '#f8f9fa'};
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
      background-color: #d4e9ff;
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
  margin-top: 20px;
  font-size: 14px;
  color: #333;
`;

export const ButtonDataTable = styled(Button)`
  padding: 10px 10px;
  background-color: #007bff;
  color: white;
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
  margin-bottom: 20px;
  overflow: hidden;
`;

export const TableTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

export const ModalField = styled.p`
  margin-bottom: 0.5rem;
  color: #333;
`;

export const ModalLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
`;

export const FormField = styled.div`
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

export const SubmitButton = styled(Button).attrs({ $variant: 'primary' })`
  margin-right: 10px;
`;

export const ConfirmationText = styled(ModalField)`
    margin-bottom: 1.5rem;
`;

export const ButtonContainer = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

export const DeleteButton = styled(SubmitButton)`
    background-color: #dc3545;

    &:hover {
        background-color: #c82333;
    }
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

export const DataTableButtonsContainer = styled.div`
  display: flex;
  gap: 0.2rem;
  align-items: center;
`;

export const CreateButton = styled(ButtonDataTable).attrs({ $variant: 'primary' })``;

export const CreateButtonDataTable = (props: React.ComponentProps<typeof CreateButton>) => (
  <CreateButton {...props}>
    <FaPlus />
  </CreateButton>
);

export const RefreshButtonDataTable = styled(ButtonDataTable).attrs({ $variant: 'refresh' })``;

export const RefreshButton = (props: React.ComponentProps<typeof RefreshButtonDataTable>) => (
  <RefreshButtonDataTable {...props}>
    <FaSync />
  </RefreshButtonDataTable>
);

export const SortIcon = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

export const ActiveSortIcon = styled(SortIcon) <{ isAsc: boolean }>`
  color: #007bff;
`;

export const InactiveSortIcon = styled(SortIcon)`
  opacity: 0.5;
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

