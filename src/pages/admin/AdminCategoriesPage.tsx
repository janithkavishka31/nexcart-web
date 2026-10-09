import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Loader } from '@/components/common/Loader';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/Table';
import type { CategoryFormSubmitValues, CategoryFormValues } from '@/features/categories/categorySchemas';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useListCategoriesQuery,
  useUpdateCategoryMutation,
} from '@/features/products/productsApi';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/product';
import { getApiErrorMessage } from '@/utils/apiError';
import { getCategoryImage } from '@/utils/categoryMedia';

type FormMode = 'create' | 'edit' | null;

function toFormValues(category: Category): Partial<CategoryFormValues> & { imageUrl?: string | null } {
  return {
    name: category.name,
    slug: category.slug ?? '',
    description: category.description ?? '',
    imageUrl: category.imageUrl ?? null,
  };
}

function toCategoryPayload(values: CategoryFormSubmitValues): CreateCategoryInput | UpdateCategoryInput {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description ?? null,
    imageUrl: values.imageUrl ?? null,
  };
}

export default function AdminCategoriesPage() {
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data, error, isLoading } = useListCategoriesQuery();
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();

  const categories = data?.data ?? [];
  const isSaving = createState.isLoading || updateState.isLoading;

  function openCreateForm() {
    setEditingCategory(null);
    setFormMode('create');
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setFormMode('edit');
  }

  function closeForm() {
    setFormMode(null);
    setEditingCategory(null);
  }

  async function handleSubmit(values: CategoryFormSubmitValues) {
    const payload = toCategoryPayload(values);

    try {
      if (formMode === 'create') {
        const response = await createCategory(payload as CreateCategoryInput).unwrap();
        toast.success(response.message ?? 'Category created successfully');
      } else if (editingCategory) {
        const response = await updateCategory({
          categoryId: editingCategory.id,
          data: payload as UpdateCategoryInput,
        }).unwrap();
        toast.success(response.message ?? 'Category updated successfully');
      }

      closeForm();
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError, 'Could not save category. Check the form and try again.'));
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return;

    try {
      const response = await deleteCategory(deletingCategory.id).unwrap();
      toast.success(response.message ?? 'Category removed successfully');
      setDeletingCategory(null);
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Could not remove category. Please try again.'));
    }
  }

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Category',
        cell: ({ row }) => (
          <div className="flex min-w-[14rem] items-center gap-3">
            <img
              alt=""
              className="size-10 shrink-0 rounded-xl object-cover"
              src={getCategoryImage(row.original)}
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900 dark:text-white">{row.original.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {row.original.slug ?? 'No slug'}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <p className="max-w-md truncate text-sm text-slate-600 dark:text-slate-300">
            {row.original.description?.trim() || '—'}
          </p>
        ),
      },
      {
        accessorKey: 'productCount',
        header: 'Products',
        cell: ({ row }) => row.original.productCount ?? '—',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              aria-label={`Edit ${row.original.name}`}
              size="sm"
              variant="ghost"
              onClick={() => openEditForm(row.original)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              aria-label={`Delete ${row.original.name}`}
              size="sm"
              variant="ghost"
              onClick={() => setDeletingCategory(row.original)}
            >
              <Trash2 className="size-4 text-rose-600" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Categories</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create, update, and remove categories used across the catalog.
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={openCreateForm}>
          <Plus className="size-4" />
          Create category
        </Button>
      </div>

      {isLoading ? <Loader label="Loading categories..." /> : null}
      {error ? (
        <ErrorState
          title="Failed to load categories"
          description="We could not load category data right now."
        />
      ) : null}

      {!isLoading && !error && categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category to organize products in the store."
        />
      ) : null}

      {!isLoading && !error && categories.length > 0 ? (
        <>
          <div className="hidden md:block">
            <DataTable columns={columns} data={categories} />
          </div>

          <div className="grid gap-4 md:hidden">
            {categories.map((category) => (
              <Card key={category.id} className="space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    alt=""
                    className="size-16 shrink-0 rounded-2xl object-cover"
                    src={getCategoryImage(category)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-950 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {category.slug ?? 'No slug'}
                        </p>
                      </div>
                      <Badge>
                        {category.productCount == null
                          ? 'Count unavailable'
                          : `${category.productCount} ${category.productCount === 1 ? 'product' : 'products'}`}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      {category.description?.trim() || 'No description added yet.'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => openEditForm(category)}>
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeletingCategory(category)}>
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      <Modal
        isOpen={formMode !== null}
        title={formMode === 'create' ? 'Create category' : 'Edit category'}
        onClose={closeForm}
      >
        <CategoryForm
          key={editingCategory?.id ?? 'create'}
          defaultValues={editingCategory ? toFormValues(editingCategory) : undefined}
          isLoading={isSaving}
          mode={formMode === 'edit' ? 'edit' : 'create'}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        isOpen={deletingCategory !== null}
        title="Delete category"
        onClose={() => setDeletingCategory(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Delete <strong>{deletingCategory?.name}</strong>? Products already assigned to this
            category may need to be updated before shoppers can browse them correctly.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              className="sm:w-auto"
              variant="outline"
              onClick={() => setDeletingCategory(null)}
            >
              Cancel
            </Button>
            <Button
              className="sm:w-auto"
              disabled={deleteState.isLoading}
              variant="danger"
              onClick={handleDelete}
            >
              {deleteState.isLoading ? 'Deleting...' : 'Delete category'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
