import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/use-session";
import type { UserRole } from "@/features/auth/types/auth";
import { ProfileAvatarSection } from "@/features/profile/components/profile-avatar-section";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ProfileRoleCard } from "@/features/profile/components/profile-role-card";
import { useUpdateProfile } from "@/features/profile/hooks/use-update-profile";
import type { ProfileFormValues } from "@/features/profile/schemas/profile-schema";
import type { ProfileRole } from "@/features/profile/types/profile";

function ProfilePageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <Skeleton className="size-48 rounded-md xl:size-64" />
        <div className="mt-4 w-full flex-1 space-y-6 lg:mt-0 lg:w-96">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
    </div>
  );
}

function mapRole(role: UserRole | undefined): ProfileRole | undefined {
  if (!role) {
    return undefined;
  }

  return {
    id: String(role.id),
    name: role.name,
    description: role.description ?? null,
  };
}

export function ProfilePage() {
  const { user, isLoading } = useSession();
  const updateProfile = useUpdateProfile();

  if (isLoading || !user) {
    return <ProfilePageSkeleton />;
  }

  const currentUser = user;
  const avatar = currentUser.avatar ?? undefined;

  async function handleSubmit(values: ProfileFormValues) {
    await updateProfile.mutateAsync({
      userId: currentUser.id,
      name: values.name,
      ...(values.password ? { password: values.password } : {}),
    });
  }

  async function handlePhotoUpload(file: File) {
    await updateProfile.mutateAsync({
      userId: currentUser.id,
      photo: file,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <ProfileAvatarSection
          name={currentUser.name}
          avatar={avatar}
          onPhotoUpload={handlePhotoUpload}
        />

        <ProfileForm
          key={currentUser.updatedAt ?? currentUser.id}
          defaultValues={{
            name: currentUser.name,
            email: currentUser.email,
            company: "",
            password: "",
          }}
          isSaving={updateProfile.isPending && !updateProfile.variables?.photo}
          onSubmit={handleSubmit}
        />
      </div>

      <ProfileRoleCard
        role={mapRole(currentUser.role)}
        permissions={currentUser.permissions ?? []}
      />
    </div>
  );
}
