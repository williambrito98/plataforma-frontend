import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileRole } from "@/features/profile/types/profile";
import { getProfileExplanation } from "@/features/profile/utils/get-profile-explanation";

type ProfileRoleCardProps = {
  role?: ProfileRole;
  permissions: string[];
};

export function ProfileRoleCard({ role, permissions }: ProfileRoleCardProps) {
  const explanation = getProfileExplanation(role, permissions);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <ShieldCheck className="size-4" aria-hidden />
          Papel e permissões
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row">
        <div className="w-32 shrink-0 space-y-2">
          <p className="text-sm font-medium text-foreground">Papel</p>
          <div className="flex flex-wrap gap-2">
            {role ? (
              <Badge variant="success">{role.name}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">
                Nenhum papel associado.
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">
            O que seu acesso permite
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
