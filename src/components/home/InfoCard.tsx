import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ImageSection = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('${props => props.imageUrl}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(0, 0, 0, 0.8) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

const ContentSection = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  padding: 2rem;
  color: white;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
`;

const InfoLabel = styled.div`
  background-color: var(--app-yellow);
  color: var(--dark-grey);
  padding: 1rem;
  text-align: center;
  width: 100%;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);

  &:hover {
    background-color: var(--app-yellow-focus);
    color: black;
    transform: scale(1.05);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

interface InfoCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const InfoCardComponent: React.FC<InfoCardProps> = ({ imageUrl, title, description }) => {
  return (
    <CardContainer>
      <ImageSection imageUrl={imageUrl} />
      <ContentSection>
        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>
        <StyledLink href="/collection">
          <InfoLabel>
            Más información
          </InfoLabel>
        </StyledLink>
      </ContentSection>
    </CardContainer>
  );
};

export default InfoCardComponent;
