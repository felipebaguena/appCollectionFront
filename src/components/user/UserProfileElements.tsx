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
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: white;
  margin: 0;
`;

interface SectionHeaderProps {
    title: string;
    rightContent?: React.ReactNode;
}

export const SectionHeader = ({ title, rightContent }: SectionHeaderProps) => (
    <HeaderContainer>
        <Title>{title}</Title>
        {rightContent}
    </HeaderContainer>
);

export const ProfileInfo = styled.div`
  display: flex;
  gap: 4rem;
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