'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';
import CreateUserForm from '@/components/user/CreateUserForm';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ImageSection = styled.div<{ imageUrl: string; contentLeft?: boolean }>`
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
    background: ${props => props.contentLeft
    ? 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0) 100%)'
    : 'linear-gradient(to left, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0) 100%)'
  };

    @media (max-width: 768px) {
      background: rgba(0, 0, 0, 0.6);
    }
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  position: relative;
`;

const ContentSection = styled.div<{ contentLeft?: boolean }>`
  position: absolute;
  top: 0;
  ${props => props.contentLeft ? 'left: 0;' : 'right: 0;'}
  width: 50%;
  height: 100%;
  padding: 2rem;
  color: white;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 100%;
    top: auto;
    bottom: 0;
    left: 0;
    background: none;
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 10px;

  @media (max-width: 900px) {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;

  @media (max-width: 900px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.8rem;
    transform: none;
    
    &:hover {
      transform: none;
    }
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
  contentLeft?: boolean;
  bannerCollection?: boolean;
}

const InfoCardComponent: React.FC<InfoCardProps> = ({
  imageUrl,
  title,
  description,
  contentLeft = false,
  bannerCollection = false
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const handleButtonClick = () => {
    if (bannerCollection) {
      if (isAuthenticated) {
        router.push('/my-collection');
      } else {
        setShowLoginForm(true);
      }
    }
  };

  const handleLoginSuccess = (access_token: string) => {
    login(access_token);
    setShowLoginForm(false);
    router.push('/my-collection');
  };

  const handleRegisterClick = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  return (
    <>
      <CardContainer>
        <ImageSection imageUrl={imageUrl} contentLeft={contentLeft} />
        <ContentWrapper>
          <ContentSection contentLeft={contentLeft}>
            <div>
              <Title>{title}</Title>
              <Description>{description}</Description>
            </div>
            {bannerCollection ? (
              <InfoLabel onClick={handleButtonClick}>
                Comenzar ahora
              </InfoLabel>
            ) : (
              <StyledLink href="/collection">
                <InfoLabel>
                  Más información
                </InfoLabel>
              </StyledLink>
            )}
          </ContentSection>
        </ContentWrapper>
      </CardContainer>

      {bannerCollection && (
        <>
          <Modal
            isOpen={showLoginForm}
            onClose={() => setShowLoginForm(false)}
            title="Iniciar Sesión"
          >
            <LoginForm
              onClose={() => setShowLoginForm(false)}
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={handleRegisterClick}
            />
          </Modal>

          <Modal
            isOpen={showRegisterForm}
            onClose={() => setShowRegisterForm(false)}
            title="Crear Usuario"
          >
            <CreateUserForm onClose={() => setShowRegisterForm(false)} />
          </Modal>
        </>
      )}
    </>
  );
};

export default InfoCardComponent;
