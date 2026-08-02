import { cn } from "@/lib/utils";

const selectClassName =
  "h-8 w-full rounded-md border border-border bg-secondary px-3 text-sm shadow-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

type NativeSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function NativeSelect({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  children,
}: NativeSelectProps) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        selectClassName,
        !value && "text-muted-foreground",
        className,
      )}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {children}
    </select>
  );
}
