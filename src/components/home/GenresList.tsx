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

const GenreItem = styled.div`
  background-color: var(--dark-grey);
  color: var(--white);
  padding: 1rem;
  height: 6.45rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--app-yellow);
    color: var(--dark-grey);
    transform: translateX(5px);
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
                        onClick={() => handleGenreClick(genre.id)}
                    >
                        {genre.name}
                    </GenreItem>
                ))}
            </GenresContainer>
        </GenresWrapper>
    );
};

export default GenresList; 