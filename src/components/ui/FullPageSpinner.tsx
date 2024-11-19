import styled from 'styled-components';
import { FOOTER_HEIGHT } from '../layout/FooterElements';
import { NAVBAR_HEIGHT } from '../layout/NavbarElements';
import Spinner from './Spinner';

const FullPageContainer = styled.div`
  min-height: calc(100vh - ${FOOTER_HEIGHT} - ${NAVBAR_HEIGHT});
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--light-grey);
`;

const FullPageSpinner = () => (
    <FullPageContainer>
        <Spinner />
    </FullPageContainer>
);

export default FullPageSpinner; 