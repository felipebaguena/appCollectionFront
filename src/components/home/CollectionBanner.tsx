'use client'

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';
import CreateUserForm from '@/components/user/CreateUserForm';

const BannerWrapper = styled.div`
  width: 100%;
  background-color: var(--app-yellow);
  padding: 1.5rem 0;
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
  }
`;

const BannerText = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h2`
  color: var(--dark-grey);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const BannerDescription = styled.p`
  color: var(--dark-grey);
  font-size: 1rem;
`;

const BannerButton = styled.button`
  background-color: var(--dark-grey);
  min-width: 20rem;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    color: var(--app-yellow);
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export default function CollectionBanner() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();

    const handleButtonClick = () => {
        if (isAuthenticated) {
            router.push('/my-collection');
        } else {
            setShowLoginForm(true);
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
            <BannerWrapper>
                <BannerContent>
                    <BannerText>
                        <BannerTitle>Gestiona tu colección de juegos</BannerTitle>
                        <BannerDescription>
                            Registra tus juegos, puntúa sus estados y mantén un seguimiento de tu colección.
                        </BannerDescription>
                    </BannerText>
                    <BannerButton onClick={handleButtonClick}>
                        Comenzar ahora
                    </BannerButton>
                </BannerContent>
            </BannerWrapper>

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
    );
} 