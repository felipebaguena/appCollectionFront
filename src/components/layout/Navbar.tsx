'use client';

import React, { useState } from 'react';
import { FiLogOut, FiChevronDown, FiUser, FiBook, FiBookmark, FiSettings, FiFileText } from 'react-icons/fi';
import CreateUserForm from '@/components/user/CreateUserForm';
import LoginForm from '@/components/auth/LoginForm';
import UserProfileModal from '@/components/user/UserProfileModal';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import {
  NavbarContainer,
  NavbarContent,
  LogoContainer,
  LogoText,
  LogoHighlight,
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
  MobileLogoText,
} from '@/components/layout/NavbarElements';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showManagementMenu, setShowManagementMenu] = useState(false);

  const { isAuthenticated, userRole, logout, login, loading } = useAuth();
  const pathname = usePathname() || '';

  const managementOptions = [
    { name: "Juegos", route: "/management/manage-games" },
    { name: "Plataformas", route: "/management/manage-platforms" },
    { name: "Géneros", route: "/management/manage-genres" },
    { name: "Desarrolladores", route: "/management/manage-developers" },
    { name: "Artículos", route: "/management/manage-articles" }
  ];

  const isManagementRoute = pathname.includes('/management');
  const isHome = pathname === '/';

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <IconsContainer>
          <IconNavLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowProfileModal(true);
            }}
            title="Mi Perfil"
          >
            <FiUser size={20} />
          </IconNavLink>
          <IconNavLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogoutClick();
            }}
            title="Cerrar Sesión"
          >
            <FiLogOut size={20} />
          </IconNavLink>
        </IconsContainer>
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
        <span className="nav-text">Iniciar Sesión</span>
        <FiUser className="nav-icon" size={20} />
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
            <LogoContainer $isActive={isHome}>
              <div className="full-text">
                <LogoText $isActive={isHome}>MY </LogoText>
                <LogoHighlight $isActive={isHome}>VIDEOGAME </LogoHighlight>
                <LogoText $isActive={isHome}>COLLECTION</LogoText>
              </div>
              <MobileLogoText className="mobile-text" $isActive={isHome}>
                MVC
              </MobileLogoText>
            </LogoContainer>
          </LogoLink>
        </NavbarSection>
        <NavbarSection $position="right">
          {loading ? (
            <SpinnerContainer>
              <NavbarSpinner />
            </SpinnerContainer>
          ) : (
            <>
              <NavLink
                href="/collection"
                $isActive={pathname === '/collection'}
              >
                <span className="nav-text">Catálogo</span>
                <FiBook className="nav-icon" size={20} />
              </NavLink>
              <NavLink
                href="/articles/articles-home"
                $isActive={pathname.includes('/articles')}
              >
                <span className="nav-text">Artículos</span>
                <FiFileText className="nav-icon" size={20} />
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  href="/my-collection"
                  $isActive={pathname === '/my-collection'}
                >
                  <span className="nav-text">Mi colección</span>
                  <FiBookmark className="nav-icon" size={20} />
                </NavLink>
              )}
              {userRole === 'SUPERUSER' && (
                <DropdownContainer
                  data-open={showManagementMenu}
                  onMouseEnter={() => setShowManagementMenu(true)}
                  onMouseLeave={() => setShowManagementMenu(false)}
                >
                  <DropdownTrigger
                    href="#"
                    $isActive={isManagementRoute}
                  >
                    <span className="nav-text">Gestión</span>
                    <FiSettings className="nav-icon" size={20} />
                    <FiChevronDown />
                  </DropdownTrigger>
                  <DropdownMenu $isOpen={showManagementMenu}>
                    {managementOptions.map((option) => (
                      <DropdownItem
                        key={option.name}
                        href={option.route}
                        onClick={() => setShowManagementMenu(false)}
                        $isActive={pathname === option.route}
                      >
                        {option.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </DropdownContainer>
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
