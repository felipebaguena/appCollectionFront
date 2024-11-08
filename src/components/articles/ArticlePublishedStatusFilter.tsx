'use client';

import styled from 'styled-components';
import { PublishedStatus } from '@/types/article';
import CustomSelect from '@/components/ui/CustomSelect';

interface ArticlePublishedStatusFilterProps {
    value: PublishedStatus;
    onChange: (value: PublishedStatus) => void;
}

const SelectContainer = styled.div`
  width: 100%;
`;

// Actualizar los estilos del CustomSelect si es necesario
const StyledCustomSelect = styled(CustomSelect)`
  .select__control {
    border: 1px solid #ccc;
    border-radius: 0;
    padding: 4px;
    min-height: 36px;

    &:hover {
      border-color: #ccc;
    }

    &--is-focused {
      border-color: var(--app-yellow) !important;
      box-shadow: 0 0 0 2px var(--app-yellow-focus) !important;
      border-radius: 0;
    }
  }

  .select__placeholder {
    color: var(--grey);
  }

  .select__single-value {
    color: #666;
  }
`;

const options = [
    { value: PublishedStatus.ALL, label: 'Todos los artículos' },
    { value: PublishedStatus.PUBLISHED, label: 'Artículos publicados' },
    { value: PublishedStatus.UNPUBLISHED, label: 'Artículos sin publicar' }
];

const ArticlePublishedStatusFilter: React.FC<ArticlePublishedStatusFilterProps> = ({
    value,
    onChange
}) => {
    const handleChange = (newValue: string) => {
        onChange(newValue as PublishedStatus);
    };

    return (
        <SelectContainer>
            <StyledCustomSelect
                options={options}
                value={value}
                onChange={handleChange}
                placeholder="Seleccionar estado..."
            />
        </SelectContainer>
    );
};

export default ArticlePublishedStatusFilter; 