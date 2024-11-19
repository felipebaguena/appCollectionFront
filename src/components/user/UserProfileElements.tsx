import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import Button from '../ui/Button';
import Link from 'next/link';

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--dark-grey);
  padding: 0 2rem;
  height: 4rem;
  width: 100%;
  position: relative;
`;

export const HeaderAvatarSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
`;

export const HeaderAvatarContainer = styled.div`
  position: absolute;
  width: 6rem;
  height: 6rem;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
  
  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover svg {
    opacity: 1;
  }
`;

export const HeaderAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--app-yellow);
`;

export const HeaderNik = styled.h2`
  font-size: 1.5rem;
  color: var(--app-yellow);
  margin-left: 7rem;
`;

export const ProfileInfo = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background-color: var(--light-grey);
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Label = styled.span`
  font-weight: bold;
  color: var(--dark-grey);
`;

export const Value = styled.span`
  color: var(--dark-grey);
`;

export const StatsContainer = styled.div`
  padding: 2rem;
  background-color: var(--light-grey);
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const GamesList = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: var(--mid-grey);
  gap: 1.5rem;
  padding: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas: 
      "game1 game1 game1 game2 game2 game2"
      "game3 game3 game4 game4 game5 game5";
    gap: 1rem;
    padding: 1.5rem;
    
    & > *:nth-child(1) { grid-area: game1; }
    & > *:nth-child(2) { grid-area: game2; }
    & > *:nth-child(3) { grid-area: game3; }
    & > *:nth-child(4) { grid-area: game4; }
    & > *:nth-child(5) { grid-area: game5; }
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 
      "game1 game1"
      "game2 game3"
      "game4 game5";
    gap: 0.8rem;
    padding: 1rem;
  }
`;

export const GamesSection = styled.div`
  &:last-child {
    margin-bottom: 2rem;
  }
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--app-yellow);
`;

export const StatLabel = styled.div`
  color: #666;
  font-size: 1rem;
  margin-top: 0.75rem;
  font-weight: 500;
`;

export const Title = styled.h2`
  font-size: 1.2rem;
  color: white;
  margin: 0;
`;

interface SectionHeaderProps {
    title?: string;
    rightContent?: React.ReactNode;
    avatarUrl?: string;
    nik?: string;
    onAvatarClick?: () => void;
}

export const SectionHeader = ({ title, rightContent, avatarUrl, nik, onAvatarClick }: SectionHeaderProps) => (
    <HeaderContainer>
        <HeaderAvatarSection>
            {avatarUrl && (
                <>
                    <HeaderAvatarContainer onClick={onAvatarClick}>
                        <HeaderAvatar
                            src={avatarUrl}
                            alt="Avatar"
                        />
                        <EditIcon />
                    </HeaderAvatarContainer>
                    <HeaderNik>{nik}</HeaderNik>
                </>
            )}
            {title && <Title>{title}</Title>}
        </HeaderAvatarSection>
        {rightContent}
    </HeaderContainer>
);

export const EditIcon = styled(FiEdit)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const GameCard = styled.div`
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const GameImage = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
`;

export const GameTitle = styled.div`
  padding: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
  color: var(--dark-grey);
  font-weight: 600;
  background-color: var(--app-yellow);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
`;

export const EditButtonText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

export const EditButtonWrapper = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    min-width: auto;
  }
`;

export interface UserData {
    nik: string;
    name: string;
    email: string;
    avatarPath?: string;
}