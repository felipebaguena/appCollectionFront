import styled from 'styled-components';

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
`;

export const HeaderAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--app-yellow);
  position: absolute;
  top: -20px;
  left: 0;
`;

export const HeaderNik = styled.h2`
  font-size: 1.5rem;
  color: white;
  margin: 0 0 0 100px;
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

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const AvatarImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--app-yellow);
`;

export const NikName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--dark-grey);
`;

export const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
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
  font-size: 1.5rem;
  color: white;
  margin: 0;
`;

interface SectionHeaderProps {
    title?: string;
    rightContent?: React.ReactNode;
    avatarUrl?: string;
    nik?: string;
}

export const SectionHeader = ({ title, rightContent, avatarUrl, nik }: SectionHeaderProps) => (
    <HeaderContainer>
        <HeaderAvatarSection>
            {avatarUrl && (
                <>
                    <HeaderAvatar
                        src={avatarUrl}
                        alt="Avatar"
                    />
                    <HeaderNik>{nik}</HeaderNik>
                </>
            )}
            {title && <Title>{title}</Title>}
        </HeaderAvatarSection>
        {rightContent}
    </HeaderContainer>
); 