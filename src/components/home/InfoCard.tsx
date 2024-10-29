import React from 'react';
import styled from 'styled-components';
import Button from '../ui/Button';
import Link from 'next/link';

const CardContainer = styled.div`
  display: flex;
  margin: 1rem 1rem;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div<{ imageUrl: string }>`
  flex: 1.2;
  min-height: 300px;
  background-image: url('${props => props.imageUrl}');
  background-size: cover;
  background-position: center;
`;

const ContentSection = styled.div`
  flex: 0.8;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
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
        <Link href="/collection" passHref>
          <Button
            type="button"
            $variant={'dark'}
          >
            Más información
          </Button>
        </Link>
      </ContentSection>
    </CardContainer>
  );
};

export default InfoCardComponent;
