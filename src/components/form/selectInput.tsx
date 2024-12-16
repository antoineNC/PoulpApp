import { View, StyleSheet } from "react-native";
import { FieldValues } from "react-hook-form";
import { HelperText, useTheme } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { FieldInputProps } from "types/form.type";
import React from "react";
import { BodyText } from "components/customText";

export function SelectInputForm<T extends FieldValues>({
  field: { onBlur, onChange, value },
  fieldState: { error },
  label,
  options,
}: FieldInputProps<T>) {
  const { colors, roundness } = useTheme();
  return (
    <View>
      <BodyText style={[styles.label, { backgroundColor: colors.background }]}>
        {label}
      </BodyText>
      <Dropdown
        data={options?.choices || []}
        value={value}
        valueField="value"
        labelField="label"
        onBlur={onBlur}
        onChange={onChange}
        placeholder={"Sélectionner un bureau"}
        placeholderStyle={{ color: colors.onSurfaceVariant }}
        selectedTextStyle={{ color: colors.onSurfaceVariant }}
        style={[
          styles.dropdown,
          { borderRadius: roundness, borderColor: colors.onSurfaceVariant },
        ]}
        itemTextStyle={{ color: colors.primary }}
        activeColor={colors.background}
        containerStyle={{
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.surfaceVariant,
        }}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}

export const styles = StyleSheet.create({
  // select input
  label: {
    alignSelf: "flex-start",
    zIndex: 2,
    left: 15,
    top: 8,
    paddingHorizontal: 5,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
});
