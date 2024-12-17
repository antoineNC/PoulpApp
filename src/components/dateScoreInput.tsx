import { Row } from "@styledComponents";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { HelperText, useTheme } from "react-native-paper";
import { formatDay } from "utils/dateUtils";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BodyText } from "./customText";

export function DateComponent({
  value,
  onChange,
  error,
}: {
  value: Timestamp;
  onChange: (value: Timestamp) => void;
  error?: FieldError;
}) {
  const date = value?.toDate();
  const { colors, roundness } = useTheme();
  const [show, setShow] = useState(false);
  return (
    <View
      style={{
        justifyContent: "center",
        borderWidth: 0.5,
        borderRadius: roundness,
        padding: 5,
        marginTop: 20,
        borderColor: error ? colors.error : colors.onBackground,
      }}
    >
      <Row>
        <BodyText style={{ flex: 1 }}>Date :</BodyText>
        <Row $justify="space-evenly" style={{ flex: 5 }}>
          <TouchableOpacity onPress={() => setShow(true)}>
            <View
              style={{
                justifyContent: "center",
                padding: 5,
                height: 50,
              }}
            >
              <BodyText>{formatDay(date)}</BodyText>
            </View>
          </TouchableOpacity>
        </Row>
        {show && (
          <DateTimePicker
            value={date}
            mode={"date"}
            is24Hour={true}
            onChange={(_, newDate) => {
              setShow(false);
              onChange(Timestamp.fromDate(newDate || date));
            }}
          />
        )}
      </Row>
      {error && <HelperText type="error">{error.message}</HelperText>}
    </View>
  );
}
