import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash, FaImages, FaPlus, FaSync, FaSortUp, FaSortDown, FaSort, FaChevronDown } from 'react-icons/fa';
import Button from '../ui/Button';
import { keyframes } from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { MdSchedule, MdPublish, MdUnpublished } from 'react-icons/md';
import { FOOTER_HEIGHT } from '../layout/FooterElements';

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

export const StyledTd = styled(Td) <ResponsiveProps>`
  max-height: 4rem;
  vertical-align: top;
  padding: 8px;

  @media (max-width: ${props => props.$breakpoint || 768}px) {
    padding: 0.5rem;
    min-height: 3.5rem;
  }
`;

export const CellContent = styled.div<ResponsiveProps>`
  max-height: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-word;

  @media (max-width: ${props => props.$breakpoint || 768}px) {
    flex: 1;
    margin: 0;
    padding: 0;
    max-height: 3rem;
    -webkit-line-clamp: 2;
  }
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
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #333;
  padding-bottom: 1rem;
`;

export const ButtonDataTable = styled(Button)`
  margin: 0 1rem 0;
  padding: 10px 10px;
  background-color: var(--app-yellow);
  color: var(--dark-grey);
  font-weight: bold;

  &:hover {
    background-color: var(--dark-grey);
    color: var(--app-yellow);
  }

  &:disabled {
    background-color: #ccc;
    color: var(--grey);
    cursor: not-allowed;
  }
`;

export const TableContainer = styled.div`
  padding: 1rem;
  overflow: hidden;
`;

export const TableTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  color: var(--dark-grey);
`;

export const TitleContainer = styled.div`
  background-color: var(--app-yellow);
  text-align: center;
  padding: 0.8rem 1rem 0.8rem 1rem;
  width: 100%;
`;

export const FiltersContainer = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const FiltersSection = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: end;
  flex-wrap: wrap;
`;

export const ButtonsSection = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
export const ActionScheduleButton = styled(ActionButton).attrs({ $variant: 'cancel' })``;
export const ActionPublishButton = styled(ActionButton).attrs({ $variant: 'outline' })``;
export const ActionUnpublishButton = styled(ActionButton).attrs({ $variant: 'outline' })``;

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

export const ScheduleButtonDataTable = (props: React.ComponentProps<typeof ActionScheduleButton>) => (
  <ActionScheduleButton {...props}>
    <MdSchedule />
  </ActionScheduleButton>
);

export const PublishButtonDataTable = (props: React.ComponentProps<typeof ActionPublishButton>) => (
  <ActionPublishButton {...props}>
    <MdPublish />
  </ActionPublishButton>
);

export const UnpublishButtonDataTable = (props: React.ComponentProps<typeof ActionUnpublishButton>) => (
  <ActionUnpublishButton {...props}>
    <MdUnpublished />
  </ActionUnpublishButton>
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

interface ResponsiveProps {
  $breakpoint?: number;
}

export const ResponsiveTable = styled(Table) <ResponsiveProps>`
  @media (max-width: ${props => props.$breakpoint || 768}px) {
    display: block;
    border: none;
    
    thead {
      display: none;
    }
    
    tbody {
      display: block;
    }
    
    tr {
      display: block;
      margin-bottom: 1rem;
      background: #fff;
      border: 1px solid #ddd;
    }
    
    td {
      display: flex;
      align-items: flex-start;
      padding: 0.5rem 1rem 0.5rem 1rem;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      text-align: left;
      
      &:before {
        content: attr(data-label);
        font-weight: bold;
        width: 30%;
        min-width: 100px;
        padding-right: 1rem;
        color: #666;
        flex-shrink: 0;
      }

      &:last-child {
        border-bottom: none;
        border-right: none;
      }
    }
  }
`;

export const ResponsiveContainer = styled(TableContainer) <ResponsiveProps>`
  @media (max-width: ${props => props.$breakpoint || 768}px) {
    padding: 0.5rem;
    overflow-x: hidden;
  }
`;

export const ResponsivePaginationContainer = styled(PaginationContainer) <ResponsiveProps>`
  @media (max-width: ${props => props.$breakpoint || 768}px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    
    span {
      text-align: center;
    }
  }
`;

export const ResponsiveActionsContainer = styled(ActionsContainer) <ResponsiveProps>`
  @media (max-width: ${props => props.$breakpoint || 768}px) {
    justify-content: flex-start;
    gap: 0.5rem;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 12rem;
  flex: 0 0 auto;
`;

export const FilterLabel = styled.label`
  font-weight: bold;
  color: var(--dark-grey);
`;

export const FilterButton = styled(Button)`
  align-self: flex-end;
  padding: 0.55rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const CompactFilterGroup = styled(FilterGroup)`
    width: auto;
`;

export const CustomSelectContainer = styled.div`
  position: relative;
  display: inline-block;
  margin: 0 5px;
`;

export const CustomSelectButton = styled.button<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  border: 1px solid #ddd;
  padding: 4px 24px 4px 8px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  position: relative;
  min-width: 60px;
  text-align: left;
  color: ${props => props.disabled ? '#999' : '#333'};
  font-size: 14px;

  &:hover {
    border-color: ${props => props.disabled ? '#ddd' : '#999'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.disabled ? '#ddd' : 'var(--app-yellow)'};
  }
`;

export const ChevronIcon = styled(FaChevronDown) <{ disabled?: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: ${props => props.disabled ? '#999' : '#666'};
`;

export const CustomSelectList = styled.ul<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  ${props => props.$position === 'top' ? 'bottom: 100%;' : 'top: 100%;'}
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  margin: ${props => props.$position === 'top' ? '0 0 4px 0' : '4px 0 0 0'};
  padding: 4px 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  min-width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const CustomSelectItem = styled.li`
  padding: 4px 8px;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
`;

interface CustomSelectProps {
  value: number;
  onChange: (page: number) => void;
  totalPages: number;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, totalPages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropDirection, setDropDirection] = useState<'top' | 'bottom'>('bottom');
  const isDisabled = totalPages <= 1;

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const footerHeightInPx = parseFloat(FOOTER_HEIGHT) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const spaceBelow = window.innerHeight - rect.bottom - footerHeightInPx;
      const spaceAbove = rect.top;
      const listHeight = Math.min(200, totalPages * 28);

      setDropDirection(spaceBelow < listHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
  }, [isOpen, totalPages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <CustomSelectContainer ref={containerRef}>
      <CustomSelectButton
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
      >
        {value}
        <ChevronIcon disabled={isDisabled} />
      </CustomSelectButton>
      {!isDisabled && isOpen && (
        <CustomSelectList $position={dropDirection}>
          {Array.from({ length: totalPages }, (_, i) => (
            <CustomSelectItem
              key={i + 1}
              onClick={() => {
                onChange(i + 1);
                setIsOpen(false);
              }}
            >
              {i + 1}
            </CustomSelectItem>
          ))}
        </CustomSelectList>
      )}
    </CustomSelectContainer>
  );
};


