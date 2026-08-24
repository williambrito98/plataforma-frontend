import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { alertToast } from "@/components/ui/sonner";
import { listSpreadsheetSheets } from "@/features/automations/api/list-spreadsheet-sheets";
import { validateSpreadsheetHeader } from "@/features/automations/api/validate-spreadsheet-header";
import { DynamicAutomationField } from "@/features/automations/components/dynamic-automation-field";
import {
  buildParameterDefaultValues,
  buildParametersSchema,
  buildSheetNameParameter,
  normalizeParameterValues,
} from "@/features/automations/schemas/automation-parameters-schema";
import type {
  AutomationParameter,
  AutomationParameterOption,
} from "@/features/automations/types/automation";
import { buildExecutionFormData } from "@/features/automations/utils/build-execution-form-data";
import {
  fieldAcceptsSpreadsheet,
  getSpreadsheetFileFromValue,
  isSpreadsheetFile,
} from "@/features/automations/utils/spreadsheet-file";

export type AutomationStartPayload = {
  formData: FormData;
  displayValues: Record<string, string>;
};

type AutomationIdleFormProps = {
  fields: AutomationParameter[];
  isSubmitting?: boolean;
  onStart: (payload: AutomationStartPayload) => void;
};

function toSheetOptions(sheets: string[]): AutomationParameterOption[] {
  return sheets.map((sheet) => ({
    value: sheet,
    label: sheet,
  }));
}

function buildEffectiveFields(
  fields: AutomationParameter[],
  sheetOptions: AutomationParameterOption[],
): AutomationParameter[] {
  if (sheetOptions.length === 0) {
    return fields;
  }

  const sheetNameParameter = buildSheetNameParameter(sheetOptions);
  const fileFieldIndex = fields.findIndex(
    (field) =>
      field.type === "file" && fieldAcceptsSpreadsheet(field.extensions),
  );

  if (fileFieldIndex === -1) {
    return [...fields, sheetNameParameter];
  }

  const nextFields = [...fields];
  nextFields.splice(fileFieldIndex + 1, 0, sheetNameParameter);
  return nextFields;
}

export function AutomationIdleForm({
  fields,
  isSubmitting = false,
  onStart,
}: AutomationIdleFormProps) {
  const filteredFields = useMemo(
    () => fields.filter((field) => field.name !== "sheetName"),
    [fields],
  );

  const spreadsheetFileFields = useMemo(
    () =>
      filteredFields.filter(
        (field) =>
          field.type === "file" && fieldAcceptsSpreadsheet(field.extensions),
      ),
    [filteredFields],
  );

  const [sheetOptions, setSheetOptions] = useState<AutomationParameterOption[]>(
    [],
  );
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const requestIdRef = useRef(0);

  const extraParameters = useMemo(
    () =>
      sheetOptions.length > 0 ? [buildSheetNameParameter(sheetOptions)] : [],
    [sheetOptions],
  );

  const effectiveFields = useMemo(
    () => buildEffectiveFields(filteredFields, sheetOptions),
    [filteredFields, sheetOptions],
  );

  const schema = useMemo(
    () => buildParametersSchema(filteredFields, extraParameters),
    [filteredFields, extraParameters],
  );

  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const defaultValues = useMemo(
    () => buildParameterDefaultValues(filteredFields, extraParameters),
    [filteredFields, extraParameters],
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitted, errors },
  } = useForm({
    resolver: async (values, context, options) =>
      zodResolver(schemaRef.current)(values, context, options),
    defaultValues,
    mode: "onSubmit",
  });

  const watchedFileValues = useWatch({
    control,
    name: spreadsheetFileFields.map((field) => field.name) as never[],
  });

  const loadSpreadsheetSheets = useCallback(
    async (file: File, parameter: AutomationParameter) => {
      const requestId = ++requestIdRef.current;
      setIsLoadingSheets(true);
      setSheetOptions([]);
      setValue("sheetName", "", { shouldValidate: false });

      try {
        const sheets = await listSpreadsheetSheets(file);

        if (requestId !== requestIdRef.current) {
          return;
        }

        const expectedHeader = parameter.templateFile?.fileHeader;

        if (expectedHeader?.length && sheets.length <= 2) {
          await validateSpreadsheetHeader(file, expectedHeader, {
            csvDelimiter: parameter.templateFile?.csvDelimiter,
          });

          if (requestId !== requestIdRef.current) {
            return;
          }
        }

        const options = toSheetOptions(sheets);
        setSheetOptions(options);

        if (options.length === 1) {
          setValue("sheetName", options[0]?.value ?? "", {
            shouldValidate: false,
          });
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setSheetOptions([]);
        setValue("sheetName", "", { shouldValidate: false });

        const isHeaderError =
          error instanceof Error &&
          error.message.includes("não está no formato correto");

        if (isHeaderError) {
          setValue(parameter.name, undefined, { shouldValidate: false });
          alertToast.error(
            "Arquivo inválido",
            error instanceof Error ? error.message : undefined,
          );
          return;
        }

        alertToast.error(
          "Falha ao identificar abas",
          error instanceof Error ? error.message : undefined,
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoadingSheets(false);
        }
      }
    },
    [setValue],
  );

  const handleSpreadsheetFileChange = useCallback(
    (parameter: AutomationParameter) => (file: File | null) => {
      if (!file || !isSpreadsheetFile(file)) {
        requestIdRef.current += 1;
        setIsLoadingSheets(false);
        setSheetOptions([]);
        setValue("sheetName", "", { shouldValidate: false });
        return;
      }

      void loadSpreadsheetSheets(file, parameter);
    },
    [loadSpreadsheetSheets, setValue],
  );

  useEffect(() => {
    if (spreadsheetFileFields.length === 0) {
      return;
    }

    const values = Array.isArray(watchedFileValues)
      ? watchedFileValues
      : [watchedFileValues];
    const spreadsheetFile = values
      .map((value) => getSpreadsheetFileFromValue(value))
      .find((file): file is File => file !== null && isSpreadsheetFile(file));

    if (!spreadsheetFile) {
      requestIdRef.current += 1;
      setIsLoadingSheets(false);
      setSheetOptions([]);
      setValue("sheetName", "", { shouldValidate: false });
    }
  }, [spreadsheetFileFields.length, setValue, watchedFileValues]);

  function handleStart(values: Record<string, unknown>) {
    const formData = buildExecutionFormData(effectiveFields, values);
    const displayValues = normalizeParameterValues(effectiveFields, values);

    onStart({ formData, displayValues });
  }

  return (
    <form
      className="w-112 mx-auto space-y-6"
      onSubmit={handleSubmit(handleStart)}
    >
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground">
          Preencha os dados para iniciar
        </h4>
        <p className="text-sm text-muted-foreground">
          Informe os parâmetros necessários antes de executar a automação
        </p>
      </div>

      <div className="grid gap-4">
        {effectiveFields.map((parameter) => (
          <DynamicAutomationField
            key={parameter.id}
            parameter={parameter}
            control={control}
            errors={errors}
            showValidationErrors={isSubmitted}
            onSpreadsheetFileChange={
              parameter.type === "file" &&
              fieldAcceptsSpreadsheet(parameter.extensions)
                ? handleSpreadsheetFileChange(parameter)
                : undefined
            }
            isLoadingSheets={
              parameter.type === "file" &&
              fieldAcceptsSpreadsheet(parameter.extensions)
                ? isLoadingSheets
                : undefined
            }
          />
        ))}
      </div>

      <div className="flex">
        <Button
          type="submit"
          size="sm"
          loading={isSubmitting}
          disabled={isSubmitting || isLoadingSheets}
          className="w-full"
        >
          <Play aria-hidden />
          Iniciar
        </Button>
      </div>
    </form>
  );
}
