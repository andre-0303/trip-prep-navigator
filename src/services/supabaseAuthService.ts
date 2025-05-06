
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

// Register a new user
export const registerUser = async (credentials: UserCredentials) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name || credentials.email.split('@')[0]
        }
      }
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    toast.error("Erro ao registrar", {
      description: error.message || "Email já registrado ou senha inválida"
    });
    return { success: false, error };
  }
};

// Login user
export const loginUser = async (credentials: UserCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    toast.error("Erro ao fazer login", {
      description: error.message || "Email ou senha incorretos"
    });
    return { success: false, error };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    toast.error("Erro ao sair", {
      description: error.message || "Não foi possível fazer logout"
    });
    return { success: false, error };
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session: data.session };
  } catch (error) {
    return { success: false, session: null };
  }
};

// Get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};
