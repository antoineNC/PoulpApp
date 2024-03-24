import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { TextInput, TextInputProps } from "react-native-paper";
import { Text } from "react-native";

type FieldProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  repeat?: string;
};

function RHField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  repeat,
}: FieldProps<T>) {
  let rules: Omit<RegisterOptions<T>, keyof FieldValues> | undefined = {
    required: {
      value: required ?? false,
      message: "Ce champs est obligatoire",
    },
    validate: (value: string) =>
      repeat === undefined ||
      value === repeat ||
      "Le mot de passe ne correspond pas",
  };
  switch (name) {
    case "mail":
      rules = {
        ...rules,
        pattern: {
          value: /^[\w\-\.]+@ensc\.fr$/gm,
          message: "L'email est invalide",
        },
      };
      break;
    case "password":
      rules = {
        ...rules,
        minLength: {
          value: 4,
          message: "Il faut au moins 4 caractères",
        },
      };
      break;
  }
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, invalid },
      }) => (
        <>
          <TextInput
            mode="outlined"
            label={label.concat(required ? " *" : "")}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
          />
          {error && <Text>{error.message}</Text>}
        </>
      )}
    />
  );
}

export default RHField;
