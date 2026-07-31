import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-3xl font-bold underline bg-amber-400">Hello "/"!</div>
  );
}
