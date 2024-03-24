import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native-paper";
import { Text } from "react-native";
import { getProps } from "utils/form";

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
  required,
  repeat,
}: FieldProps<T>) {
  const props = getProps<T>(name, required, repeat);
  console.log(props);
  return (
    <Controller
      control={control}
      name={name}
      rules={props.rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, invalid },
      }) => (
        <>
          <TextInput
            mode="outlined"
            label={props.label.concat(required ? " *" : "")}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
            blurOnSubmit={false}
          />
          {error && <Text>{error.message}</Text>}
        </>
      )}
    />
  );
}

export default RHField;
