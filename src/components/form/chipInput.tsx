import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FieldValues } from "react-hook-form";
import { HelperText, useTheme } from "react-native-paper";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FieldInputProps } from "types/form.type";
import { BodyText } from "components/customText";
import { Container } from "@styledComponents";

export function ChipInputForm<T extends FieldValues>({
  field: { onBlur, onChange, value },
  fieldState: { error },
  label,
  options,
}: FieldInputProps<T>) {
  const { colors, roundness } = useTheme();
  return (
    <Container style={styles.container}>
      <BodyText style={[styles.label, { backgroundColor: colors.background }]}>
        {label}
      </BodyText>
      <MultiSelect
        data={options?.choices || []}
        value={value || []}
        valueField="value"
        labelField="label"
        onChange={onChange}
        onBlur={onBlur}
        search
        placeholder="Sélectionner des tags"
        searchPlaceholder="Chercher..."
        placeholderStyle={{ color: colors.onSurfaceVariant }}
        style={[
          styles.dropdown,
          { borderRadius: roundness, borderColor: colors.onSurfaceVariant },
        ]}
        itemTextStyle={{ color: colors.primary }}
        inputSearchStyle={{ color: colors.onSurfaceVariant }}
        activeColor={colors.background}
        containerStyle={{
          backgroundColor: colors.surfaceVariant,
          borderColor: colors.surfaceVariant,
          borderRadius: roundness,
        }}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => unSelect && unSelect(item)}
          >
            <View
              style={[
                styles.selectedStyle,
                { backgroundColor: colors.primary },
              ]}
            >
              <BodyText
                style={[styles.textSelectedStyle, { color: colors.background }]}
              >
                {item.label}
              </BodyText>
              <AntDesign color={colors.background} name="delete" />
            </View>
          </TouchableOpacity>
        )}
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  // select input
  label: {
    position: "absolute",
    zIndex: 2,
    left: 15,
    top: -10,
    paddingHorizontal: 5,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  // chips
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: { marginRight: 5 },
});
