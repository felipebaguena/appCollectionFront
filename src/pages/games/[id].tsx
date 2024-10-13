import GameDetails from '@/components/games/GameDetail';
import { useRouter } from 'next/router';


const GamePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return <GameDetails id={id as string} />;
};

export default GamePage;