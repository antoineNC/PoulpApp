import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native-paper";
import { Text, TextInput as TextInputType } from "react-native";
import { getFieldProps } from "utils/form";
import React, { forwardRef, useState } from "react";

type FieldProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  repeat?: string;
  index: number;
  lastInput: boolean;
  setFocus: (state: number) => void;
};

function FormField<T extends FieldValues>(props: FieldProps<T>) {
  const { control, name, required, repeat, index, lastInput, setFocus } = props;
  const { label, keyboardType, secureTextEntry, rules } = getFieldProps<T>(
    name,
    required,
    repeat
  );
  const [hide, setHide] = useState(true);
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error, invalid },
      }) => (
        <>
          <TextInput
            ref={ref}
            mode="outlined"
            label={label.concat(required ? " *" : "")}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
            autoFocus={index === 0}
            blurOnSubmit={lastInput ? true : false}
            onSubmitEditing={() => setFocus(index + 1)}
            enterKeyHint={lastInput ? "done" : "next"}
            keyboardType={keyboardType || "default"}
            secureTextEntry={secureTextEntry ? hide : false}
            right={
              secureTextEntry ? (
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
          />
          {error && <Text>{error.message}</Text>}
        </>
      )}
    />
  );
}

export default FormField;
