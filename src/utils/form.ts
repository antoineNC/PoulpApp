import { CODE_ENSC } from "data";
import { FieldValues, RegisterOptions } from "react-hook-form";
import { KeyboardTypeOptions } from "react-native";

type Params<T extends FieldValues> = {
  label: string;
  autoCapitalize?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rules?: Omit<RegisterOptions<T>, keyof FieldValues>;
};

const regEx_mail = /^[\w\-\.]+@ensc\.fr$/gm;
const regEx_name = /^[a-z ,.'-]+$/i;
const errorTxt = {
  required: "Ce champs est obligatoire",
  invalidMail: "L'email est invalide",
  invalidFirstName:
    "Prénom invalide, certains caractères ne sont pas pris en compte",
  invalidLastName: "Nom invalide, certains caractères ne sont pas traités",
  invalidCode: "Code invalide. Demandez le code de l'année au BDE.",
  minLenghtPwd: "La longueur minimum est de 4 caractères",
  confirmPwd: "Les mot de passe ne correspondent pas",
};

export function getFieldProps<T extends FieldValues>(
  name: string,
  required?: boolean,
  repeat?: string
): Params<T> {
  const rules = required ? { required: errorTxt.required } : {};
  switch (name) {
    case "firstName":
      return {
        label: "Prénom",
        rules: {
          ...rules,
          pattern: {
            value: regEx_name,
            message: errorTxt.invalidFirstName,
          },
        },
      };
    case "lastName":
      return {
        label: "Nom",
        rules: {
          ...rules,
          pattern: {
            value: regEx_name,
            message: errorTxt.invalidLastName,
          },
        },
      };
    case "email":
      return {
        label: "Email",
        keyboardType: "email-address",
        autoCapitalize: true,
        rules: {
          ...rules,
          pattern: {
            value: regEx_mail,
            message: errorTxt.invalidMail,
          },
        },
      };
    case "password":
      return {
        label: "Mot de passe",
        secureTextEntry: true,
        rules: {
          ...rules,
          minLength: {
            value: 4,
            message: errorTxt.minLenghtPwd,
          },
        },
      };
    case "repeatPassword":
      return {
        label: "Confirmer mot de passe",
        secureTextEntry: true,
        rules: {
          ...rules,
          validate: (value: string) => value === repeat || errorTxt.confirmPwd,
        },
      };
    case "code":
      return {
        label: "Code ENSC",
        rules: {
          ...rules,
          pattern: {
            value: CODE_ENSC,
            message: errorTxt.invalidCode,
          },
        },
      };
    default:
      return { label: "", rules: {} };
  }
}
