export interface Department {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface CreateDepartmentInput {
  name: string;
  description: string;
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  id: string;
}

export interface House {
  id: string;
  name: string;
  departmentId: string;
  departmentName?: string;
  createdBy: string;
  createdAt: Date;
}

export interface CreateHouseInput {
  name: string;
  departmentId: string;
}

export interface UpdateHouseInput extends Partial<CreateHouseInput> {
  id: string;
}
