import { Row, Text } from "@styledComponents";
import { colors } from "@theme";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { HelperText } from "react-native-paper";
import { formatDay } from "utils/dateUtils";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [show, setShow] = useState(false);
  return (
    <View
      style={{
        justifyContent: "center",
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 5,
        marginTop: 10,
        // borderColor: error ? "red" : colors.black,
      }}
    >
      <Row>
        <Text $dark style={{ flex: 1 }}>
          Date :
        </Text>
        <Row $justify="space-evenly" style={{ flex: 5 }}>
          <TouchableOpacity onPress={() => setShow(true)}>
            <View
              style={{
                justifyContent: "center",
                padding: 5,
                height: 50,
              }}
            >
              <Text $dark>{formatDay(date)}</Text>
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
