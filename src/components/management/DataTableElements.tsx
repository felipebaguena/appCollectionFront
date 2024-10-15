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
