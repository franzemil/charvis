import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <View className="flex-1 bg-white dark:bg-black items-center justify-center px-6">
      <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Charvis</Text>
      <Text className="text-base text-gray-500 dark:text-gray-400 mb-12 text-center">
        Register your departments and houses
      </Text>

      <TouchableOpacity
        onPress={signIn}
        className="flex-row items-center bg-white border border-gray-300 px-6 py-3 rounded-xl shadow-sm"
      >
        <Text className="text-base font-medium text-gray-700">Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
