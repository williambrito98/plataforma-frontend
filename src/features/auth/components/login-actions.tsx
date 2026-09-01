import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

type LoginActionsProps = {
  loading?: boolean;
};

export function LoginActions({ loading = false }: LoginActionsProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <Link
        to="/recuperar-senha"
        className="text-sm leading-5 text-[#737373] hover:underline"
      >
        Esqueci minha senha
      </Link>
      <Button size="sm" type="submit" loading={loading} disabled={loading}>
        Entrar
      </Button>
    </div>
  );
}
