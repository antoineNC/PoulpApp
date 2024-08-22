import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FieldValues } from "react-hook-form";
import { HelperText } from "react-native-paper";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "@styledComponents";
import { FieldInputProps } from "utils/formUtils";
import { colors } from "@theme";

export function ChipInputForm<T extends FieldValues>({
  field: { onBlur, onChange, value },
  fieldState: { error },
  label,
  options,
}: FieldInputProps<T>) {
  if (options?.choices)
    return (
      <View>
        <Text $dark $size="s" style={styles.label}>
          {label}
        </Text>
        <MultiSelect
          data={options.choices}
          value={value}
          valueField="value"
          labelField="label"
          onChange={onChange}
          onBlur={onBlur}
          mode="modal"
          search
          placeholder="Sélectionner des tags"
          searchPlaceholder="Chercher..."
          style={styles.dropdown}
          containerStyle={styles.container}
          inputSearchStyle={styles.inputSearch}
          activeColor={colors.secondary}
          renderItem={(item) => (
            <View key={item.value} style={styles.item}>
              <Text $dark>{item.label}</Text>
            </View>
          )}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => unSelect && unSelect(item)}
            >
              <View style={styles.selectedStyle}>
                <Text $size="m" style={styles.textSelectedStyle}>
                  {item.label}
                </Text>
                <AntDesign color="white" name="delete" />
              </View>
            </TouchableOpacity>
          )}
        />
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
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  inputSearch: { borderRadius: 5, height: 50 },
  item: {
    padding: 20,
  },
  // chips
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: colors.primary,
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
