import { View, FlatList, TouchableOpacity, Alert, Text } from 'react-native';
import { router } from 'expo-router';
import { useHouses, useDeleteHouse } from '@/hooks/useHouses';

export default function HousesScreen() {
  const { data: houses, isLoading } = useHouses();
  const deleteHouse = useDeleteHouse();

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete House', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHouse.mutate(id) },
    ]);
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          isLoading ? null : (
            <View className="flex-1 items-center justify-center pt-32">
              <Text className="text-gray-400 dark:text-gray-500 text-lg">No houses yet</Text>
              <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Tap + to add one
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {item.departmentName ?? 'Unknown'}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => router.push(`/modals/house?id=${item.id}`)}
                className="bg-blue-500 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.name)}
                className="bg-red-500 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">Del</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => router.push('/modals/house')}
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-3xl leading-none">+</Text>
      </TouchableOpacity>
    </View>
  );
}
