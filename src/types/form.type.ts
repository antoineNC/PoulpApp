import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  ResolverOptions,
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

export type FormFieldValues<T> = {
  name: keyof T;
  label: string;
  type: FormFieldType;
  required?: boolean;
  options?: FormFieldOptions;
}[];

export type ControlFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  repeat?: string;
  type: FormFieldType;
};
export type FormFieldProps = {
  label: string;
  options?: FormFieldOptions;
  index: number;
  lastInput: boolean;
  setFocus: (state: number) => void;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export type FieldInputProps<T extends FieldValues> = FormFieldProps & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  type?: FormFieldType;
};

export type Params<T extends FieldValues> = {
  newLabel: string;
  rules?: Omit<ResolverOptions<T>, keyof FieldValues>;
};
