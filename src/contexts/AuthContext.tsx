
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserCredentials, getAuthState, loginUser, registerUser, logoutUser } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<boolean>;
  register: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const authState = getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
    setLoading(false);
  }, []);

  const login = async (credentials: UserCredentials): Promise<boolean> => {
    const user = loginUser(credentials);
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo(a) ${user.name}!`
      });
      return true;
    } else {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (credentials: UserCredentials): Promise<boolean> => {
    const user = registerUser(credentials);
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      toast({
        title: "Registro concluído!",
        description: "Sua conta foi criada com sucesso"
      });
      return true;
    } else {
      toast({
        title: "Erro ao registrar",
        description: "Este email já está em uso",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast({
      title: "Desconectado",
      description: "Você saiu da sua conta"
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
