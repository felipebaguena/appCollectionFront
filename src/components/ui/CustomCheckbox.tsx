import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: flex;
  width: 24px;
  height: 24px;
  background: ${props => props.checked ? 'white' : 'white'};
  border: 2px solid var(--dark-grey);
  cursor: pointer;
  position: relative;

  svg {
    visibility: ${props => props.checked ? 'visible' : 'hidden'};
    background-color:var(--dark-grey);
    color: var(--app-yellow);
  }

  &:hover {
    border-color: var(--app-yellow);
  }
`;

interface CustomCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, id }) => {
    const handleClick = () => {
        onChange(!checked);
    };

    return (
        <CheckboxContainer onClick={handleClick}>
            <HiddenCheckbox
                checked={checked}
                onChange={() => { }} // Mantenemos esto para evitar warnings
                id={id}
            />
            <StyledCheckbox checked={checked}>
                <FaCheck
                    size={16}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </StyledCheckbox>
        </CheckboxContainer>
    );
};

export default CustomCheckbox;