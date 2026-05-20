import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHouses, getHouseById, createHouse, updateHouse, deleteHouse } from '@/lib/api';
import type { CreateHouseInput, UpdateHouseInput } from '@/types';

const HOUSES_KEY = ['houses'];

export function useHouses() {
  return useQuery({
    queryKey: HOUSES_KEY,
    queryFn: getHouses,
  });
}

export function useHouse(id: string | undefined) {
  return useQuery({
    queryKey: [...HOUSES_KEY, id],
    queryFn: () => getHouseById(id!),
    enabled: !!id,
  });
}

export function useCreateHouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHouseInput) => createHouse(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOUSES_KEY }),
  });
}

export function useUpdateHouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateHouseInput) => updateHouse(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOUSES_KEY }),
  });
}

export function useDeleteHouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHouse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOUSES_KEY }),
  });
}
