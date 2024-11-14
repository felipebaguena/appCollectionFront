import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useGenres } from '@/hooks/useGenres';

const GenresWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (max-width: 900px) {
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const GenresTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--dark-grey);
  white-space: nowrap;
  line-height: 1;
  display: flex;
  align-items: flex-end;
  gap: 1rem;

  @media (max-width: 900px) {
    color: var(--clear-grey);
  }
    
  @media (max-width: 480px) {
    &::after {
        content: '';
        height: 1px;
        background-color: var(--clear-grey);
        flex-grow: 1;
    }
  }
`;

const GenresContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const GenreItem = styled.div<{ $code: string }>`
  position: relative;
  height: 6.45rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    
    &::after {
      background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5));
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3));
    transition: background 0.2s ease;

    @media (max-width: 900px) {
      background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2));
    }
  }
`;

const GenreImage = styled.div<{ $code: string }>`
  width: 100%;
  height: 100%;
  background-image: url(http://localhost:3000/uploads/buttons/${props => props.$code}.png);
  background-size: cover;
  background-position: center;
`;

const GenreInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.8rem;
  z-index: 1;
`;

const GenreName = styled.h4`
  font-size: 0.9rem;
  color: var(--white);
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 900px) {
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
  }
`;

// Lista de códigos de los géneros que queremos mostrar
const FEATURED_GENRE_CODES = ["ACTION", "FIGHTING", "PLATFORMER", "SURVIVAL_HORROR", "SPORTS"];

const GenresList = () => {
    const router = useRouter();
    const { genres, loading, error } = useGenres();

    const handleGenreClick = (genreId: number) => {
        router.push(`/collection?genre=${genreId}`);
    };

    if (loading) return <div>Cargando géneros...</div>;
    if (error) return <div>Error al cargar los géneros</div>;

    // Filtramos solo los géneros que queremos mostrar
    const featuredGenres = genres.filter(genre =>
        FEATURED_GENRE_CODES.includes(genre.code)
    );

    return (
        <GenresWrapper>
            <GenresTitle>Géneros más populares</GenresTitle>
            <GenresContainer>
                {featuredGenres.map((genre) => (
                    <GenreItem
                        key={genre.id}
                        $code={genre.code}
                        onClick={() => handleGenreClick(genre.id)}
                    >
                        <GenreImage $code={genre.code} />
                        <GenreInfo>
                            <GenreName>{genre.name}</GenreName>
                        </GenreInfo>
                    </GenreItem>
                ))}
            </GenresContainer>
        </GenresWrapper>
    );
};

export default GenresList; 