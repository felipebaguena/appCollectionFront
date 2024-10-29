import React from 'react';
import styled from 'styled-components';
import { Game } from '@/types/game';
import {
    ViewForm,
    Label,
    ButtonContainer,
    FieldValue,
} from '@/components/ui/FormElements';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const HeaderSection = styled.div`
  margin-bottom: 0rem;
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const Description = styled.div`
  width: 100%;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--clear-grey);
`;

interface ViewGameFormProps {
    item: Game;
    onClose: () => void;
}

const ViewGameForm: React.FC<ViewGameFormProps> = ({ item, onClose }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={item.title}
            width="95%"
            maxWidth="70rem"
            height="auto"
        >
            <ViewForm as="div">
                <HeaderSection>
                    <MetaInfo>
                        <InfoGroup>
                            <Label>Desarrolladores</Label>
                            <FieldValue>{item.developers?.map(d => d.name).join(', ') || 'N/A'}</FieldValue>
                        </InfoGroup>
                        <InfoGroup>
                            <Label>Año de lanzamiento</Label>
                            <FieldValue>{item.releaseYear}</FieldValue>
                        </InfoGroup>
                        <InfoGroup>
                            <Label>Géneros</Label>
                            <FieldValue>{item.genres?.map(g => g.name).join(', ') || 'N/A'}</FieldValue>
                        </InfoGroup>
                        <InfoGroup>
                            <Label>Plataformas</Label>
                            <FieldValue>{item.platforms?.map(p => p.name).join(', ') || 'N/A'}</FieldValue>
                        </InfoGroup>
                    </MetaInfo>
                </HeaderSection>

                <Description>
                    {item.description}
                </Description>

                <ButtonContainer>
                    <Button $variant="cancel" onClick={onClose}>Cerrar</Button>
                </ButtonContainer>
            </ViewForm>
        </Modal>
    );
};

export default ViewGameForm;
