import React from 'react';
import { Article } from '@/types/article';
import { useArticle } from '@/hooks/useArticle';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import styled from 'styled-components';

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
`;

const MessageContainer = styled.div`
    text-align: center;
    padding-bottom: 1rem;
    font-size: 1.1rem;
`;

interface PublishActionsArticleFormProps {
    item: Article;
    onClose: () => void;
}

const PublishActionsArticleForm: React.FC<PublishActionsArticleFormProps> = ({
    item,
    onClose
}) => {
    const { publishArticle, unpublishArticle } = useArticle(item.id.toString());

    const handleConfirm = async () => {
        try {
            if (item.published) {
                await unpublishArticle();
            } else {
                await publishArticle();
            }
            onClose();
        } catch (error) {
            console.error('Error al cambiar el estado de publicación:', error);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={item.published ? "Despublicar artículo" : "Publicar artículo"}
            width="95%"
            maxWidth="400px"
        >
            <MessageContainer>
                {item.published
                    ? `¿Estás seguro de que quieres despublicar el artículo "${item.title}"?`
                    : `¿Estás seguro de que quieres publicar el artículo "${item.title}"?`
                }
            </MessageContainer>
            <ButtonContainer>
                <Button
                    $variant={item.published ? "danger" : "primary"}
                    onClick={handleConfirm}
                >
                    {item.published ? "Sí, despublicar" : "Sí, publicar"}
                </Button>
                <Button
                    $variant="cancel"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
            </ButtonContainer>
        </Modal>
    );
};

export default PublishActionsArticleForm;