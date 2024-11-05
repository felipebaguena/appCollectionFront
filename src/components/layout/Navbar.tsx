'use client';

import React, { useState } from 'react';
import { FiLogOut, FiChevronDown, FiUser } from 'react-icons/fi';
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
  DropdownTrigger,
  IconNavLink,
  IconsContainer,
  NavbarSpinner,
  SpinnerContainer,
} from '@/components/layout/NavbarElements';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showManagementMenu, setShowManagementMenu] = useState(false);

  const { isAuthenticated, userRole, logout, login, loading } = useAuth();

  const managementOptions = [
    { name: "Juegos", route: "/management/manage-games" },
    { name: "Plataformas", route: "/management/manage-platforms" },
    { name: "Géneros", route: "/management/manage-genres" },
    { name: "Desarrolladores", route: "/management/manage-developers" }
  ];

  const renderAuthButtons = () => {
    if (isAuthenticated) {
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
          <IconsContainer>
            <IconNavLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowProfileModal(true);
              }}
              title="Mi Perfil"
            >
              <FiUser size={15} />
            </IconNavLink>
            <IconNavLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogoutClick();
              }}
              title="Cerrar Sesión"
            >
              <FiLogOut size={15} />
            </IconNavLink>
          </IconsContainer>
        </>
      );
    }

    return (
      <NavLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setShowLoginForm(true);
        }}
      >
        Iniciar Sesión
      </NavLink>
    );
  };

  const handleLoginSuccess = (access_token: string) => {
    login(access_token);
    setShowLoginForm(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirmation(false);
  };

  const handleRegisterClick = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
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
          {loading ? (
            <SpinnerContainer>
              <NavbarSpinner />
            </SpinnerContainer>
          ) : (
            <>
              <NavLink href="/">Inicio</NavLink>
              <NavLink href="/collection">Catálogo</NavLink>
              {isAuthenticated && (
                <NavLink href="/my-collection">Mi colección</NavLink>
              )}
              {renderAuthButtons()}
            </>
          )}
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
