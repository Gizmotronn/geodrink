import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getSessionActive, setSessionActive } from '../utils/storage';

interface SessionContextType {
  hasSession: boolean;
  isLoadingSession: boolean;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  hasSession: false,
  isLoadingSession: true,
  startSession: async () => {},
  endSession: async () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [hasSession, setHasSession] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const active = await getSessionActive();
    setHasSession(active);
    setIsLoadingSession(false);
  };

  const startSession = async () => {
    setHasSession(true);
    await setSessionActive(true);
  };

  const endSession = async () => {
    setHasSession(false);
    await setSessionActive(false);
  };

  return (
    <SessionContext.Provider value={{ hasSession, isLoadingSession, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
}
