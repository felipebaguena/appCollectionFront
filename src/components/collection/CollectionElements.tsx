'use client';

import styled from 'styled-components';
import { NAVBAR_HEIGHT } from '@/components/layout/NavbarElements';
import { BsGrid, BsGrid3X3 } from 'react-icons/bs';

export const TitleBar = styled.div`
  background-color: var(--app-yellow);
  padding: 0.8rem;
  margin-bottom: 1rem;
`;

export const Title = styled.h1`
  color: var(--dark-grey);
  text-align: center;
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 20px 20px 5px 20px;

  @media (max-width: 568px) {
    gap: 0.8rem;
  }
`;

export const ControlsTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 568px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }
`;

export const FiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--dark-grey);
  font-weight: bold;
  font-size: 1rem;
  margin-right: auto;
`;

export const FiltersPanel = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? 'auto' : '0'};
  min-width: ${props => props.isOpen ? 'auto' : '0'};
  flex-shrink: 0;
  overflow: visible;
  transition: all 0.3s ease-in-out;
  padding: ${props => props.isOpen ? '1.5rem 0 1.5rem 1.5rem' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};

  @media (max-width: 568px) {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: ${NAVBAR_HEIGHT};
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - ${NAVBAR_HEIGHT});
    background: white;
    z-index: 1000;
    margin: 0;
    overflow-y: auto;
  }
`;

export const CollectionFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  overflow: visible;
`;

export const CloseFiltersButton = styled.button`
  display: none;

  @media (max-width: 568px) {
    display: block;
    position: sticky;
    top: 0;
    right: 0;
    padding: 8px 16px;
    background-color: var(--app-yellow);
    border: none;
    cursor: pointer;
    color: var(--dark-grey);
    font-weight: bold;
    margin-left: auto;
    z-index: 1001;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
`;

export const ControlsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 568px) {
    flex-direction: row;
    gap: 0.8rem;
    width: 100%;
    
    > * {
      flex: 1;
      min-width: 0;
    }
  }
`;

export const FiltersSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 568px) {
    justify-content: space-between;
    margin-bottom: 0.5rem;
    width: 100%;
  }
`;

export const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  min-height: 34px;

  @media (max-width: 768px) {
    gap: 4px;
    font-size: 0.875rem;
  }
`;

export const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--grey);
  font-size: 0.875rem;

  &:hover {
    color: var(--dark-grey);
  }

  @media (max-width: 568px) {
    font-size: 0.8rem;
    margin-left: 0;
  }
`;

export const CentralContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: var(--dark-grey);
`;

export const MyCollectionCentralContent = styled.div`
  flex: 1;
  display: flex;
  min-height: 100%;
  justify-content: center;
  color: var(--dark-grey);
`;

export const ViewToggle = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--mid-grey);
  background-color: transparent;
  transition: color 0.5s ease, background-color 0.5s ease;

  &:hover {
    color: var(--app-yellow);
    background-color: var(--dark-grey);
  }

  svg {
    font-size: 1.5rem;
  }

  @media (max-width: 568px) {
    flex: 0 0 auto;
  }
`;