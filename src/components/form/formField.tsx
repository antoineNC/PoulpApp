import React from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import {
  ControlFieldProps,
  FormFieldProps,
  getFieldInput,
  getFieldProps,
} from "utils/formUtils";

type FormFieldType<T extends FieldValues> = FormFieldProps &
  ControlFieldProps<T>;

function FormField<T extends FieldValues>(props: FormFieldType<T>) {
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

export default FormField;
