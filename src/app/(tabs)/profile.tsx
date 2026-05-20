import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 bg-white dark:bg-black items-center pt-24 px-6">
      {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} className="w-24 h-24 rounded-full mb-4" />
      ) : (
        <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
          <Text className="text-white text-3xl font-bold">
            {user?.displayName?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
      )}

      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        {user?.displayName ?? 'User'}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400 mb-8">{user?.email}</Text>

      <TouchableOpacity onPress={signOut} className="bg-red-500 px-8 py-3 rounded-xl">
        <Text className="text-white font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
