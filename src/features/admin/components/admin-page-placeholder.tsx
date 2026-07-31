type AdminPagePlaceholderProps = {
  title: string;
};

export function AdminPagePlaceholder({ title }: AdminPagePlaceholderProps) {
  return (
    <div className="flex min-h-50 items-center justify-center rounded-xl border border-dashed border-border bg-card p-12">
      <p className="text-lg font-medium text-muted-foreground">{title}</p>
    </div>
  );
}
