import { FieldValues, RegisterOptions } from "react-hook-form";

export function getProps<T extends FieldValues>(
  name: string,
  required?: boolean,
  repeat?: string
): {
  label: string;
  rules?: Omit<RegisterOptions<T>, keyof FieldValues>;
} {
  const props = required
    ? { rules: { required: "Ce champs est obligatoire" } }
    : {};
  switch (name) {
    case "firstName":
      return {
        label: "Prénom",
        rules: {
          ...props.rules,
          pattern: {
            value: /^[a-z ,.'-]+$/i,
            message:
              "Prénom invalide, certains caractères ne sont pas pris en compte",
          },
        },
      };
    case "lastName":
      return {
        label: "Nom",
        rules: {
          ...props.rules,
          pattern: {
            value: /^[a-z ,.'-]+$/i,
            message:
              "Nom invalide, certains caractères ne sont pas pris en compte",
          },
        },
      };
    case "mail":
      return {
        ...props,
        label: "Email",
        rules: {
          ...props.rules,
          pattern: {
            value: /^[\w\-\.]+@ensc\.fr$/gm,
            message: "L'email est invalide",
          },
        },
      };
    case "password":
      return {
        label: "Mot de passe",
        rules: {
          ...props.rules,
          minLength: {
            value: 4,
            message: "Il faut au moins 4 caractères",
          },
        },
      };
    case "repeatPassword":
      return {
        label: "Confirmer mot de passe",
        rules: {
          ...props.rules,
          validate: (value: string) =>
            value === repeat || "Le mot de passe ne correspond pas",
        },
      };
    case "code":
      return {
        label: "Code ENSC",
        rules: props.rules,
      };
    default:
      return { label: "", rules: {} };
  }
}
