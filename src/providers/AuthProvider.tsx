import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import auth from '@react-native-firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextValue {
  user: any | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const androidClientId = '760964313570-dlntfvri6ggi35h5qaaifl3dd8dt0h2m.apps.googleusercontent.com';
const iosClientId = '760964313570-dlntfvri6ggi35h5qaaifl3dd8dt0h2m.apps.googleusercontent.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [, googleResponse, googlePrompt] = Google.useIdTokenAuthRequest({
    iosClientId,
    androidClientId,
  });

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      const credential = auth.GoogleAuthProvider.credential(id_token);
      auth().signInWithCredential(credential);
    }
  }, [googleResponse]);

  const signIn = async () => {
    await googlePrompt();
  };

  const signOut = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
