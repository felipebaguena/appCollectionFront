import React, { useState, useEffect } from 'react';
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
import Spinner from '@/components/ui/Spinner';

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

const FormWrapper = styled.div`
  position: relative;
  min-height: 300px;
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
    initialData?: {
        rating: number | null;
        status: number | null;
        complete: boolean;
        notes: string | null;
    };
    isEditing?: boolean;
}

const AddToCollectionForm: React.FC<AddToCollectionFormProps> = ({
    onSubmit,
    onCancel,
    isLoading,
    initialData,
    isEditing = false
}) => {
    const [formData, setFormData] = useState<{
        rating: number;
        status: number;
        complete: boolean;
        notes: string;
    } | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(isEditing);

    useEffect(() => {
        if (initialData) {
            setFormData({
                rating: initialData.rating || 0,
                status: initialData.status || 0,
                complete: initialData.complete || false,
                notes: initialData.notes || ''
            });
            setIsLoadingData(false);
        } else if (!isEditing) {
            setFormData({
                rating: 0,
                status: 0,
                complete: false,
                notes: ''
            });
            setIsLoadingData(false);
        }
    }, [initialData, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        onSubmit({
            rating: formData.rating || undefined,
            status: formData.status ? parseFloat(formData.status.toString()) : undefined,
            complete: formData.complete,
            notes: formData.notes || undefined
        });
    };

    if (isLoadingData || !formData) {
        return <Spinner />;
    }

    return (
        <FormWrapper>
            <StyledForm onSubmit={handleSubmit}>
                <RatingContainer>
                    <Label>Puntuación</Label>
                    <StarRating
                        value={formData.rating}
                        onChange={(value) => setFormData(prev => prev ? { ...prev, rating: value } : null)}
                        size={28}
                    />
                </RatingContainer>

                <InputGroup>
                    <Label>Estado del juego</Label>
                    <SliderBar
                        value={formData.status}
                        onChange={(value) => setFormData(prev => prev ? { ...prev, status: value } : null)}
                    />
                </InputGroup>

                <CheckboxGroup>
                    <CustomCheckbox
                        id="complete"
                        checked={formData.complete}
                        onChange={(value) => setFormData(prev => prev ? { ...prev, complete: value } : null)}
                    />
                    <CheckboxLabel htmlFor="complete">Completo</CheckboxLabel>
                </CheckboxGroup>

                <InputGroup>
                    <Label>Notas</Label>
                    <TextArea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => prev ? { ...prev, notes: e.target.value } : null)}
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
                        {isLoading ? (isEditing ? 'Actualizando...' : 'Añadiendo...')
                            : (isEditing ? 'Actualizar juego' : 'Añadir a la colección')}
                    </Button>
                </ButtonContainer>
            </StyledForm>
        </FormWrapper>
    );
};

export default AddToCollectionForm;