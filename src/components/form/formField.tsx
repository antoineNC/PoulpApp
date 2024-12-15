import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { ControlFieldProps, FormFieldProps } from "types/form.type";
import { getFieldInput, getFieldProps } from "utils/formUtils";

type FormFieldType<T extends FieldValues> = FormFieldProps &
  ControlFieldProps<T>;

function CustomField<T extends FieldValues>(props: FormFieldType<T>) {
  const {
    control,
    name,
    label,
    type,
    required,
    repeat,
    options,
    index,
    lastInput,
    setFocus,
    submit,
  } = props;
  const { newLabel, rules } = getFieldProps<T>(
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
      render={({ field, fieldState }) =>
        getFieldInput<T>({
          label: newLabel,
          type,
          options,
          index,
          lastInput,
          setFocus,
          submit,
          field,
          fieldState,
        })
      }
    />
  );
}

export default CustomField;
