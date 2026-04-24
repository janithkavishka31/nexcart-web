import { z } from 'zod';

const slugPattern = /^[a-z0-9-]+$/;

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  slug: z
    .string()
    .trim()
    .max(80, 'Slug must be 80 characters or less')
    .refine((value) => !value || slugPattern.test(value), {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    }),
  description: z.string().trim().max(500, 'Description must be 500 characters or less'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export type CategoryFormSubmitValues = {
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
};

export function isValidCategoryImageUrl(value: string) {
  return value.startsWith('/uploads/') || z.string().url().safeParse(value).success;
}
