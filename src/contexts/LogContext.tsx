import React, { createContext, useState, useContext, useCallback } from 'react';

interface LogContextType {
    logs: string[];
    addLog: (log: string) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

let globalAddLog: ((log: string) => void) | null = null;

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = useCallback((log: string) => {
        setLogs(prevLogs => [...prevLogs, log]);
    }, []);

    globalAddLog = addLog;

    return (
        <LogContext.Provider value={{ logs, addLog }}>
            {children}
        </LogContext.Provider>
    );
};

export const useLog = () => {
    const context = useContext(LogContext);
    if (context === undefined) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;
};

export const logMessage = (message: string) => {
    if (globalAddLog) {
        globalAddLog(message);
    } else {
        console.log(message);
    }
};
