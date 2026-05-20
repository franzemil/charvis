import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDepartment, useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';

export default function DepartmentFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { data: existing } = useDepartment(id);
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description);
    }
  }, [existing]);

  const isPending = createDept.isPending || updateDept.isPending;
  const canSave = name.trim().length > 0 && !isPending;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      if (isEditing) {
        await updateDept.mutateAsync({
          id: id!,
          name: name.trim(),
          description: description.trim(),
        });
      } else {
        await createDept.mutateAsync({
          name: name.trim(),
          description: description.trim(),
        });
      }
      router.back();
    } catch (e) {
      // error handled by react query
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
    >
      <View className="flex-1 p-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditing ? 'Edit Department' : 'New Department'}
        </Text>

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Computer Science"
          placeholderTextColor="#9ca3af"
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-white mb-4"
        />

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-white mb-6 min-h-[100px]"
        />

        <View className="flex-row gap-3 mt-auto">
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
      </View>
    </KeyboardAvoidingView>
  );
}
