import React, { useState } from 'react';
import { api } from "@/services/api";
import { ENDPOINTS } from "@/constants/endpoints";
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

interface CreateDeveloperFormProps {
    onClose: () => void;
    onDeveloperCreated: () => void;
}

const CreateDeveloperForm: React.FC<CreateDeveloperFormProps> = ({ onClose, onDeveloperCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: ''
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
            await api.post(ENDPOINTS.CREATE_DEVELOPER, formData);
            onDeveloperCreated();
            onClose();
        } catch (error) {
            console.error("Error al crear el desarrollador", error);
            setError("Error al crear el desarrollador. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Crear Nuevo Desarrollador"
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
                        {isSubmitting ? 'Creando...' : 'Crear desarrollador'}
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

export default CreateDeveloperForm;