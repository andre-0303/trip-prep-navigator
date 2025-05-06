
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserCredentials, loginUser, registerUser, logoutUser, getCurrentSession } from '@/services/supabaseAuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentials) => Promise<boolean>;
  register: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
      }
    );

    // THEN check for existing session
    getCurrentSession().then(({ success, session }) => {
      if (success && session) {
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: UserCredentials): Promise<boolean> => {
    const { success, data } = await loginUser(credentials);
    
    if (success && data.session) {
      setUser(data.session.user);
      setSession(data.session);
      setIsAuthenticated(true);
      toast.success("Login bem-sucedido!", {
        description: `Bem-vindo(a) ${data.session.user.user_metadata.name || data.session.user.email}!`
      });
      return true;
    }
    return false;
  };

  const register = async (credentials: UserCredentials): Promise<boolean> => {
    const { success, data } = await registerUser(credentials);
    
    if (success && data?.session) {
      setUser(data.session.user);
      setSession(data.session);
      setIsAuthenticated(true);
      toast.success("Registro concluído!", {
        description: "Sua conta foi criada com sucesso"
      });
      return true;
    }
    return false;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success("Desconectado", {
      description: "Você saiu da sua conta"
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      loading,
      session
    }}>
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
