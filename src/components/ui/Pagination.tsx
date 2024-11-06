import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.$active ? 'var(--app-yellow)' : 'var(--dark-grey)'};
  color: ${props => props.$active ? 'var(--dark-grey)' : 'var(--clear-grey)'};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: var(--app-yellow);
    color: var(--dark-grey);
  }
`;

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <PageButton
                    key={i}
                    $active={i === currentPage}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </PageButton>
            );
        }
        return pages;
    };

    return (
        <PaginationContainer>
            {renderPageNumbers()}
        </PaginationContainer>
    );
};

export default Pagination; 