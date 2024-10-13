import React from 'react';
import styled from 'styled-components';
import Button from '../ui/Button';

const CardContainer = styled.div`
  display: flex;
  padding: 1rem;
  margin: 0 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div<{ imageUrl: string }>`
  flex: 1;
  min-height: 300px;
  background-image: url('${props => props.imageUrl}');
  background-size: cover;
  background-position: center;
`;

const ContentSection = styled.div`
  flex: 1;
  padding: 20px;
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
                <Button type="button" $variant={'dark'} >Más información</Button>
            </ContentSection>
        </CardContainer>
    );
};

export default InfoCardComponent;
