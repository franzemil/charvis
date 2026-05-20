import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useHouse, useCreateHouse, useUpdateHouse } from '@/hooks/useHouses';
import { useDepartments } from '@/hooks/useDepartments';

export default function HouseFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { data: existing } = useHouse(id);
  const { data: departments } = useDepartments();
  const createHouse = useCreateHouse();
  const updateHouse = useUpdateHouse();

  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDepartmentId(existing.departmentId);
    }
  }, [existing]);

  const isPending = createHouse.isPending || updateHouse.isPending;
  const canSave = name.trim().length > 0 && departmentId.length > 0 && !isPending;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      if (isEditing) {
        await updateHouse.mutateAsync({
          id: id!,
          name: name.trim(),
          departmentId,
        });
      } else {
        await createHouse.mutateAsync({
          name: name.trim(),
          departmentId,
        });
      }
      router.back();
    } catch (e) {
      // handled by react query
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <ScrollView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditing ? 'Edit House' : 'New House'}
        </Text>

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Smith House"
          placeholderTextColor="#9ca3af"
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-white mb-4"
        />

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Department *
        </Text>

        {departments?.length === 0 ? (
          <View className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <Text className="text-yellow-800 dark:text-yellow-200 text-sm">
              Create a department first before adding houses.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-2 mb-6">
            {departments?.map((dept) => (
              <TouchableOpacity
                key={dept.id}
                onPress={() => setDepartmentId(dept.id)}
                className={`px-4 py-2 rounded-full border ${
                  departmentId === dept.id
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    departmentId === dept.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {dept.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-200 dark:bg-gray-800 py-3 rounded-xl items-center"
          >
            <Text className="text-base font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            className={`flex-1 py-3 rounded-xl items-center ${canSave ? 'bg-blue-500' : 'bg-blue-300'}`}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-medium text-white">Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
