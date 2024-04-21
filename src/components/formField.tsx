import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native-paper";
import { Text, View } from "react-native";
import { getFieldProps } from "utils/form.utils";
import React, { useState } from "react";
import { colors } from "@theme";
import { authStyles } from "styles/styles";

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
  const { label, keyboardType, secureTextEntry, autoCapitalize, rules } =
    getFieldProps<T>(name, required, repeat);
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
        <View style={authStyles.formField}>
          <TextInput
            ref={ref}
            mode="outlined"
            label={label.concat(required ? " *" : "")}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={invalid}
            autoFocus={index === 0}
            enterKeyHint={lastInput ? "done" : "next"}
            blurOnSubmit={lastInput ? true : false}
            keyboardType={keyboardType || "default"}
            autoCapitalize={autoCapitalize ? "none" : "sentences"}
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
            onSubmitEditing={() => setFocus(index + 1)}
            style={{ backgroundColor: colors.secondary }}
          />
          {error && <Text>{error.message}</Text>}
        </View>
      )}
    />
  );
}

export default FormField;
