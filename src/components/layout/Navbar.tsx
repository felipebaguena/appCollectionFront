'use client';

import React, { useState, useEffect } from 'react';
import CreateUserForm from '@/components/user/CreateUserForm';
import LoginForm from '@/components/auth/LoginForm';
import UserProfileModal from '@/components/user/UserProfileModal';
import Modal from '@/components/ui/Modal';
import { NavbarContainer, NavbarContent, Logo, NavButton, ButtonGroup } from '@/components/ui/NavbarElements';

const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setAuthState(token ? 'authenticated' : 'unauthenticated');
  }, []);

  const handleLoginSuccess = (access_token: string) => {
    localStorage.setItem('access_token', access_token);
    setAuthState('authenticated');
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setAuthState('unauthenticated');
  };

  const handleRegisterClick = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const renderAuthButtons = () => {
    switch (authState) {
      case 'loading':
        return null;
      case 'authenticated':
        return (
          <ButtonGroup>
            <NavButton variant="dark" onClick={() => setShowProfileModal(true)}>Mi Perfil</NavButton>
            <NavButton variant="danger" onClick={handleLogout}>Cerrar Sesión</NavButton>
          </ButtonGroup>
        );
      case 'unauthenticated':
        return <NavButton variant="primary" onClick={() => setShowLoginForm(true)}>Iniciar Sesión</NavButton>;
    }
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo>Mi App</Logo>
        {renderAuthButtons()}
        <Modal isOpen={showLoginForm} onClose={() => setShowLoginForm(false)}>
          <LoginForm 
            onClose={() => setShowLoginForm(false)} 
            onLoginSuccess={handleLoginSuccess}
            onRegisterClick={handleRegisterClick}
          />
        </Modal>
        <Modal isOpen={showRegisterForm} onClose={() => setShowRegisterForm(false)}>
          <CreateUserForm onClose={() => setShowRegisterForm(false)} />
        </Modal>
        <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
          <UserProfileModal onClose={() => setShowProfileModal(false)} />
        </Modal>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;