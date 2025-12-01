import React, { createContext, useContext, useState } from "react";
interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
}
const AuthContext = createContext<{
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}>({ auth: { token: null, name: null, email: null }, setAuth: () => {} });
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    name: null,
    email: null,
  });
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
