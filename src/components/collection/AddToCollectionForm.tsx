import React, { useState } from 'react';
import styled from 'styled-components';
import StarRating from '@/components/ui/StarRating';
import {
    StyledForm,
    InputGroup,
    Label,
    TextArea,
    ButtonContainer
} from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import SliderBar from '@/components/ui/SliderBar';
import CustomCheckbox from '@/components/ui/CustomCheckbox';

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled(Label)`
  margin: 0;
  cursor: pointer;
  user-select: none;
`;

interface AddToCollectionFormProps {
    onSubmit: (data: {
        rating?: number;
        status?: number;
        complete: boolean;
        notes?: string;
    }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const AddToCollectionForm: React.FC<AddToCollectionFormProps> = ({
    onSubmit,
    onCancel,
    isLoading
}) => {
    const [rating, setRating] = useState<number>(0);
    const [status, setStatus] = useState<number>(0);
    const [complete, setComplete] = useState(false);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            rating: rating || undefined,
            status: status ? parseFloat(status.toString()) : undefined,
            complete,
            notes: notes || undefined
        });
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <RatingContainer>
                <Label>Puntuación</Label>
                <StarRating
                    value={rating}
                    onChange={setRating}
                    size={28}
                />
            </RatingContainer>

            <InputGroup>
                <Label>Estado del juego</Label>
                <SliderBar
                    value={status}
                    onChange={setStatus}
                />
            </InputGroup>

            <CheckboxGroup>
                <CustomCheckbox
                    id="complete"
                    checked={complete}
                    onChange={setComplete}
                />
                <CheckboxLabel htmlFor="complete">Completo</CheckboxLabel>
            </CheckboxGroup>

            <InputGroup>
                <Label>Notas</Label>
                <TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Añade notas sobre tu copia del juego..."
                />
            </InputGroup>

            <ButtonContainer>
                <Button
                    type="button"
                    onClick={onCancel}
                    $variant="cancel"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    $variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Añadiendo...' : 'Añadir a la colección'}
                </Button>
            </ButtonContainer>
        </StyledForm>
    );
};

export default AddToCollectionForm;