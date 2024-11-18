'use client'

import styled from 'styled-components';
import Link from 'next/link';

const BannerContainer = styled.div`
  width: 100%;
  background-color: var(--app-yellow);
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ContentWrapper = styled.div<{ contentLeft?: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-direction: ${props => props.contentLeft ? 'row-reverse' : 'row'};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TextContent = styled.div`
  flex: 1;
  text-align: left;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BannerText = styled.h2`
  font-size: 1.5rem;
  color: var(--dark-grey);

  @media (max-width: 900px) {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ButtonContent = styled.div`
  padding: 0 2rem 0 2rem;
  width: 50%;

  @media (max-width: 1200px) {
      padding: 0.8rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

const BannerButton = styled.div`
  background-color: var(--dark-grey);
  color: white;
  padding: 1.2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    transform: none;
    
    &:hover {
      transform: none;
    }
  }
`;

interface HomeSmallBannerProps {
    text: string;
    contentLeft?: boolean;
    route: string;
    buttonText: string;
}

const HomeSmallBanner: React.FC<HomeSmallBannerProps> = ({
    text,
    contentLeft = false,
    route,
    buttonText
}) => {
    return (
        <BannerContainer>
            <ContentWrapper contentLeft={contentLeft}>
                <TextContent>
                    <BannerText>{text}</BannerText>
                </TextContent>
                <ButtonContent>
                    <StyledLink href={route}>
                        <BannerButton>
                            {buttonText}
                        </BannerButton>
                    </StyledLink>
                </ButtonContent>
            </ContentWrapper>
        </BannerContainer>
    );
};

export default HomeSmallBanner;