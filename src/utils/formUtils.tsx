import { View } from "react-native";
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { CODE_ENSC } from "data";
import { TextInput } from "react-native-paper";
import { ReactElement, useState } from "react";
import { FormFieldOptions, FormFieldType } from "@types";
import { colors } from "@theme";
import { Text } from "@styledComponents";

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

type FieldInputProps<T extends FieldValues> = FormFieldProps & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
};

type Params<T extends FieldValues> = {
  newLabel: string;
  rules?: Omit<RegisterOptions<T>, keyof FieldValues>;
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
  invalidCode: "Code invalide. Demandez le code de l'année au BDE.",
};

export function getFieldProps<T extends FieldValues>(
  label: string,
  required?: boolean,
  repeat?: string,
  optionRules?: string[]
): Params<T> {
  const newLabel = label.concat(required ? " *" : "");
  let rules: Omit<RegisterOptions<T>, keyof FieldValues> = {};
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
  if (optionRules)
    optionRules.forEach((element) => {
      switch (element) {
        case "password":
          rules = {
            ...rules,
            minLength: { value: 4, message: errorTxt.minLenghtPwd },
          };
        case "name":
          rules = {
            ...rules,
            pattern: {
              value: regEx_name,
              message: errorTxt.invalidName,
            },
          };
      }
    });
  return { rules, newLabel };
  // switch (name) {
  //   case "firstName":
  //     return {
  //       label: "Prénom",
  //       rules: {
  //         ...rules,
  //         pattern: {
  //           value: regEx_name,
  //           message: errorTxt.invalidFirstName,
  //         },
  //       },
  //     };
  //   case "lastName":
  //     return {
  //       label: "Nom",
  //       rules: {
  //         ...rules,
  //         pattern: {
  //           value: regEx_name,
  //           message: errorTxt.invalidLastName,
  //         },
  //       },
  //     };
  //   case "email":
  //     return {
  //       label: "Email",
  //       rules: {
  //         ...rules,
  //         pattern: {
  //           value: regEx_mail,
  //           message: errorTxt.invalidMail,
  //         },
  //       },
  //     };
  //   case "password":
  //     return {
  //       label: "Mot de passe",
  //       rules: {
  //         ...rules,
  //         minLength: {
  //           value: 4,
  //           message: errorTxt.minLenghtPwd,
  //         },
  //       },
  //     };
  //   case "repeatPassword":
  //     return {
  //       label: "Confirmer mot de passe",
  //       rules: {
  //         ...rules,
  //         validate: (value: string) => value === repeat || errorTxt.confirmPwd,
  //       },
  //     };
  //   case "code":
  //     return {
  //       label: "Code ENSC",
  //       rules: {
  //         ...rules,
  //         pattern: {
  //           value: CODE_ENSC,
  //           message: errorTxt.invalidCode,
  //         },
  //       },
  //     };
  //   default:
  //     return { label: "", rules: {} };
  // }
}

export function getFieldInput<T extends FieldValues>({
  label,
  type,
  options,
  index,
  lastInput,
  setFocus,
  submit,
  field: { onChange, onBlur, value, ref },
  fieldState: { invalid, error },
}: FieldInputProps<T>): ReactElement {
  const [hide, setHide] = useState(true);
  switch (type) {
    case "text":
      return (
        <View>
          <TextInput
            ref={ref}
            mode="outlined"
            multiline={options?.multiline}
            label={label}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
            autoFocus={index === 0}
            enterKeyHint={lastInput ? "done" : "next"}
            inputMode={options?.inputMode}
            autoCapitalize={options?.autoCap}
            secureTextEntry={options?.secureText && hide}
            right={
              options?.secureText ? (
                hide ? (
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setHide((prev) => !prev)}
                  />
                ) : (
                  <TextInput.Icon
                    icon="eye-off"
                    onPress={() => setHide((prev) => !prev)}
                  />
                )
              ) : null
            }
            onSubmitEditing={
              lastInput
                ? async (e) => await submit(e)
                : () => setFocus(index + 1)
            }
            style={{ backgroundColor: colors.secondary }}
          />
          {error && <Text $dark>{error.message}</Text>}
        </View>
      );
    case "image":
      break;
    case "date":
      break;
    case "chip":
      break;
    case "select":
      break;
    case "double-select":
      break;
    default:
  }
  return <View></View>;
}
