import { useState } from "react";
import { View } from "react-native";
import { FieldValues } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { FieldInputProps } from "types/form.type";
import { colors } from "@theme";

export function TextInputForm<T extends FieldValues>({
  field: { onBlur, onChange, ref, value },
  fieldState: { invalid, error },
  index,
  label,
  lastInput,
  setFocus,
  submit,
  options,
}: FieldInputProps<T>) {
  const [hide, setHide] = useState(true);
  return (
    <View>
      <TextInput
        ref={ref}
        mode="outlined"
        multiline={options?.multiline}
        numberOfLines={5}
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
          lastInput ? async (e) => await submit(e) : () => setFocus(index + 1)
        }
        // style={{ backgroundColor: colors.secondary }}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}
