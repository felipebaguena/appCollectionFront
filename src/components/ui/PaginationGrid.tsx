import React from 'react';
import { PageButton, Pagination } from '../collection/CollectionGridElements';
import { PaginationContainer } from '../management/DataTableElements';
import styled from 'styled-components';

const CustomPaginationContainer = styled(PaginationContainer) <{ $noPadding?: boolean }>`
  padding-bottom: ${props => props.$noPadding ? '0' : '1rem'};
`;

interface PaginationGridProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    noPadding?: boolean;
}

const PaginationGrid: React.FC<PaginationGridProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    noPadding
}) => {
    return (
        <CustomPaginationContainer $noPadding={noPadding}>
            <Pagination>
                <PageButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </PageButton>

                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
                    <PageButton
                        key={page}
                        active={page === currentPage}
                        onClick={() => onPageChange(page)}
                        disabled={totalPages <= 1}
                    >
                        {page}
                    </PageButton>
                ))}

                <PageButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages <= 1}
                >
                    Siguiente
                </PageButton>
            </Pagination>
        </CustomPaginationContainer>
    );
};

export default PaginationGrid;