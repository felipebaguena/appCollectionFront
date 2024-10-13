import GameDetails from '@/components/games/GameDetail';

export default function GamePage({ params }: { params: { id: string } }) {
    return <GameDetails id={params.id} />;
}
