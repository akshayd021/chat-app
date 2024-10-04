// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state to manage rehydration

  // Load user data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));  // Rehydrate authUser from localStorage
    }
    setLoading(false);  // Once localStorage is checked, stop loading
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
