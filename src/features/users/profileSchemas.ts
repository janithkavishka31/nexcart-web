import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  phone: z
    .string()
    .trim()
    .refine((value) => value === '' || (value.length >= 7 && value.length <= 20), {
      message: 'Phone must be 7–20 characters',
    }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
}
