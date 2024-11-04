import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: inherit;
`;

const SpinnerCircle = styled.div`
  width: 4rem;
  height: 4rem;
  border: 8px solid var(--dark-grey);
  border-top: 8px solid var(--app-yellow);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = () => (
    <SpinnerWrapper>
        <SpinnerCircle />
    </SpinnerWrapper>
);

export default Spinner; 