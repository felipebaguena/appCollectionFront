'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '@/components/ui/Modal';
import Calendar from '@/components/ui/Calendar';
import { Article } from '@/types/article';
import { useArticle } from '@/hooks/useArticle';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { ButtonContainer } from '@/components/ui/FormElements';

const CalendarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
`;

interface ScheduleArticleFormProps {
    item: Article;
    onClose: () => void;
}

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
};

const ScheduleArticleForm: React.FC<ScheduleArticleFormProps> = ({
    item,
    onClose
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { scheduleArticle } = useArticle(item.id.toString());

    const handleSchedule = async () => {
        if (!selectedDate) return;
        try {
            await scheduleArticle(selectedDate);
            onClose();
        } catch (error) {
            console.error('Error al programar el artículo:', error);
        }
    };

    return (
        <>
            <Modal
                isOpen={true}
                onClose={onClose}
                title="Programar publicación de artículo"
                width="95%"
                maxWidth="400px"
            >
                <CalendarContainer>
                    <Calendar
                        selectedDate={selectedDate}
                        onChange={setSelectedDate}
                        hasTime={true}
                        disablePastDates={true}
                    />
                    <ButtonContainer>
                        <Button
                            $variant="primary"
                            onClick={() => setShowConfirmation(true)}
                            disabled={!selectedDate}
                        >
                            Programar
                        </Button>
                        <Button $variant="cancel" onClick={onClose}>
                            Cancelar
                        </Button>
                    </ButtonContainer>
                </CalendarContainer>
            </Modal>

            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleSchedule}
                title="Confirmar programación"
                message={selectedDate ?
                    `¿Deseas programar el artículo "${item.title}" para el ${formatDate(selectedDate)}?` :
                    ''}
                confirmText="Confirmar"
                cancelText="Cancelar"
            />
        </>
    );
};

export default ScheduleArticleForm; 