import { z } from 'zod';

const emailField = z.string().trim().toLowerCase().email('Enter a valid email address.');
const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password is too long.')
  .refine((value) => /[a-z]/.test(value), 'Add a lowercase letter.')
  .refine((value) => /[A-Z]/.test(value), 'Add an uppercase letter.')
  .refine((value) => /[0-9]/.test(value), 'Add a digit.')
  .refine((value) => /[^A-Za-z0-9]/.test(value), 'Add a symbol (e.g. !@#$).');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short.').max(120),
  email: emailField,
  phone: z.string().trim().min(6).max(20).optional(),
  password: passwordField,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required.').max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: passwordField,
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({ email: emailField });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: passwordField,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailQuerySchema = z.object({ token: z.string().min(20).max(200) });
export type VerifyEmailInput = z.infer<typeof verifyEmailQuerySchema>;

export const resendVerificationSchema = z.object({ email: emailField });
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
