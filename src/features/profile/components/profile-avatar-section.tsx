import { useRef, useState } from "react";
import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { alertToast } from "@/components/ui/sonner";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"] as const;

type ProfileAvatarSectionProps = {
  name: string;
  avatar?: string;
  onPhotoUpload: (file: File) => Promise<void>;
};

export function ProfileAvatarSection({
  name,
  avatar,
  onPhotoUpload,
}: ProfileAvatarSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  function handlePickPhoto() {
    fileInputRef.current?.click();
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        file.type as (typeof ACCEPTED_IMAGE_TYPES)[number],
      )
    ) {
      alertToast.error("Formato inválido", "Envie PNG ou JPEG.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      await onPhotoUpload(file);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="group relative inline-block size-48 cursor-pointer xl:size-64"
        onClick={handlePickPhoto}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handlePickPhoto();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Escolher foto de perfil"
      >
        <Avatar className="size-full rounded-md after:rounded-md">
          {avatar ? (
            <AvatarImage
              src={avatar}
              alt={name}
              className="rounded-md object-cover"
            />
          ) : null}
          <AvatarFallback className="rounded-md bg-muted">
            <User className="size-24 text-muted-foreground" aria-hidden />
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 transition-colors group-hover:bg-black/50">
          <span className="text-sm text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {isUploading ? "Enviando..." : "Escolher foto"}
          </span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handlePhotoChange}
      />

      <Button
        variant="link"
        type="button"
        className="mt-2 inline-block w-48 text-center text-sm xl:w-64"
        onClick={handlePickPhoto}
        disabled={isUploading}
      >
        {isUploading ? "Enviando foto..." : "Escolher foto"}
      </Button>
    </div>
  );
}
