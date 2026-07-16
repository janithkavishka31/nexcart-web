import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

import {
  profileFormSchema,
  type ProfileFormValues,
} from '@/features/users/profileSchemas';
import { useGetProfileQuery, useListAddressesQuery, useUpdateProfileMutation } from '@/features/users/usersApi';

import { useAppSelector } from '@/hooks/reduxHooks';

export default function ProfilePage() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: addressesData } = useListAddressesQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const profile = profileData?.data ?? authUser;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema) as unknown as Resolver<ProfileFormValues>,
    defaultValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
    },
  });

  useEffect(() => {
    if (!profile) return;

    form.reset({
      name: profile.name,
      phone: profile.phone ?? '',
    });
  }, [form, profile]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      const response = await updateProfile({
        name: values.name,
        phone: values.phone.trim() ? values.phone.trim() : null,
      }).unwrap();
      toast.success(response.message ?? 'Profile updated successfully');
    } catch {
      toast.error('Could not update profile. Check your details and try again.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Profile</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your personal details below.
            </p>
          </div>
        </div>

        {isProfileLoading && !profile ? (
          <Loader label="Loading profile..." />
        ) : (
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              label="Name"
              {...form.register('name')}
              error={form.formState.errors.name?.message}
              placeholder="Your full name"
            />
            <Input
              label="Phone"
              type="tel"
              {...form.register('phone')}
              error={form.formState.errors.phone?.message}
              placeholder="+1-555-0100"
            />
            <Input
              label="Email"
              value={profile?.email ?? ''}
              readOnly
              className="cursor-not-allowed bg-slate-50 dark:bg-slate-800/60"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Email and role can only be changed by an administrator.
            </p>
            <Input
              label="Role"
              value={profile?.role ?? ''}
              readOnly
              className="cursor-not-allowed bg-slate-50 dark:bg-slate-800/60"
            />
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                className="sm:w-auto"
                disabled={isSaving || !form.formState.isDirty}
                type="button"
                variant="outline"
                onClick={() =>
                  form.reset({
                    name: profile?.name ?? '',
                    phone: profile?.phone ?? '',
                  })
                }
              >
                Reset
              </Button>
              <Button className="sm:w-auto" disabled={isSaving || !form.formState.isDirty} type="submit">
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-bold text-slate-950 dark:text-white">Addresses</h2>
        <div className="space-y-3">
          {addressesData?.data?.length ? (
            addressesData.data.map((address) => (
              <div key={address.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <strong className="text-slate-950 dark:text-white">{address.label}</strong>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {address.line1}, {address.city}
                  {address.postalCode ? ` ${address.postalCode}` : ''}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No saved addresses yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
