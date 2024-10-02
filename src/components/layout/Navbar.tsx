'use client';

import React, { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import CreateUserForm from '@/components/user/CreateUserForm';
import LoginForm from '@/components/auth/LoginForm';
import UserProfileModal from '@/components/user/UserProfileModal';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { NavbarContainer, NavbarContent, Logo, NavLink, NavbarSection } from '@/components/ui/NavbarElements';

const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
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

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('access_token');
    setAuthState('unauthenticated');
    setShowLogoutConfirmation(false);
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
          <>
            <NavLink onClick={() => setShowProfileModal(true)}>Mi Perfil</NavLink>
            <NavLink onClick={handleLogoutClick} title="Cerrar Sesión">
              <FiLogOut size={15} />
            </NavLink>
          </>
        );
      case 'unauthenticated':
        return <NavLink onClick={() => setShowLoginForm(true)}>Iniciar Sesión</NavLink>;
    }
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <NavbarSection $position="left">
          <Logo>Mi App</Logo>
        </NavbarSection>
        <NavbarSection $position="right">
          <NavLink>Inicio</NavLink>
          {renderAuthButtons()}
        </NavbarSection>
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
        <Modal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)}
          title="Mi Perfil"
        >
          <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
        </Modal>
        <ConfirmationModal
          isOpen={showLogoutConfirmation}
          onClose={() => setShowLogoutConfirmation(false)}
          onConfirm={handleLogoutConfirm}
          title="Cierre de sesión"
          message="¿Estás seguro de que deseas cerrar la sesión?"
        />
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;