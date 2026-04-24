import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000),
  categoryId: z.string().uuid('Select a category'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export type ProductFormSubmitValues = ProductFormValues & {
  images: string[];
};

export const MAX_PRODUCT_IMAGES = 10;

export function isValidProductImageUrl(value: string) {
  return value.startsWith('/uploads/') || z.string().url().safeParse(value).success;
}
