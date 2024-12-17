import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { HelperText, useTheme } from "react-native-paper";
import { formatDay } from "utils/dateUtils";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BodyText, LabelText } from "../customText";
import { FieldInputProps } from "types/form.type";

export function DatePicker<T extends FieldValues>({
  field: { value, onChange },
  fieldState: { error },
  label,
}: FieldInputProps<T>) {
  const { colors, roundness } = useTheme();
  const [show, setShow] = useState(false);
  return (
    <View
      style={{
        justifyContent: "center",
        borderWidth: 0.5,
        borderRadius: roundness,
        marginTop: 20,
        paddingHorizontal: 15,
        borderColor: error ? colors.error : colors.onBackground,
      }}
    >
      <LabelText style={[styles.label, { backgroundColor: colors.background }]}>
        {label}
      </LabelText>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <View style={{ paddingVertical: 15 }}>
          <BodyText>{formatDay(value)}</BodyText>
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode={"date"}
          is24Hour={true}
          onChange={(_, newDate) => {
            setShow(false);
            onChange(newDate || value);
          }}
        />
      )}
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    left: 15,
    top: -10,
    paddingHorizontal: 5,
  },
});
