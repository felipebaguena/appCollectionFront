import styled from 'styled-components';

// Contenedores principales
export const PageWrapper = styled.div`
  width: 100%;
  background-color: var(--mid-grey);
  min-height: 100vh;
`;

export const ArticlesContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

// Elementos de artículos
export const CoverImage = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7) 60%, transparent);
  }
`;

export const ArticleContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: white;
  z-index: 2;
`;

// Elementos de lista de artículos
export const HomeArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const HomeArticleCard = styled.div`
  height: 200px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  background: var(--background);
  
  @media (max-width: 768px) {
    height: 160px;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
  
  &:hover {
    transform: scale(1.01);
    transition: transform 0.2s ease-in-out;
  }
`;

// Elementos de UI comunes
export const SectionDivider = styled.div`
  width: 100%;
  margin: 0 0 2rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--dark-grey);
    white-space: nowrap;
    line-height: 1;
    margin-bottom: -2px;
  }

  &::after {
    content: '';
    height: 1px;
    background-color: var(--grey);
    flex-grow: 1;
  }
`;

export const ArticleDivider = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    height: 1px;
    background-color: var(--grey);
    flex-grow: 1;
  }
`;

// Elementos de paginación
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
`;

export const PaginationButton = styled.button<{ $variant?: 'home' }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$variant === 'home' ? 'var(--dark-grey)' : 'var(--app-yellow)'};
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: ${props => props.$variant === 'home' ? 'white' : 'var(--dark-grey)'};
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Elementos específicos de Home
export const HomeSectionDivider = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--clear-grey);
    white-space: nowrap;
    line-height: 1;
    margin-bottom: -2px;
  }

  &::after {
    content: '';
    height: 1px;
    background-color: var(--clear-grey);
    flex-grow: 1;
  }

  @media (max-width: 1200px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const CoverArticleContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 35rem;
  position: relative;
  overflow: hidden;
  background-color: var(--grey);
  cursor: pointer;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    height: 30rem;
  }

  @media (max-width: 480px) {
    height: 20rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6) 60%, transparent);
    z-index: 1;
  }
  
  &:hover {
    transform: scale(1.01);
    transition: transform 0.2s ease-in-out;
  }
`;

export const HomeCoverArticleContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  color: white;
  z-index: 20;
`;

export const HomeCoverArticleTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

export const HomeCoverArticleSubtitle = styled.h3`
  font-size: 1.2rem;
  opacity: 0.9;
  color: var(--clear-grey);

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;