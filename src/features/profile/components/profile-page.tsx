import { useState } from "react";

import { alertToast } from "@/components/ui/sonner";
import { ProfileAvatarSection } from "@/features/profile/components/profile-avatar-section";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ProfileRoleCard } from "@/features/profile/components/profile-role-card";
import { mockProfileUser } from "@/features/profile/data/mock-profile-user";
import type { ProfileFormValues } from "@/features/profile/schemas/profile-schema";
import type { ProfileUser } from "@/features/profile/types/profile";

export function ProfilePage() {
  const [user, setUser] = useState<ProfileUser>(mockProfileUser);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(values: ProfileFormValues) {
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setUser((current) => ({
      ...current,
      name: values.name,
    }));

    setIsSaving(false);
    alertToast.success("Perfil atualizado", "Suas alterações foram salvas.");
  }

  function handleAvatarChange(avatarUrl: string) {
    setUser((current) => ({
      ...current,
      avatar: avatarUrl,
    }));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <ProfileAvatarSection
          name={user.name}
          avatar={user.avatar}
          isUploading={isUploading}
          onAvatarChange={handleAvatarChange}
          onUploadStart={() => setIsUploading(true)}
          onUploadEnd={() => setIsUploading(false)}
        />

        <ProfileForm
          defaultValues={{
            name: user.name,
            email: user.email,
            company: user.company,
            password: "",
          }}
          isSaving={isSaving}
          onSubmit={handleSubmit}
        />
      </div>

      <ProfileRoleCard role={user.role} permissions={user.permissions} />
    </div>
  );
}
