import React, { useState } from 'react';
import { Game } from '@/types/game';
import {
    ModalTitle,
    ModalLabel,
    ModalCloseButton,
    ModalContent,
    FormField,
    Input,
    TextArea,
    SubmitButton
} from '@/components/management/DataTableElements';

interface EditGameFormProps {
    item: Game;
    onClose: () => void;
}

const EditGameForm: React.FC<EditGameFormProps> = ({ item, onClose }) => {
    const [formData, setFormData] = useState(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos actualizados al servidor
        console.log('Datos actualizados:', formData);
        onClose();
    };

    return (
        <ModalContent>
            <ModalTitle>Editar Juego</ModalTitle>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <ModalLabel htmlFor="title">Título:</ModalLabel>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="description">Descripción:</ModalLabel>
                    <TextArea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </FormField>
                <FormField>
                    <ModalLabel htmlFor="releaseYear">Año de lanzamiento:</ModalLabel>
                    <Input
                        type="number"
                        id="releaseYear"
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleChange}
                    />
                </FormField>
                {/* Añade más campos según sea necesario */}
                <SubmitButton type="submit">Guardar cambios</SubmitButton>
                <ModalCloseButton type="button" onClick={onClose}>Cancelar</ModalCloseButton>
            </form>
        </ModalContent>
    );
};

export default EditGameForm;
