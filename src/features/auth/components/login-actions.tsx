import { Button } from "@/components/ui/button";

type LoginActionsProps = {
  loading?: boolean;
};

export function LoginActions({ loading = false }: LoginActionsProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <button type="button" className="text-sm leading-5 text-[#737373]">
        Esqueci minha senha
      </button>
      <Button size="sm" type="submit" loading={loading} disabled={loading}>
        Entrar
      </Button>
    </div>
  );
}
