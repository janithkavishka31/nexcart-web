import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';

import { resolveAssetUrl } from '@/api/env';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  categoryFormSchema,
  isValidCategoryImageUrl,
  type CategoryFormSubmitValues,
  type CategoryFormValues,
} from '@/features/categories/categorySchemas';
import { useUploadCategoryImageMutation } from '@/features/products/productsApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { cn } from '@/utils/cn';

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

export function CategoryForm({
  defaultValues,
  isLoading,
  mode,
  onCancel,
  onSubmit,
}: {
  defaultValues?: Partial<CategoryFormValues> & { imageUrl?: string | null };
  isLoading: boolean;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSubmit: (values: CategoryFormSubmitValues) => Promise<void>;
}) {
  const [savedImage, setSavedImage] = useState<string | null>(defaultValues?.imageUrl ?? null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImage] = useUploadCategoryImageMutation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: {
      name: defaultValues?.name ?? '',
      slug: defaultValues?.slug ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const isBusy = isLoading || isUploading;

  useEffect(() => {
    setSavedImage(defaultValues?.imageUrl ?? null);
    setUrlInput('');
    setPendingImage((current) => {
      if (current?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(current.preview);
      }

      return null;
    });
  }, [defaultValues?.imageUrl, mode]);

  useEffect(() => {
    return () => {
      if (pendingImage?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(pendingImage.preview);
      }
    };
  }, [pendingImage]);

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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!validateImageFile(file)) {
      event.target.value = '';
      return;
    }

    setPendingImage((current) => {
      if (current?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(current.preview);
      }

      return {
        key: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        preview: URL.createObjectURL(file),
      };
    });

    event.target.value = '';
  }

  function clearPendingImage() {
    setPendingImage((current) => {
      if (current?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(current.preview);
      }

      return null;
    });
  }

  function clearSavedImage() {
    setSavedImage(null);
    setUrlInput('');
  }

  function clearAllImages() {
    clearSavedImage();
    clearPendingImage();
  }

  function applyImageUrl() {
    const value = urlInput.trim();

    if (!value) return;
    if (!isValidCategoryImageUrl(value)) {
      toast.error('Enter a valid image URL or upload a file.');
      return;
    }

    clearPendingImage();
    setSavedImage(value);
    setUrlInput('');
  }

  async function uploadPendingImage() {
    if (!pendingImage) return null;

    const formData = new FormData();
    formData.append('image', pendingImage.file);
    const response = await uploadImage(formData).unwrap();
    return response.data.url;
  }

  async function handleSubmit(values: CategoryFormValues) {
    let nextImageUrl = savedImage;

    if (pendingImage) {
      try {
        setIsUploading(true);
        nextImageUrl = await uploadPendingImage();
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            'Could not upload the category image. Keep the current image or try again.',
          ),
        );
        return;
      } finally {
        setIsUploading(false);
      }
    }

    await onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim() || undefined,
      description: values.description.trim() ? values.description.trim() : null,
      imageUrl: nextImageUrl?.trim() ? nextImageUrl : null,
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <Input
        label="Category name"
        placeholder="Watches"
        {...form.register('name')}
        error={form.formState.errors.name?.message}
      />

      <Input
        label="Slug"
        placeholder="watches"
        {...form.register('slug')}
        error={form.formState.errors.slug?.message}
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
        <textarea
          className={cn(
            textareaClassName,
            form.formState.errors.description && 'border-rose-400 focus-visible:ring-rose-500',
          )}
          maxLength={500}
          placeholder="Optional short description for this category..."
          {...form.register('description')}
        />
        <div className="flex items-center justify-between gap-3">
          {form.formState.errors.description?.message ? (
            <span className="text-sm text-rose-600">{form.formState.errors.description.message}</span>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Up to 500 characters
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {form.watch('description')?.length ?? 0}/500
          </span>
        </div>
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Category image (optional)
          </span>
          {(savedImage || pendingImage) && (
            <Button className="sm:w-auto" type="button" variant="ghost" onClick={clearAllImages}>
              Clear image
            </Button>
          )}
        </div>

        <label className="block space-y-2">
          <input
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className={fileInputClassName}
            type="file"
            onChange={handleFileChange}
          />
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Upload JPEG, PNG, WebP, or GIF up to {MAX_IMAGE_SIZE_MB} MB.
          </span>
        </label>

        {(savedImage || pendingImage) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {savedImage ? (
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Current image
                </p>
                <div className="group relative overflow-hidden rounded-2xl">
                  <img
                    alt=""
                    className="aspect-square w-full object-cover"
                    src={resolveAssetUrl(savedImage)}
                  />
                  <button
                    aria-label="Remove current image"
                    className="absolute right-2 top-2 rounded-full bg-slate-950/70 p-1 text-white transition hover:bg-rose-600"
                    type="button"
                    onClick={clearSavedImage}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : null}

            {pendingImage ? (
              <div className="space-y-2 rounded-2xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  New image
                </p>
                <div className="group relative overflow-hidden rounded-2xl">
                  <img alt="" className="aspect-square w-full object-cover" src={pendingImage.preview} />
                  <button
                    aria-label="Remove new image"
                    className="absolute right-2 top-2 rounded-full bg-slate-950/70 p-1 text-white transition hover:bg-rose-600"
                    type="button"
                    onClick={clearPendingImage}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="flex-1"
            label="Or paste image URL"
            placeholder="https://example.com/category.jpg"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyImageUrl();
              }
            }}
          />
          <Button
            className="sm:mt-7 sm:w-auto"
            disabled={!urlInput.trim()}
            type="button"
            variant="outline"
            onClick={applyImageUrl}
          >
            Use URL
          </Button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button className="sm:w-auto" type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="sm:w-auto" disabled={isBusy} type="submit">
          {isBusy ? 'Saving...' : mode === 'create' ? 'Create category' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
