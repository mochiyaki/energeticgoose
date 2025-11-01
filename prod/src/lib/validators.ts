import { z } from 'zod';

export const signupSchema = z.object({
  orgName: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const financingApplicationSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  cardBrand: z.string().min(1, 'Card brand is required'),
  cardLast4: z.string().length(4, 'Last 4 digits required'),
  invoiceAmount: z.coerce.number().positive('Amount must be greater than 0'),
  durationDays: z.coerce.number().min(7, 'Minimum 7 days').max(360, 'Maximum 360 days'),
});

export const invoiceUploadSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const updateOrgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type FinancingApplicationInput = z.infer<typeof financingApplicationSchema>;
export type InvoiceUploadInput = z.infer<typeof invoiceUploadSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
