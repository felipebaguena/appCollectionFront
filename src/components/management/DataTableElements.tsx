import styled from 'styled-components';

export const DataTableContainer = styled.div`
  margin: 2rem;
  padding: 1rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  max-height: 75px;
  vertical-align: top;
  padding: 8px;
`;

export const CellContent = styled.div`
  max-height: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const CoverThumbnail = styled.div`
  width: 75px;
  height: 75px;
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

export const Button = styled.button`
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

export const RefreshButton = styled(Button)`
  padding: 6px 10px;
  font-size: 14px;
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

export const ModalCloseButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #e9ecef;
    color: #000;
  }
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

export const SubmitButton = styled(ModalCloseButton)`
  background-color: #007bff;
  color: white;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ConfirmationText = styled(ModalField)`
    margin-bottom: 1.5rem;
`;

export const ButtonContainer = styled.div`
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

export const ActionButton = styled.button`
  flex: 0 0 auto;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s;
  font-size: 12px;
  font-weight: bold;
  width: 100%;
  padding: 4px 0;

  &:hover {
    opacity: 0.8;
  }
`;

export const ActionViewButton = styled(ActionButton)`
  background-color: #4caf50;
  color: white;
`;

export const ActionEditButton = styled(ActionButton)`
  background-color: #ffc107;
  color: #333; // Texto oscuro para mejor contraste
`;

export const ActionDeleteButton = styled(ActionButton)`
  background-color: #8b0000;
  color: white;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 4px;
`;

export const ActionsTd = styled(StyledTd)`
  width: 110px;
  padding: 4px;
  height: 100%;
  vertical-align: middle;
`;
