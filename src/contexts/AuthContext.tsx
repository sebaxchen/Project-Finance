import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';

// Tipo User local que reemplaza el de Supabase
interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    // Timeout de seguridad: si después de 3 segundos no hay respuesta, mostrar la landing page
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout, showing landing page');
        setLoading(false);
      }
    }, 3000);

    const initializeAuth = async () => {
      try {
        const sessionResult = await supabase.auth.getSession();
        if (!mounted) return;
        
        clearTimeout(timeoutId);
        const session = sessionResult?.data?.session;
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    try {
      const authStateResult = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        
        (async () => {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        })();
      });

      // El servicio de Firebase retorna { data: { subscription: { unsubscribe } } }
      unsubscribe = authStateResult?.data?.subscription?.unsubscribe || 
                    authStateResult?.subscription?.unsubscribe || 
                    null;
    } catch (error) {
      console.error('Error setting up auth state change:', error);
    }

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        await loadProfile(data.user.id);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'advisor') => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned');

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
      });

      if (profileError) throw profileError;

      // Actualizar estado después de registro exitoso
      setUser(authData.user);
      await loadProfile(authData.user.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
