import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { InputModeOptions } from "react-native";

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "image"
  | "date"
  | "chip"
  | "select"
  | "double-select";

export type FormFieldOptions = {
  multiline?: boolean; // text
  inputMode?: InputModeOptions; // text
  secureText?: boolean; // text
  autoCap?: "none" | "sentences" | "words" | "characters";
  confirm?: boolean; // text
  rules?: string[]; // text, date
  allDay?: boolean; // date
  choices?: { value: string; label: string }[];
  add?: boolean; // text, select, double-select
};

export type FieldParams<T> = {
  name: keyof T;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: FormFieldOptions;
};

export type InputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  label: string;
  index: number;
  lastInput: boolean;
  setFocus: (state: number) => void;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  options?: FormFieldOptions;
};

export type SelectInputProps<T extends FieldValues> = InputProps<T> & {
  type: FormFieldType;
};

export type CustomFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  type: FormFieldType;
  label: string;
  index: number;
  lastInput: boolean;
  setFocus: (state: number) => void;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  options?: FormFieldOptions;
  required?: boolean;
  repeat?: string;
};
