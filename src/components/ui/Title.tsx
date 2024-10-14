import React from 'react';
import styled from 'styled-components';

interface TitleProps {
    children: React.ReactNode;
    className?: string;
}

const StyledTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
`;

const Title: React.FC<TitleProps> = ({ children, className }) => {
    return <StyledTitle className={className}>{children}</StyledTitle>;
};

export default Title;