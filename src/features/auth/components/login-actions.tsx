import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

type LoginActionsProps = {
  loading?: boolean;
};

export function LoginActions({ loading = false }: LoginActionsProps) {
  return (
    <div className="flex w-full items-center justify-between max-sm:flex-col-reverse max-sm:items-stretch max-sm:gap-2 max-sm:text-center">
      <Link
        to="/recuperar-senha"
        className="text-sm leading-5 text-[#737373] hover:underline max-xl:py-2.5 max-xl:text-muted-foreground max-xl:underline max-xl:underline-offset-4"
      >
        Esqueci minha senha
      </Link>
      <Button
        size="sm"
        type="submit"
        loading={loading}
        disabled={loading}
        className="max-xl:h-11"
      >
        Entrar
      </Button>
    </div>
  );
}
