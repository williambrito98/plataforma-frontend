import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AutomationParameter } from "@/features/automations/types/automation";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type FieldErrorItem = { message?: string } | undefined;

function asFieldError(error: unknown): FieldErrorItem {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? { message } : undefined;
  }

  return undefined;
}

type DynamicAutomationFieldProps<T extends FieldValues> = {
  parameter: AutomationParameter;
  control: Control<T>;
  errors?: FieldErrors<T>;
};

export function DynamicAutomationField<T extends FieldValues>({
  parameter,
  control,
  errors,
}: DynamicAutomationFieldProps<T>) {
  const fieldError = errors?.[parameter.name as keyof T];
  const startError = errors?.[`${parameter.name}_start` as keyof T];
  const endError = errors?.[`${parameter.name}_end` as keyof T];

  switch (parameter.type) {
    case "textarea":
      return (
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor={parameter.name}>{parameter.label}</FieldLabel>
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <Textarea
                id={parameter.name}
                placeholder={parameter.placeholder}
                className="min-h-20 border-border bg-secondary shadow-none"
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={!!fieldError}
              />
            )}
          />
          <FieldError errors={[asFieldError(fieldError)]} />
        </Field>
      );

    case "select":
      return (
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor={parameter.name}>{parameter.label}</FieldLabel>
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || null}
                items={(parameter.options ?? []).map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onValueChange={(value) => field.onChange(value ?? "")}
              >
                <SelectTrigger
                  id={parameter.name}
                  size="sm"
                  className="w-full border-border bg-secondary shadow-none"
                  aria-invalid={!!fieldError}
                >
                  <SelectValue
                    placeholder={parameter.placeholder ?? "Selecione"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(parameter.options ?? []).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[asFieldError(fieldError)]} />
        </Field>
      );

    case "checkbox":
      return (
        <Field orientation="vertical" className="gap-2">
          <div className="flex items-center gap-2">
            <Controller
              name={parameter.name as never}
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={parameter.name}
                  checked={field.value === true}
                  onCheckedChange={field.onChange}
                  aria-invalid={!!fieldError}
                />
              )}
            />
            <Label htmlFor={parameter.name} className="cursor-pointer">
              {parameter.label}
            </Label>
          </div>
          {parameter.placeholder ? (
            <FieldDescription>{parameter.placeholder}</FieldDescription>
          ) : null}
          <FieldError errors={[asFieldError(fieldError)]} />
        </Field>
      );

    case "date-range":
      return (
        <Field orientation="vertical" className="gap-2">
          <FieldLabel>{parameter.label}</FieldLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Controller
              name={`${parameter.name}_start` as never}
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  aria-label={`${parameter.label} — início`}
                  className={inputClassName}
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={!!startError}
                />
              )}
            />
            <Controller
              name={`${parameter.name}_end` as never}
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  aria-label={`${parameter.label} — fim`}
                  className={inputClassName}
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={!!endError}
                />
              )}
            />
          </div>
          <FieldError
            errors={[asFieldError(startError), asFieldError(endError)]}
          />
        </Field>
      );

    case "file":
      return (
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor={parameter.name}>{parameter.label}</FieldLabel>
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <Input
                id={parameter.name}
                type="file"
                className={inputClassName}
                onChange={(event) => onChange(event.target.files)}
                onBlur={onBlur}
                name={name}
                ref={ref}
                aria-invalid={!!fieldError}
              />
            )}
          />
          <FieldError errors={[asFieldError(fieldError)]} />
        </Field>
      );

    case "date":
      return (
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor={parameter.name}>{parameter.label}</FieldLabel>
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <Input
                id={parameter.name}
                type="date"
                className={inputClassName}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={!!fieldError}
              />
            )}
          />
          <FieldError errors={[asFieldError(fieldError)]} />
        </Field>
      );

    case "number":
    case "email":
    case "password":
    case "text":
    default:
      return (
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor={parameter.name}>{parameter.label}</FieldLabel>
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <Input
                id={parameter.name}
                type={parameter.type === "text" ? "text" : parameter.type}
                placeholder={parameter.placeholder}
                className={inputClassName}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={!!fieldError}
              />
            )}
          />
          <FieldError errors={[asFieldError(fieldError)]} />
        </Field>
      );
  }
}
