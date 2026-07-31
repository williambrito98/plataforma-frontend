import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, LayersPlus, MoveRight, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/design-system/button")({
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
    <div className="flex flex-wrap gap-6">{children}</div>
  </section>
);

const Swatch = ({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) => (
  <div className="flex w-40 flex-col items-center gap-2">
    <div className="flex h-12 items-center justify-center">{children}</div>
    <p className="text-center text-xs text-muted-foreground">{caption}</p>
  </div>
);

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1.5">
        <h1>05 · Button</h1>
        <p className="text-base text-muted-foreground">
          rounded-lg · text-sm font-medium · items-center justify-center · svg
          size-4
        </p>
      </div>

      <Section title="Variantes">
        <Swatch caption="default · bg-primary">
          <Button>Button</Button>
        </Swatch>
        <Swatch caption="secondary · bg-secondary">
          <Button variant="secondary">Button</Button>
        </Swatch>
        <Swatch caption="destructive">
          <Button variant="destructive">Button</Button>
        </Swatch>
        <Swatch caption="outline · border + shadow-xs">
          <Button variant="outline">Button</Button>
        </Swatch>
        <Swatch caption="ghost · sem fundo/borda">
          <Button variant="ghost">Button</Button>
        </Swatch>
        <Swatch caption="link · text-primary">
          <Button variant="link">Button</Button>
        </Swatch>
      </Section>

      <Section title="Tamanhos">
        <Swatch caption="xs · h-6 px-2 text-xs">
          <Button variant="outline" size="xs">
            Extra Small
          </Button>
        </Swatch>
        <Swatch caption="sm · h-8 px-3 gap-1.5">
          <Button variant="outline" size="sm">
            Small
          </Button>
        </Swatch>
        <Swatch caption="default · h-9 px-4 py-2">
          <Button variant="outline">Default</Button>
        </Swatch>
        <Swatch caption="lg · h-10 px-6">
          <Button variant="outline" size="lg">
            Large
          </Button>
        </Swatch>
        <Swatch caption="icon-xs · size-6 · svg 12">
          <Button variant="outline" size="icon-xs" aria-label="Subir">
            <ArrowUp />
          </Button>
        </Swatch>
        <Swatch caption="icon-sm · size-8 · svg 14">
          <Button variant="outline" size="icon-sm" aria-label="Subir">
            <ArrowUp />
          </Button>
        </Swatch>
        <Swatch caption="icon · size-9 · svg 16">
          <Button variant="outline" size="icon" aria-label="Subir">
            <ArrowUp />
          </Button>
        </Swatch>
        <Swatch caption="icon-lg · size-10 · svg 20">
          <Button variant="outline" size="icon-lg" aria-label="Subir">
            <ArrowUp />
          </Button>
        </Swatch>
      </Section>

      <Section title="Estados">
        <Swatch caption="default">
          <Button>Button</Button>
        </Swatch>
        <Swatch caption="hover · bg-primary/90">
          <Button className="bg-primary/90">Button</Button>
        </Swatch>
        <Swatch caption="focus-visible · ring-[3px] ring/50">
          <Button className="border-ring ring-3 ring-ring/50">Button</Button>
        </Swatch>
        <Swatch caption="disabled · opacity-50">
          <Button disabled>Button</Button>
        </Swatch>
        <Swatch caption="loading · disabled + Spinner">
          <Button loading>Submit</Button>
        </Swatch>
      </Section>

      <Section title="Hover por variante">
        <Swatch caption="default · /90">
          <Button className="bg-primary/90">Button</Button>
        </Swatch>
        <Swatch caption="secondary · bg-accent">
          <Button variant="secondary" className="bg-accent">
            Button
          </Button>
        </Swatch>
        <Swatch caption="destructive · /90">
          <Button variant="destructive" className="bg-destructive/90">
            Button
          </Button>
        </Swatch>
        <Swatch caption="outline · bg-muted">
          <Button variant="outline" className="bg-muted">
            Button
          </Button>
        </Swatch>
        <Swatch caption="ghost · bg-muted">
          <Button variant="ghost" className="bg-muted">
            Button
          </Button>
        </Swatch>
        <Swatch caption="link · underline">
          <Button variant="link" className="underline">
            Button
          </Button>
        </Swatch>
      </Section>

      <Section title="Uso com ícone">
        <Swatch caption="leading · has-[>svg]:px-3">
          <Button>
            <LayersPlus />
            Novo
          </Button>
        </Swatch>
        <Swatch caption="trailing · gap-2">
          <Button variant="outline">
            Continuar
            <MoveRight />
          </Button>
        </Swatch>
        <Swatch caption="destructive + ícone">
          <Button variant="destructive">
            <Trash />
            Excluir
          </Button>
        </Swatch>
        <Swatch caption="sm · has-[>svg]:px-2.5">
          <Button variant="outline" size="sm">
            <Plus />
            Adicionar
          </Button>
        </Swatch>
        <Swatch caption="xs · has-[>svg]:px-1.5 · svg 12">
          <Button variant="outline" size="xs">
            <Plus />
            Adicionar
          </Button>
        </Swatch>
        <Swatch caption="icon-only · ghost">
          <Button variant="ghost" size="icon" aria-label="Adicionar">
            <Plus />
          </Button>
        </Swatch>
      </Section>
    </div>
  );
}
