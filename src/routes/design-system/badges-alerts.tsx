import { createFileRoute } from "@tanstack/react-router";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alertToast } from "@/components/ui/sonner";

export const Route = createFileRoute("/design-system/badges-alerts")({
  component: RouteComponent,
});

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <h6>{title}</h6>
    <div className="flex flex-wrap gap-3">{children}</div>
  </section>
);

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1>08 · Badges & Alerts</h1>
        <p className="text-base text-muted-foreground">
          Badge de categoria: fundo/texto neutros + dot na cor da categoria (tom
          600). Badge semântico: fundo tingido + texto forte.
        </p>
      </div>

      <Section title="Categorias (dot)">
        <Badge variant="category" category="fiscal">
          Fiscal
        </Badge>
        <Badge variant="category" category="pessoal">
          Pessoal
        </Badge>
        <Badge variant="category" category="contabil">
          Contábil
        </Badge>
        <Badge variant="category" category="trabalhista">
          Trabalhista
        </Badge>
      </Section>

      <Section title="Semânticos (status)">
        <Badge variant="success">Concluído</Badge>
        <Badge variant="warning">Atenção</Badge>
        <Badge variant="error">Erro</Badge>
        <Badge variant="info">Info</Badge>
      </Section>

      <Section title="Alertas">
        <div className="flex w-full max-w-[560px] flex-col gap-2.5">
          <Alert
            variant="success"
            title="Automação concluída com sucesso"
            description="Todos os 42 registros foram processados sem erros."
          />
          <Alert
            variant="warning"
            title="Atenção: revise antes de continuar"
            description="Há 3 itens pendentes de validação manual nesta execução."
          />
          <Alert
            variant="error"
            title="Falha ao processar automação"
            description="Não foi possível conectar ao serviço externo. Tente novamente."
          />
          <Alert
            variant="info"
            title="Nova versão disponível"
            description="Atualize o fluxo para usar os novos campos de integração."
          />
        </div>
      </Section>

      <Section title="Alertas (Sonner)">
        <Button
          variant="outline"
          onClick={() =>
            alertToast.success(
              "Automação concluída com sucesso",
              "Todos os 42 registros foram processados sem erros.",
            )
          }
        >
          Success toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            alertToast.warning(
              "Atenção: revise antes de continuar",
              "Há 3 itens pendentes de validação manual nesta execução.",
            )
          }
        >
          Warning toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            alertToast.error(
              "Falha ao processar automação",
              "Não foi possível conectar ao serviço externo. Tente novamente.",
            )
          }
        >
          Error toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            alertToast.info(
              "Nova versão disponível",
              "Atualize o fluxo para usar os novos campos de integração.",
            )
          }
        >
          Info toast
        </Button>
      </Section>
    </div>
  );
}
