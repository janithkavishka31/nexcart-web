import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resolveAssetUrl } from '@/api/env';

import {
  isValidProductImageUrl,
  MAX_PRODUCT_IMAGES,
  productFormSchema,
  type ProductFormSubmitValues,
  type ProductFormValues,
} from '@/features/products/productSchemas';
import { useUploadProductImageMutation } from '@/features/products/productsApi';

import type { Category } from '@/types/product';

import { cn } from '@/utils/cn';

const selectClassName =
  'focus-ring h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const textareaClassName =
  'focus-ring min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

const fileInputClassName =
  'focus-ring w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300';

const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface PendingImage {
  key: string;
  file: File;
  preview: string;
}

export function ProductForm({
  categories,
  defaultValues,
  isLoading,
  mode,
  onCancel,
  onSubmit,
}: {
  categories: Category[];
  defaultValues?: Partial<ProductFormValues> & { images?: string[] };
  isLoading: boolean;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSubmit: (values: ProductFormSubmitValues) => Promise<void>;
}) {
  const [savedImages, setSavedImages] = useState<string[]>(defaultValues?.images ?? []);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImage] = useUploadProductImageMutation();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: 0,
      stock: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  const totalImages = savedImages.length + pendingImages.length;
  const isBusy = isLoading || isUploading;

  useEffect(() => {
    setSavedImages(defaultValues?.images ?? []);
    setPendingImages((current) => {
      current.forEach((image) => {
        if (image.preview.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });
      return [];
    });
    setUrlInput('');
  }, [defaultValues?.images, mode]);

  useEffect(() => {
    return () => {
      pendingImages.forEach((image) => {
        if (image.preview.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [pendingImages]);

  function validateImageFile(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(`${file.name}: use JPEG, PNG, WebP, or GIF.`);
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`${file.name}: must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
      return false;
    }

    return true;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    const availableSlots = MAX_PRODUCT_IMAGES - totalImages;

    if (availableSlots <= 0) {
      toast.error(`You can add up to ${MAX_PRODUCT_IMAGES} images per product.`);
      event.target.value = '';
      return;
    }

    const acceptedFiles = files.filter(validateImageFile).slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(`Only ${availableSlots} more image(s) can be added.`);
    }

    setPendingImages((current) => [
      ...current,
      ...acceptedFiles.map((file) => ({
        key: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);

    event.target.value = '';
  }

  function removeSavedImage(index: number) {
    setSavedImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function removePendingImage(key: string) {
    setPendingImages((current) => {
      const target = current.find((image) => image.key === key);

      if (target?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(target.preview);
      }

      return current.filter((image) => image.key !== key);
    });
  }

  function addImageUrl() {
    const value = urlInput.trim();

    if (!value) return;

    if (!isValidProductImageUrl(value)) {
      toast.error('Enter a valid image URL or upload a file.');
      return;
    }

    if (totalImages >= MAX_PRODUCT_IMAGES) {
      toast.error(`You can add up to ${MAX_PRODUCT_IMAGES} images per product.`);
      return;
    }

    setSavedImages((current) => [...current, value]);
    setUrlInput('');
  }

  async function uploadPendingImages() {
    const uploadedUrls: string[] = [];

    for (const pending of pendingImages) {
      const formData = new FormData();
      formData.append('image', pending.file);
      const response = await uploadImage(formData).unwrap();
      uploadedUrls.push(response.data.url);
    }

    return uploadedUrls;
  }

  async function handleSubmit(values: ProductFormValues) {
    try {
      setIsUploading(true);
      const uploadedUrls = pendingImages.length ? await uploadPendingImages() : [];
      await onSubmit({ ...values, images: [...savedImages, ...uploadedUrls] });
    } catch {
      toast.error('Could not save product images. Try again or use image URLs.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <Input
        label="Product name"
        {...form.register('name')}
        error={form.formState.errors.name?.message}
        placeholder="Wireless headphones"
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
        <textarea
          className={cn(
            textareaClassName,
            form.formState.errors.description && 'border-rose-400 focus-visible:ring-rose-500',
          )}
          placeholder="Describe your product in detail..."
          {...form.register('description')}
        />
        {form.formState.errors.description?.message ? (
          <span className="text-sm text-rose-600">{form.formState.errors.description.message}</span>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        Category
        <select className={selectClassName} {...form.register('categoryId')}>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {form.formState.errors.categoryId?.message ? (
          <span className="block text-sm text-rose-600">{form.formState.errors.categoryId.message}</span>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Price"
          type="number"
          min="0"
          step="0.01"
          {...form.register('price')}
          error={form.formState.errors.price?.message}
        />
        <Input
          label="Stock"
          type="number"
          min="0"
          step="1"
          {...form.register('stock')}
          error={form.formState.errors.stock?.message}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Product images (optional)
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalImages}/{MAX_PRODUCT_IMAGES}
          </span>
        </div>

        <label className="block space-y-2">
          <input
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className={fileInputClassName}
            disabled={totalImages >= MAX_PRODUCT_IMAGES}
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Choose one or more files — JPEG, PNG, WebP, or GIF, max {MAX_IMAGE_SIZE_MB} MB each
          </span>
        </label>

        {totalImages > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {savedImages.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <img alt="" className="aspect-square w-full object-cover" src={resolveAssetUrl(url)} />
                <button
                  aria-label="Remove image"
                  className="absolute right-2 top-2 rounded-full bg-slate-950/70 p-1 text-white transition hover:bg-rose-600"
                  type="button"
                  onClick={() => removeSavedImage(index)}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {pendingImages.map((image) => (
              <div
                key={image.key}
                className="group relative overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/20"
              >
                <img alt="" className="aspect-square w-full object-cover" src={image.preview} />
                <span className="absolute bottom-2 left-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  New
                </span>
                <button
                  aria-label="Remove image"
                  className="absolute right-2 top-2 rounded-full bg-slate-950/70 p-1 text-white transition hover:bg-rose-600"
                  type="button"
                  onClick={() => removePendingImage(image.key)}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="flex-1"
            label="Or paste image URL"
            placeholder="https://example.com/product.jpg"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addImageUrl();
              }
            }}
          />
          <Button
            className="sm:mt-7 sm:w-auto"
            disabled={totalImages >= MAX_PRODUCT_IMAGES || !urlInput.trim()}
            type="button"
            variant="outline"
            onClick={addImageUrl}
          >
            Add URL
          </Button>
        </div>
      </div>

      {mode === 'edit' ? (
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input
            className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            type="checkbox"
            {...form.register('isActive')}
          />
          Product is active and visible in the catalog
        </label>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button className="sm:w-auto" type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="sm:w-auto" disabled={isBusy} type="submit">
          {isBusy ? 'Saving...' : mode === 'create' ? 'Add product' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
