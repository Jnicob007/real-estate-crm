import { USER_ROLES } from '@real-estate-crm/shared-types';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(12, 'Hasło musi mieć co najmniej 12 znaków.')
  .max(128, 'Hasło jest zbyt długie.')
  .regex(/[A-Za-z]/, 'Hasło musi zawierać literę.')
  .regex(/[0-9]/, 'Hasło musi zawierać cyfrę.');

const emailSchema = z
  .string()
  .trim()
  .email('Podaj poprawny adres e-mail.')
  .max(255)
  .transform((value) => value.toLowerCase());

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Imię i nazwisko są wymagane.')
  .max(100);

const employeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(USER_ROLES),
  employee: employeeSchema.optional(),
});

export const bootstrapAdminSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type BootstrapAdminBody = z.infer<typeof bootstrapAdminSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
