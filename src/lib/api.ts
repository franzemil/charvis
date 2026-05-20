import firestore from '@react-native-firebase/firestore';
import { auth, db } from './firebase';
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  House,
  CreateHouseInput,
  UpdateHouseInput,
} from '@/types';

function assertAuth() {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.uid;
}

// ── Departments ──

const deptCollection = () => db.collection('departments');

export function subscribeDepartments(
  onData: (departments: Department[]) => void,
  onError: (error: Error) => void,
) {
  return deptCollection()
    .orderBy('createdAt', 'desc')
    .onSnapshot({
      next: (snapshot) => {
        const list: Department[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt.toDate(),
        })) as Department[];
        onData(list);
      },
      error: onError,
    });
}

export async function getDepartments(): Promise<Department[]> {
  const snapshot = await deptCollection().orderBy('createdAt', 'desc').get();
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt.toDate(),
  })) as Department[];
}

export async function getDepartmentById(id: string): Promise<Department | null> {
  const snap = await deptCollection().doc(id).get();
  if (!snap.exists()) return null;
  const data = snap.data()!;
  return { id: snap.id, ...data, createdAt: data.createdAt.toDate() } as Department;
}

export async function createDepartment(input: CreateDepartmentInput): Promise<Department> {
  const uid = assertAuth();
  const now = firestore.FieldValue.serverTimestamp();
  const ref = await deptCollection().add({
    ...input,
    createdBy: uid,
    createdAt: now,
  });
  return { id: ref.id, ...input, createdBy: uid, createdAt: new Date() };
}

export async function updateDepartment(input: UpdateDepartmentInput): Promise<void> {
  assertAuth();
  const { id, ...data } = input;
  await deptCollection().doc(id).update(data);
}

export async function deleteDepartment(id: string): Promise<void> {
  assertAuth();
  await deptCollection().doc(id).delete();
}

// ── Houses ──

const houseCollection = () => firestore().collection('houses');

export function subscribeHouses(
  onData: (houses: House[]) => void,
  onError: (error: Error) => void,
) {
  return houseCollection()
    .orderBy('createdAt', 'desc')
    .onSnapshot({
      next: async (snapshot) => {
        const list: House[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt.toDate(),
        })) as House[];

        await attachDeptNames(list);
        onData(list);
      },
      error: onError,
    });
}

async function attachDeptNames(houses: House[]) {
  const deptSnap = await deptCollection().get();
  const deptMap = new Map(deptSnap.docs.map((d) => [d.id, d.data().name as string]));
  for (const house of houses) {
    house.departmentName = deptMap.get(house.departmentId) ?? 'Unknown';
  }
}

export async function getHouses(): Promise<House[]> {
  const snapshot = await houseCollection().orderBy('createdAt', 'desc').get();
  const list = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt.toDate(),
  })) as House[];
  await attachDeptNames(list);
  return list;
}

export async function getHouseById(id: string): Promise<House | null> {
  const snap = await houseCollection().doc(id).get();
  if (!snap.exists()) return null;
  const data = snap.data()!;
  const house = { id: snap.id, ...data, createdAt: data.createdAt.toDate() } as House;
  const deptSnap = await deptCollection().doc(house.departmentId).get();
  house.departmentName = deptSnap.exists() ? (deptSnap.data()!.name as string) : 'Unknown';
  return house;
}

export async function createHouse(input: CreateHouseInput): Promise<House> {
  const uid = assertAuth();
  const now = firestore.FieldValue.serverTimestamp();
  const ref = await houseCollection().add({
    ...input,
    createdBy: uid,
    createdAt: now,
  });

  let departmentName = 'Unknown';
  const deptSnap = await deptCollection().doc(input.departmentId).get();
  if (deptSnap.exists()) departmentName = deptSnap.data()!.name as string;
  return { id: ref.id, ...input, departmentName, createdBy: uid, createdAt: new Date() };
}

export async function updateHouse(input: UpdateHouseInput): Promise<void> {
  assertAuth();
  const { id, ...data } = input;
  await houseCollection().doc(id).update(data);
}

export async function deleteHouse(id: string): Promise<void> {
  assertAuth();
  await houseCollection().doc(id).delete();
}
