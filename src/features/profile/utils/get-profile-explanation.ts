import type { ProfileRole } from "@/features/profile/types/profile";

export function getProfileExplanation(
  role: ProfileRole | null | undefined,
  permissions: string[],
): string {
  if (!role) {
    return "Seu acesso atual é definido pelas permissões listadas abaixo.";
  }

  if (role.name === "Admin") {
    return "Você possui acesso administrativo completo à plataforma, incluindo gestão de papéis, permissões, execuções, arquivos e demais operações.";
  }

  if (permissions.length > 1) {
    return `Seus papéis combinam permissões para ${permissions.join(", ")}. O que você pode fazer na plataforma é a união dessas capacidades.`;
  }

  if (role.name === "Operador") {
    return "Você pode operar automações, acompanhar execuções e trabalhar com arquivos vinculados ao seu fluxo operacional.";
  }

  if (role.name === "Cliente") {
    return "Você pode acompanhar execuções, visualizar arquivos disponíveis e consumir os eventos liberados para o seu perfil.";
  }

  if (role.name === "Contador") {
    return "Você pode criar automações, operar execuções, operar arquivos disponíveis e consumir os eventos liberados para o seu perfil.";
  }

  return "Seu acesso atual é definido pelas permissões listadas abaixo.";
}
