import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { CustomFieldProps } from "types/form.type";
import { SelectInput, getRulesAndLabel } from "utils/formUtils";

function CustomField<T extends FieldValues>(props: CustomFieldProps<T>) {
  const { control, name, label, type, required, repeat, options } = props;
  const { newLabel, rules } = getRulesAndLabel<T>(
    label,
    type,
    required,
    repeat,
    options?.rules
  );
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <SelectInput
          {...props}
          field={field}
          fieldState={fieldState}
          label={newLabel}
        />
      )}
    />
  );
}

export default CustomField;
