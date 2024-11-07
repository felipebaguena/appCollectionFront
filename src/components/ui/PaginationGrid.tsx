import React from 'react';
import { PageButton, Pagination } from '../collection/CollectionGridElements';
import { PaginationContainer } from '../management/DataTableElements';


interface PaginationGridProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationGrid: React.FC<PaginationGridProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <PaginationContainer>
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
        </PaginationContainer>
    );
};

export default PaginationGrid;