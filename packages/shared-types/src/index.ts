export const USER_ROLES = ['administrator', 'manager', 'agent'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const EMPLOYMENT_STATUSES = ['active', 'inactive'] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export type PublicUser = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  employmentStatus: EmploymentStatus;
  createdAt: string;
};

export type RegisteredUser = PublicUser & {
  employee: EmployeeProfile | null;
};

export type CreateUserInput = {
  email: string;
  password: string;
  role: UserRole;
  employee?: {
    firstName: string;
    lastName: string;
  };
};

export type BootstrapAdminInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};
