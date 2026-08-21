import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
} from "react-hook-form";
import type { ReactNode } from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AutomationDatePickerField,
  AutomationDateRangePickerField,
  AutomationDateTimePickerField,
  AutomationMonthPickerField,
  AutomationTimePickerField,
} from "@/features/automations/components/field-pickers";
import { pickerTriggerClassName } from "@/features/automations/components/field-pickers/picker-trigger";
import type { AutomationParameter } from "@/features/automations/types/automation";
import { downloadTemplateFile } from "@/features/automations/utils/build-template-download-url";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

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

function buildFileAccept(extensions?: string[]): string | undefined {
  if (!extensions?.length) {
    return undefined;
  }

  return extensions
    .map((extension) =>
      extension.startsWith(".") ? extension : `.${extension}`,
    )
    .join(",");
}

function getMultiselectLabels(
  parameter: AutomationParameter,
  values: string[],
): string {
  const labels = (parameter.options ?? [])
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);

  return labels.length > 0 ? labels.join(", ") : values.join(", ");
}

type AutomationFieldShellProps = {
  id?: string;
  label: string;
  error?: unknown;
  description?: string;
  children: ReactNode;
};

function AutomationFieldShell({
  id,
  label,
  error,
  description,
  children,
}: AutomationFieldShellProps) {
  return (
    <Field orientation="vertical" className="gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={[asFieldError(error)]} />
    </Field>
  );
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
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <Textarea
                id={parameter.name}
                placeholder={parameter.placeholder}
                rows={parameter.rows ?? 4}
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
        </AutomationFieldShell>
      );

    case "select":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
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
        </AutomationFieldShell>
      );

    case "multiselect":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => {
              const selectedValues = Array.isArray(field.value)
                ? (field.value as string[])
                : [];
              const displayValue = getMultiselectLabels(
                parameter,
                selectedValues,
              );

              function toggleValue(optionValue: string) {
                const nextValues = selectedValues.includes(optionValue)
                  ? selectedValues.filter((value) => value !== optionValue)
                  : [...selectedValues, optionValue];
                field.onChange(nextValues);
              }

              return (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        id={parameter.name}
                        type="button"
                        variant="outline"
                        aria-invalid={!!fieldError}
                        className={cn(
                          pickerTriggerClassName,
                          !displayValue && "text-muted-foreground",
                        )}
                      >
                        <span className="truncate">
                          {displayValue ||
                            parameter.placeholder ||
                            "Selecione uma ou mais opções"}
                        </span>
                        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
                      </Button>
                    }
                  />
                  <PopoverContent
                    className="w-(--anchor-width) p-2"
                    align="start"
                  >
                    <div className="grid gap-2">
                      {(parameter.options ?? []).map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`${parameter.name}-${option.value}`}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                        >
                          <Checkbox
                            id={`${parameter.name}-${option.value}`}
                            checked={selectedValues.includes(option.value)}
                            onCheckedChange={() => toggleValue(option.value)}
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </AutomationFieldShell>
      );

    case "radio":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={String(field.value ?? "")}
                onValueChange={field.onChange}
                className="gap-2"
              >
                {(parameter.options ?? []).map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`${parameter.name}-${option.value}`}
                      aria-invalid={!!fieldError}
                    />
                    <Label
                      htmlFor={`${parameter.name}-${option.value}`}
                      className="cursor-pointer font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </AutomationFieldShell>
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
          <Controller
            name={`${parameter.name}_start` as never}
            control={control}
            render={({ field: startField }) => (
              <Controller
                name={`${parameter.name}_end` as never}
                control={control}
                render={({ field: endField }) => (
                  <AutomationDateRangePickerField
                    parameter={parameter}
                    startValue={String(startField.value ?? "")}
                    endValue={String(endField.value ?? "")}
                    onStartChange={startField.onChange}
                    onEndChange={endField.onChange}
                    onStartBlur={startField.onBlur}
                    onEndBlur={endField.onBlur}
                    startInvalid={!!startError}
                    endInvalid={!!endError}
                  />
                )}
              />
            )}
          />
          <FieldError
            errors={[asFieldError(startError), asFieldError(endError)]}
          />
        </Field>
      );

    case "file":
      return (
        <Field orientation="vertical" className="gap-2">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor={parameter.name}>{parameter.label}</FieldLabel>
            {parameter.templateFile ? (
              <button
                type="button"
                onClick={() =>
                  downloadTemplateFile(parameter.templateFile!.token)
                }
                className="shrink-0 text-xs text-primary hover:underline"
              >
                Baixar modelo
              </button>
            ) : null}
          </div>
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <Input
                id={parameter.name}
                type="file"
                className={inputClassName}
                accept={buildFileAccept(parameter.extensions)}
                multiple={parameter.multiple === true}
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
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <AutomationDatePickerField
                id={parameter.name}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={parameter.placeholder}
                format={parameter.format}
                invalid={!!fieldError}
              />
            )}
          />
        </AutomationFieldShell>
      );

    case "time":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <AutomationTimePickerField
                id={parameter.name}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={parameter.placeholder}
                format={parameter.format}
                step={parameter.step}
                invalid={!!fieldError}
              />
            )}
          />
        </AutomationFieldShell>
      );

    case "datetime-local":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <AutomationDateTimePickerField
                id={parameter.name}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={parameter.placeholder}
                format={parameter.format}
                invalid={!!fieldError}
              />
            )}
          />
        </AutomationFieldShell>
      );

    case "month":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <AutomationMonthPickerField
                id={parameter.name}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={parameter.placeholder}
                format={parameter.format}
                invalid={!!fieldError}
              />
            )}
          />
        </AutomationFieldShell>
      );

    case "number":
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
          <Controller
            name={parameter.name as never}
            control={control}
            render={({ field }) => (
              <Input
                id={parameter.name}
                type="number"
                placeholder={parameter.placeholder}
                className={inputClassName}
                min={parameter.min}
                max={parameter.max}
                step={parameter.step ?? 1}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={!!fieldError}
              />
            )}
          />
        </AutomationFieldShell>
      );

    case "email":
    case "password":
    case "tel":
    case "url":
    case "search":
    case "text":
    default:
      return (
        <AutomationFieldShell
          id={parameter.name}
          label={parameter.label}
          error={fieldError}
        >
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
        </AutomationFieldShell>
      );
  }
}
