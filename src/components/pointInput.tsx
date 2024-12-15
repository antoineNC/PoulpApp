import { View } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { Row, Text } from "@styledComponents";
import { colors } from "@theme";

export function PointInputController<T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: "Champs obligatoire",
        pattern: {
          value: RegExp(/^(0|[1-9]\d*)$/),
          message: "Les points doivent être des nombres entiers positifs",
        },
      }}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { invalid, error },
      }) => (
        <View style={{ alignItems: "flex-end" }}>
          <Row $justify="space-between">
            <Text $dark style={{ flex: 1 }}>
              {label} :
            </Text>
            <TextInput
              mode="outlined"
              label={"Points *"}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value.toLocaleString()}
              error={invalid}
              inputMode={"numeric"}
              style={{
                // backgroundColor: colors.secondary,
                flex: 2,
              }}
            />
          </Row>
          {error && <HelperText type="error">{error.message}</HelperText>}
        </View>
      )}
    />
  );
}
