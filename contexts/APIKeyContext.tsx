import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface APIKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined);

export const APIKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini-api-key', '');

  return (
    <APIKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </APIKeyContext.Provider>
  );
};

export const useAPIKey = () => {
  const context = useContext(APIKeyContext);
  if (context === undefined) {
    throw new Error('useAPIKey must be used within an APIKeyProvider');
  }
  return context;
};