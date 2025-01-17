import { useState } from "react";
import { View } from "react-native";
import { FieldValues } from "react-hook-form";
import { HelperText, IconButton, TextInput, Tooltip } from "react-native-paper";

import { InputProps } from "types/form.type";
import { Row } from "@styledComponents";
import { eye, eyeOff, help } from "components/icon/icons";

export function TextInputForm<T extends FieldValues>({
  field: { onBlur, onChange, ref, value },
  fieldState: { invalid, error },
  index,
  label,
  lastInput,
  setFocus,
  submit,
  options,
}: InputProps<T>) {
  const [hide, setHide] = useState(true);
  return (
    <View>
      <Row>
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
                  icon={eye}
                  onPress={() => setHide((prev) => !prev)}
                />
              ) : (
                <TextInput.Icon
                  icon={eyeOff}
                  onPress={() => setHide((prev) => !prev)}
                />
              )
            ) : null
          }
          onSubmitEditing={
            lastInput ? async (e) => await submit(e) : () => setFocus(index + 1)
          }
          style={{ flex: 1, maxHeight: 200 }}
        />
        {options?.tooltip && (
          <Tooltip
            title={options.tooltip}
            enterTouchDelay={0}
            leaveTouchDelay={3000}
          >
            <IconButton icon={help} />
          </Tooltip>
        )}
      </Row>
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}
