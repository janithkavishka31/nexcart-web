import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Loader } from '@/components/common/Loader';
import { ProductForm } from '@/components/forms/ProductForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/Table';

import type { ProductFormSubmitValues, ProductFormValues } from '@/features/products/productSchemas';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useListCategoriesQuery,
  useListMyProductsQuery,
  useUpdateProductMutation,
} from '@/features/products/productsApi';

import type { Product } from '@/types/product';

import { formatCurrency } from '@/utils/format';
import { getProductImage } from '@/utils/productMedia';

type FormMode = 'create' | 'edit' | null;

function toFormValues(product: Product): Partial<ProductFormValues> & { images?: string[] } {
  return {
    name: product.name,
    description: product.description,
    categoryId: product.categoryId ?? product.category?.id ?? '',
    price: product.price,
    stock: product.stock,
    images:
      product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [],
    isActive: product.isActive !== false,
  };
}

function toProductPayload(values: ProductFormSubmitValues) {
  return {
    name: values.name,
    description: values.description,
    categoryId: values.categoryId,
    price: values.price,
    stock: values.stock,
    images: values.images,
    isActive: values.isActive,
  };
}

export default function SellerProductsPage() {
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const { data, error, isLoading } = useListMyProductsQuery({ limit: 100 });
  const { data: categoriesData } = useListCategoriesQuery();
  const [createProduct, createState] = useCreateProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const [deleteProduct, deleteState] = useDeleteProductMutation();

  const products = data?.data ?? [];
  const categories = categoriesData?.data ?? [];
  const isSaving = createState.isLoading || updateState.isLoading;

  function openCreateForm() {
    setEditingProduct(null);
    setFormMode('create');
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormMode('edit');
  }

  function closeForm() {
    setFormMode(null);
    setEditingProduct(null);
  }

  async function handleSubmit(values: ProductFormSubmitValues) {
    const payload = toProductPayload(values);

    try {
      if (formMode === 'create') {
        const response = await createProduct(payload).unwrap();
        toast.success(response.message ?? 'Product created successfully');
      } else if (editingProduct) {
        const response = await updateProduct({
          productId: editingProduct.id,
          data: payload,
        }).unwrap();
        toast.success(response.message ?? 'Product updated successfully');
      }
      closeForm();
    } catch {
      toast.error('Could not save product. Check the form and try again.');
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return;

    try {
      const response = await deleteProduct(deletingProduct.id).unwrap();
      toast.success(response.message ?? 'Product removed successfully');
      setDeletingProduct(null);
    } catch {
      toast.error('Could not remove product. Please try again.');
    }
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => (
          <div className="flex min-w-[12rem] items-center gap-3">
            <img
              alt=""
              className="size-10 shrink-0 rounded-xl object-cover"
              src={getProductImage(row.original)}
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900 dark:text-white">
                {row.original.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {row.original.category?.name ?? 'Uncategorized'}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.price),
      },
      { accessorKey: 'stock', header: 'Stock' },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            className={
              row.original.isActive === false
                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                : undefined
            }
          >
            {row.original.isActive === false ? 'Inactive' : 'Active'}
          </Badge>
        ),
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
              aria-label={`Remove ${row.original.name}`}
              size="sm"
              variant="ghost"
              onClick={() => setDeletingProduct(row.original)}
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
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Your products</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add, update, or remove listings from your seller catalog.
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={openCreateForm}>
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      {isLoading ? <Loader label="Loading your products..." /> : null}
      {error ? (
        <ErrorState
          description="We could not load your product listings."
          title="Failed to load products"
        />
      ) : null}

      {!isLoading && !error && products.length === 0 ? (
        <EmptyState
          description="Create your first listing to start selling on NexCart."
          title="No products yet"
        />
      ) : null}

      {!isLoading && !error && products.length > 0 ? (
        <>
          <div className="hidden md:block">
            <DataTable columns={columns} data={products} />
          </div>

          <div className="grid gap-4 md:hidden">
            {products.map((product) => (
              <Card key={product.id} className="space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    alt=""
                    className="size-16 shrink-0 rounded-2xl object-cover"
                    src={getProductImage(product)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-950 dark:text-white">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {product.category?.name ?? 'Uncategorized'}
                        </p>
                      </div>
                      <Badge
                        className={
                          product.isActive === false
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            : undefined
                        }
                      >
                        {product.isActive === false ? 'Inactive' : 'Active'}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => openEditForm(product)}>
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeletingProduct(product)}>
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      <Modal
        isOpen={formMode !== null}
        title={formMode === 'create' ? 'Add product' : 'Edit product'}
        onClose={closeForm}
      >
        <ProductForm
          key={editingProduct?.id ?? 'create'}
          categories={categories}
          defaultValues={editingProduct ? toFormValues(editingProduct) : undefined}
          isLoading={isSaving}
          mode={formMode === 'edit' ? 'edit' : 'create'}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        isOpen={deletingProduct !== null}
        title="Remove product"
        onClose={() => setDeletingProduct(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Remove <strong>{deletingProduct?.name}</strong> from your catalog? It will be hidden
            from shoppers but order history is preserved.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              className="sm:w-auto"
              variant="outline"
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              className="sm:w-auto"
              disabled={deleteState.isLoading}
              variant="danger"
              onClick={handleDelete}
            >
              {deleteState.isLoading ? 'Removing...' : 'Remove product'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
