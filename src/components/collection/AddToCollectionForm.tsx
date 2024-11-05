import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGame } from '@/hooks/useGame';

import { Platform } from '@/types/platform';
import StarRating from '@/components/ui/StarRating';
import SliderBar from '@/components/ui/SliderBar';
import MultiSelect from '../ui/Multiselect';
import Spinner from '@/components/ui/Spinner';
import CustomCheckbox from '@/components/ui/CustomCheckbox';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: var(--clear-grey);
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const SubmitButton = styled(Button)`
  background-color: var(--app-yellow);
  color: var(--dark-grey);

  &:hover {
    background-color: var(--app-yellow-hover);
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--grey);
  color: white;

  &:hover {
    background-color: var(--dark-grey);
  }
`;

const CheckboxLabel = styled(Label)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxText = styled.span`
  color: var(--clear-grey);
`;

interface FormData {
    rating: number;
    status: number;
    complete: boolean;
    notes: string;
    platformIds: number[];
}

interface AddToCollectionFormProps {
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
    initialData?: {
        rating: number | string | null;
        status: number | string | null;
        complete: boolean;
        notes: string | null;
        platforms: Platform[];
    };
    isEditing?: boolean;
    gameId: number;
}

const AddToCollectionForm: React.FC<AddToCollectionFormProps> = ({
    onSubmit,
    onCancel,
    isLoading,
    initialData,
    isEditing,
    gameId
}) => {
    const [formData, setFormData] = useState<FormData>({
        rating: 0,
        status: 0,
        complete: false,
        notes: '',
        platformIds: []
    });

    const { game, loading: loadingGame, fetchGame } = useGame(gameId.toString());
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
    const [isFormReady, setIsFormReady] = useState(false);

    useEffect(() => {
        fetchGame();
    }, [gameId, fetchGame]);

    useEffect(() => {
        if (isEditing) {
            // Para edición, necesitamos tanto las plataformas como los datos iniciales
            if (!loadingGame && initialData && game) {
                setIsFormReady(true);
            }
        } else {
            // Para añadir, solo necesitamos las plataformas
            if (!loadingGame && game) {
                setIsFormReady(true);
            }
        }
    }, [loadingGame, initialData, game, isEditing]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                rating: typeof initialData.rating === 'string'
                    ? parseFloat(initialData.rating)
                    : initialData.rating ?? 0,
                status: typeof initialData.status === 'string'
                    ? parseFloat(initialData.status)
                    : initialData.status ?? 0,
                complete: initialData.complete,
                notes: initialData.notes ?? '',
                platformIds: initialData.platforms?.map(p => p.id) ?? []
            });
            setSelectedPlatforms(initialData.platforms ?? []);
        }
    }, [initialData]);

    const handleRatingChange = (value: number) => {
        setFormData(prev => ({ ...prev, rating: value }));
    };

    const handleStatusChange = (value: number) => {
        setFormData(prev => ({ ...prev, status: value }));
    };

    const handleCompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, complete: e.target.checked }));
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, notes: e.target.value }));
    };

    const handlePlatformsChange = (selected: Platform[]) => {
        setSelectedPlatforms(selected);
        setFormData(prev => ({ ...prev, platformIds: selected.map(p => p.id) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isFormReady) return <Spinner />;

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label>Valoración</Label>
                <StarRating value={formData.rating} onChange={handleRatingChange} />
            </FormGroup>

            <FormGroup>
                <Label>Estado</Label>
                <SliderBar value={formData.status} onChange={handleStatusChange} />
            </FormGroup>

            <FormGroup>
                <CheckboxLabel>
                    <CustomCheckbox
                        checked={formData.complete}
                        onChange={(checked) => setFormData(prev => ({ ...prev, complete: checked }))}
                    />
                    <CheckboxText>Completo</CheckboxText>
                </CheckboxLabel>
            </FormGroup>

            <FormGroup>
                <Label>Plataformas en las que poseo el juego</Label>
                <MultiSelect
                    options={game?.platforms || []}
                    selectedOptions={selectedPlatforms}
                    onChange={handlePlatformsChange}
                    placeholder="Selecciona las plataformas"
                />
            </FormGroup>

            <FormGroup>
                <Label>Notas</Label>
                <TextArea
                    value={formData.notes}
                    onChange={handleNotesChange}
                    placeholder="Añade notas sobre el juego..."
                />
            </FormGroup>

            <ButtonGroup>
                <CancelButton type="button" onClick={onCancel}>
                    Cancelar
                </CancelButton>
                <SubmitButton type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Añadir'}
                </SubmitButton>
            </ButtonGroup>
        </Form>
    );
};

export default AddToCollectionForm;