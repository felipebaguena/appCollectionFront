'use client';

import React, { useState, useEffect } from 'react';
import { FiLogOut, FiChevronDown } from 'react-icons/fi';
import { jwtDecode } from "jwt-decode";
import CreateUserForm from '@/components/user/CreateUserForm';
import LoginForm from '@/components/auth/LoginForm';
import UserProfileModal from '@/components/user/UserProfileModal';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import {
  NavbarContainer,
  NavbarContent,
  Logo,
  LogoLink,
  NavLink,
  NavbarSection,
  DropdownContainer,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger
} from '@/components/layout/NavbarElements';

interface DecodedToken {
  role: string;
}

const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showManagementMenu, setShowManagementMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuthState('authenticated');
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setUserRole(null);
      }
    } else {
      setAuthState('unauthenticated');
      setUserRole(null);
    }
  }, []);

  const handleLoginSuccess = (access_token: string) => {
    localStorage.setItem('access_token', access_token);
    setAuthState('authenticated');
    try {
      const decodedToken = jwtDecode<DecodedToken>(access_token);
      setUserRole(decodedToken.role);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      setUserRole(null);
    }
    setShowLoginForm(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('access_token');
    setAuthState('unauthenticated');
    setUserRole(null);
    setShowLogoutConfirmation(false);
  };

  const handleRegisterClick = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const managementOptions = [
    { name: "Juegos", route: "/management/manage-games" },
    { name: "Plataformas", route: "/management/manage-platforms" },
    { name: "Géneros", route: "/management/manage-genres" },
    { name: "Desarrolladores", route: "/management/manage-developers" }
  ];

  const renderAuthButtons = () => {
    switch (authState) {
      case 'loading':
        return null;
      case 'authenticated':
        return (
          <>
            {userRole === 'SUPERUSER' && (
              <DropdownContainer
                data-open={showManagementMenu}
                onMouseEnter={() => setShowManagementMenu(true)}
                onMouseLeave={() => setShowManagementMenu(false)}
              >
                <DropdownTrigger href="#">
                  Gestión <FiChevronDown />
                </DropdownTrigger>
                <DropdownMenu $isOpen={showManagementMenu}>
                  {managementOptions.map((option) => (
                    <DropdownItem
                      key={option.name}
                      href={option.route}
                      onClick={() => setShowManagementMenu(false)}
                    >
                      {option.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </DropdownContainer>
            )}
            <NavLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowProfileModal(true);
              }}
            >
              Mi Perfil
            </NavLink>
            <NavLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogoutClick();
              }}
              title="Cerrar Sesión"
            >
              <FiLogOut size={15} />
            </NavLink>
          </>
        );
      case 'unauthenticated':
        return <NavLink href="#" onClick={(e) => { e.preventDefault(); setShowLoginForm(true); }}>Iniciar Sesión</NavLink>;
    }
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <NavbarSection $position='left'>
          <LogoLink href="/">
            <Logo>LOGO</Logo>
          </LogoLink>
        </NavbarSection>
        <NavbarSection $position="right">
          <NavLink href="/">Inicio</NavLink>
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
