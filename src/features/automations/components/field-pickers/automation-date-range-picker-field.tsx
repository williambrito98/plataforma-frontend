import { AutomationDatePickerField } from "@/features/automations/components/field-pickers/automation-date-picker-field";
import type { AutomationParameter } from "@/features/automations/types/automation";

type AutomationDateRangePickerFieldProps = {
  parameter: AutomationParameter;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onStartBlur?: () => void;
  onEndBlur?: () => void;
  startInvalid?: boolean;
  endInvalid?: boolean;
};

export function AutomationDateRangePickerField({
  parameter,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onStartBlur,
  onEndBlur,
  startInvalid,
  endInvalid,
}: AutomationDateRangePickerFieldProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <AutomationDatePickerField
        id={`${parameter.name}_start`}
        value={startValue}
        onChange={onStartChange}
        onBlur={onStartBlur}
        placeholder="Data inicial"
        format={parameter.format}
        invalid={startInvalid}
      />
      <AutomationDatePickerField
        id={`${parameter.name}_end`}
        value={endValue}
        onChange={onEndChange}
        onBlur={onEndBlur}
        placeholder="Data final"
        format={parameter.format}
        invalid={endInvalid}
      />
    </div>
  );
}
