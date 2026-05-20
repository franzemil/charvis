import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { View, ActivityIndicator } from 'react-native';

interface AuthContextValue {
  user: any | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const webClientId = '760964313570-v1h69dlms33n20dpk00dk086f2ihk47i.apps.googleusercontent.com';

GoogleSignin.configure({ webClientId });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      if (!data?.idToken) throw new Error('No ID token');
      const credential = auth.GoogleAuthProvider.credential(data.idToken);
      await auth().signInWithCredential(credential);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  const signOut = async () => {
    await Promise.all([GoogleSignin.signOut(), auth().signOut()]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

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
