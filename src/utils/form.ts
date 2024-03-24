import { FieldValues, RegisterOptions } from "react-hook-form";
import { KeyboardTypeOptions } from "react-native";

type Params<T extends FieldValues> = {
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rules?: Omit<RegisterOptions<T>, keyof FieldValues>;
};

const regEx_mail = /^[\w\-\.]+@ensc\.fr$/gm;
const regEx_name = /^[a-z ,.'-]+$/i;

export function getFieldProps<T extends FieldValues>(
  name: string,
  required?: boolean,
  repeat?: string
): Params<T> {
  const rules = required ? { required: "Ce champs est obligatoire" } : {};
  switch (name) {
    case "firstName":
      return {
        label: "Prénom",
        rules: {
          ...rules,
          pattern: {
            value: regEx_name,
            message:
              "Prénom invalide, certains caractères ne sont pas pris en compte",
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
            message:
              "Nom invalide, certains caractères ne sont pas pris en compte",
          },
        },
      };
    case "mail":
      return {
        label: "Email",
        keyboardType: "email-address",
        rules: {
          ...rules,
          pattern: {
            value: regEx_mail,
            message: "L'email est invalide",
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
            message: "Il faut au moins 4 caractères",
          },
        },
      };
    case "repeatPassword":
      return {
        label: "Confirmer mot de passe",
        secureTextEntry: true,
        rules: {
          ...rules,
          validate: (value: string) =>
            value === repeat || "Le mot de passe ne correspond pas",
        },
      };
    case "code":
      return {
        label: "Code ENSC",
        rules: rules,
      };
    default:
      return { label: "", rules: {} };
  }
}
