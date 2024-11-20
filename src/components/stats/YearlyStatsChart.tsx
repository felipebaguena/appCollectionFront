import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { getImageUrl } from '@/services/api';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface GameYearStats {
    id: number;
    title: string;
    addedAt: string;
    coverImage: {
        id: number;
        path: string;
    };
}

interface MonthStats {
    month: string;
    owned: {
        count: number;
        games: GameYearStats[];
    };
    wished: {
        count: number;
        games: GameYearStats[];
    };
}

interface YearlyStatsProps {
    data: MonthStats[];
}

interface TooltipPosition {
    x: number;
    y: number;
}

interface SelectedGames {
    games: GameYearStats[];
    type: 'owned' | 'wished';
    month: string;
}

const ChartContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem;
  height: 500px;
  background: var(--light-grey);
`;

const MonthsAxis = styled.div<{ $isWide: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem 0;
  min-width: ${({ $isWide }) => $isWide ? '6rem' : '3rem'};
  width: auto;
`;

const MonthLabel = styled.span`
  font-size: 0.875rem;
  color: var(--dark-grey);
  text-transform: capitalize;
  width: auto;
  white-space: nowrap;
`;

const BarsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

const MonthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  position: relative;
`;

const BackgroundBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1rem;
  background-color: var(--bars-grey);
`;

const Bar = styled.div<{ $width: number; $type: 'owned' | 'wished' }>`
  height: 1rem;
  background-color: ${({ $type }) =>
        $type === 'owned' ? 'var(--app-yellow)' : 'var(--dark-grey)'};
  width: ${({ $width }) => `${$width}%`};
  transition: width 0.3s ease;
  position: relative;
  cursor: pointer;
  z-index: 1;

  &:hover {
    opacity: 0.8;
  }
`;

const CountTooltip = styled.div<{ $position: TooltipPosition }>`
  position: fixed;
  background: var(--dark-grey);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0.5rem 1rem;
  z-index: 10;
  left: ${({ $position }) => `${$position.x}px`};
  top: ${({ $position }) => `${$position.y}px`};
  transform: translate(-50%, -100%);
  margin-top: -10px;
  font-size: 0.875rem;
  color: white;
  white-space: nowrap;
  pointer-events: none;
`;

const ModalContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const GameCard = styled.div`
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const GameModalImage = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
`;

const GameModalTitle = styled.div`
  padding: 0.75rem;
  font-size: 0.875rem;
  text-align: center;
  color: var(--dark-grey);
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;

const formatMonth = (dateString: string, full: boolean = false) => {
    const months = {
        '01': full ? 'Enero' : 'Ene',
        '02': full ? 'Febrero' : 'Feb',
        '03': full ? 'Marzo' : 'Mar',
        '04': full ? 'Abril' : 'Abr',
        '05': full ? 'Mayo' : 'May',
        '06': full ? 'Junio' : 'Jun',
        '07': full ? 'Julio' : 'Jul',
        '08': full ? 'Agosto' : 'Ago',
        '09': full ? 'Septiembre' : 'Sep',
        '10': full ? 'Octubre' : 'Oct',
        '11': full ? 'Noviembre' : 'Nov',
        '12': full ? 'Diciembre' : 'Dic'
    };

    const [, month] = dateString.split('-');
    return months[month as keyof typeof months];
};

const YearlyStatsChart: React.FC<YearlyStatsProps> = ({ data }) => {
    const [selectedGames, setSelectedGames] = useState<SelectedGames | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipContent, setTooltipContent] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 900);

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 900);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const maxGames = Math.max(...data.map(month =>
        Math.max(month.owned.count, month.wished.count)
    ));

    const calculateWidth = (count: number) => {
        return (count / maxGames) * 100;
    };

    const handleBarClick = (games: GameYearStats[], type: 'owned' | 'wished', month: string) => {
        setSelectedGames({ games, type, month });
    };

    const handleCloseModal = () => {
        setSelectedGames(null);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        setTooltipPosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    const handleMouseEnter = (count: number, type: 'owned' | 'wished') => {
        const text = type === 'owned'
            ? `${count} juego${count !== 1 ? 's' : ''} adquirido${count !== 1 ? 's' : ''}`
            : `${count} juego${count !== 1 ? 's' : ''} deseado${count !== 1 ? 's' : ''}`;
        setTooltipContent(text);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <>
            <ChartContainer>
                <MonthsAxis $isWide={isWideScreen}>
                    {data.map(month => (
                        <MonthLabel key={month.month}>
                            {formatMonth(month.month, isWideScreen)}
                        </MonthLabel>
                    ))}
                </MonthsAxis>

                <BarsContainer>
                    {data.map(month => (
                        <MonthRow key={month.month}>
                            <BackgroundBar />
                            {month.owned.count > 0 && (
                                <Bar
                                    $width={calculateWidth(month.owned.count)}
                                    $type="owned"
                                    onClick={() => handleBarClick(month.owned.games, 'owned', month.month)}
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => handleMouseEnter(month.owned.count, 'owned')}
                                    onMouseLeave={handleMouseLeave}
                                />
                            )}

                            {month.wished.count > 0 && (
                                <Bar
                                    $width={calculateWidth(month.wished.count)}
                                    $type="wished"
                                    onClick={() => handleBarClick(month.wished.games, 'wished', month.month)}
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => handleMouseEnter(month.wished.count, 'wished')}
                                    onMouseLeave={handleMouseLeave}
                                />
                            )}
                        </MonthRow>
                    ))}
                </BarsContainer>
            </ChartContainer>

            {showTooltip && (
                <CountTooltip $position={tooltipPosition}>
                    {tooltipContent}
                </CountTooltip>
            )}

            {selectedGames && (
                <Modal
                    isOpen={true}
                    onClose={handleCloseModal}
                    title={`Juegos ${selectedGames.type === 'owned' ? 'en propiedad' : 'deseados'} - ${formatMonth(selectedGames.month, true)}`}
                >
                    <ModalContent>
                        {selectedGames.games.map(game => (
                            <GameCard key={game.id}>
                                <GameModalImage
                                    src={getImageUrl(game.coverImage.path)}
                                    alt={game.title}
                                />
                                <GameModalTitle>{game.title}</GameModalTitle>
                            </GameCard>
                        ))}
                    </ModalContent>
                    <CloseButtonContainer>
                        <Button $variant="cancel" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </CloseButtonContainer>
                </Modal>
            )}
        </>
    );
};

export default YearlyStatsChart;