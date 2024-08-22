import { ReactElement } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  ResolverOptions,
} from "react-hook-form";
import { HelperText } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { FormFieldOptions, FormFieldType } from "@types";
import { Text } from "@styledComponents";
import { colors } from "@theme";
import { CODE_ENSC } from "data";
import { DateTimeFormPicker } from "components/form/dateTimePicker";
import { TextInputForm } from "components/form/textInput";
import { ChipInput } from "components/form/chipInput";
import { SelectInput } from "components/form/selectInput";

export type ControlFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  repeat?: string;
};
export type FormFieldProps = {
  label: string;
  type: FormFieldType;
  options?: FormFieldOptions;
  index: number;
  lastInput: boolean;
  setFocus: (state: number) => void;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export type FieldInputProps<T extends FieldValues> = FormFieldProps & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
};

type Params<T extends FieldValues> = {
  newLabel: string;
  rules?: Omit<ResolverOptions<T>, keyof FieldValues>;
};

const regEx_mail = /^[\w\-\.]+@ensc\.fr$/gm; // au lieu peut-etre faire un tooltip pour expliquer
const regEx_name = /^[a-z '-]+$/i;
const errorTxt = {
  required: "Ce champs est obligatoire",
  invalidMail: "L'email est invalide",
  invalidName: "Certains caractères ne sont pas autorisés",
  invalidLastName: "Nom invalide, certains caractères ne sont pas traités",
  minLenghtPwd: "La longueur minimum est de 4 caractères",
  confirmPwd: "Les mot de passe ne correspondent pas",
  invalidCode: "Code invalide : demandez le code de l'année au BDE",
  dateOrder: "La date de fin doit être APRES la date de début",
};

export function getFieldProps<T extends FieldValues>(
  label: string,
  type?: FormFieldType,
  required?: boolean,
  repeat?: string,
  optionRules?: string[]
): Params<T> {
  const newLabel = label.concat(required ? " *" : "");
  let rules: Omit<ResolverOptions<T>, keyof FieldValues> = {};
  if (required)
    rules = {
      ...rules,
      required: errorTxt.required,
    };
  if (repeat)
    rules = {
      ...rules,
      validate: (value: string) => value === repeat || errorTxt.confirmPwd,
    };
  if (type === "date") {
    rules = {
      ...rules,
      validate: (value?: { start: Date; end: Date }) =>
        value && (value.start <= value.end || errorTxt.dateOrder),
    };
  }
  if (optionRules)
    optionRules.forEach((element) => {
      switch (element) {
        case "password":
          rules = {
            ...rules,
            minLength: { value: 4, message: errorTxt.minLenghtPwd },
          };
          break;
        case "name":
          rules = {
            ...rules,
            pattern: {
              value: regEx_name,
              message: errorTxt.invalidName,
            },
          };
          break;
      }
    });
  return { rules, newLabel };
}

export function getFieldInput<T extends FieldValues>(
  props: FieldInputProps<T>
): ReactElement {
  switch (props.type) {
    case "text":
      return <TextInputForm<T> {...props} />;
    case "image":
      break;
    case "date":
      return (
        <DateTimeFormPicker
          value={props.field.value}
          allDayOption={props.options?.allDay}
          onChange={props.field.onChange}
          error={props.fieldState.error}
        />
      );
    case "select":
      return <SelectInput<T> {...props} />;
    case "chip":
      return <ChipInput<T> {...props} />;
    case "double-select":
      break;
    default:
  }
  return <View></View>;
}
