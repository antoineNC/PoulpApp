import { View } from "react-native";
import { HelperText } from "react-native-paper";
import { FieldValues } from "react-hook-form";
import { DatePickerInput } from "react-native-paper-dates";
import { InputProps } from "types/form.type";

export function DatePicker<T extends FieldValues>({
  field: { value, onChange },
  fieldState: { error },
  label,
}: InputProps<T>) {
  return (
    <View
      style={{
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <DatePickerInput
        locale="fr"
        label={label}
        value={value}
        onChange={(d) => onChange(d)}
        inputMode="start"
        mode="outlined"
        hasError={!!error}
        startWeekOnMonday
        presentationStyle="overFullScreen"
      />
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}
