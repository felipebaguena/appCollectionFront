import React from 'react';
import styled from 'styled-components';
import { useLog } from '@/contexts/LogContext';

const LogContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  max-width: 300px;
  max-height: 200px;
  overflow: auto;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 10px;
`;

const LogEntry = styled.div`
  margin-bottom: 5px;
`;

const LogDisplay: React.FC = () => {
    const { logs } = useLog();
    return (
        <LogContainer>
            {logs.map((log, index) => (
                <LogEntry key={index}>{log}</LogEntry>
            ))}
        </LogContainer>
    );
};

export default LogDisplay;