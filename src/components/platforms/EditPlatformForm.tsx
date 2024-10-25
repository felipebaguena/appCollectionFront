import React, { useState } from 'react';
import { Platform } from '@/types/platform';
import { usePlatform } from '@/hooks/usePlatform';
import {
    StyledForm,
    InputGroup,
    Label,
    Input,
    ButtonContainer,
    ErrorMessage,
    FormContainer
} from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface EditPlatformFormProps {
    item: Platform;
    onClose: () => void;
}

const EditPlatformForm: React.FC<EditPlatformFormProps> = ({ item, onClose }) => {
    const { updatePlatform } = usePlatform(item.id.toString());

    const [formData, setFormData] = useState({
        name: item.name,
        code: item.code
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await updatePlatform(formData);
            onClose();
        } catch (error) {
            console.error("Error al actualizar la plataforma", error);
            setError("Error al actualizar la plataforma. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Editar Plataforma: ${item.name}`}
            width="95%"
            maxWidth="30rem"
            height="auto"
            maxHeight="90vh"
        >
            <StyledForm onSubmit={handleSubmit}>
                <FormContainer direction="column">
                    <InputGroup>
                        <Label htmlFor="name">Nombre:</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="code">Código:</Label>
                        <Input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </FormContainer>
                <ButtonContainer>
                    <Button $variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button $variant="cancel" type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                </ButtonContainer>
            </StyledForm>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Modal>
    );
};

export default EditPlatformForm;
