import { View, StyleSheet } from "react-native";
import { FieldValues } from "react-hook-form";
import { HelperText } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { FieldInputProps } from "utils/formUtils";
import { Text } from "@styledComponents";
import { colors } from "@theme";

export function SelectInputForm<T extends FieldValues>({
  field: { onBlur, onChange, ref, value },
  fieldState: { error },
  label,
  options,
}: FieldInputProps<T>) {
  return (
    <View>
      {options?.choices && (
        <>
          <Text $dark $size="s" style={styles.label}>
            {label}
          </Text>
          <Dropdown
            data={options.choices}
            value={value}
            valueField="value"
            labelField="label"
            onBlur={onBlur}
            onChange={onChange}
            style={styles.dropdown}
            placeholder={"Sélectionner un bureau"}
            containerStyle={styles.container}
            activeColor={colors.secondary}
          />
        </>
      )}
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}

const styles = StyleSheet.create({
  // select input
  dropdown: {
    height: 50,
    borderWidth: 0.7,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  label: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
    zIndex: 2,
    left: 15,
    top: 8,
    paddingHorizontal: 5,
  },
  //list of choices
  container: {
    borderRadius: 5,
  },
});
