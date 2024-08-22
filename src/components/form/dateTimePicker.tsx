import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, Switch } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Container, Row, Text } from "@styledComponents";
import { DatePickerValues, Post } from "@types";
import {
  displayDateFromTimestamp,
  formatDay,
  formatHour,
} from "utils/dateUtils";
import { colors } from "@theme";
import { Timestamp } from "firebase/firestore";
import { FieldError } from "react-hook-form";

export const DateTimeFormPicker = ({
  value,
  onChange,
  allDayOption,
  error,
}: {
  value: Post["date"];
  onChange: (...event: any[]) => void;
  allDayOption?: boolean;
  error?: FieldError;
}) => {
  const startEqualsEnd = value ? displayDateFromTimestamp(value).allday : false;
  const [startPickerValues, setStartPickerValues] = useState<DatePickerValues>({
    show: false,
    mode: "date",
    value: value?.start.toDate() || new Date(),
  });
  const [endPickerValues, setEndPickerValues] = useState<DatePickerValues>({
    show: false,
    mode: "date",
    value: value?.end.toDate() || new Date(),
  });
  const [allDay, setAllDay] = useState(allDayOption || startEqualsEnd);
  const [isDate, setIsDate] = useState(value ? true : false);
  const handleOnChange = (period: "start" | "end", date?: Date) => {
    if (period === "start") {
      setStartPickerValues((prev) => ({
        ...prev,
        show: false,
        value: date || prev.value,
      }));
      onChange({
        start: Timestamp.fromDate(date || startPickerValues.value),
        end: Timestamp.fromDate(endPickerValues.value),
      });
    } else {
      setEndPickerValues((prev) => ({
        ...prev,
        show: false,
        value: date || prev.value,
      }));
      onChange({
        start: Timestamp.fromDate(startPickerValues.value),
        end: Timestamp.fromDate(date || endPickerValues.value),
      });
    }
  };
  const handleIsDate = (value: boolean) => {
    if (value)
      onChange({
        start: Timestamp.fromDate(startPickerValues.value),
        end: Timestamp.fromDate(endPickerValues.value),
      });
    else onChange(undefined);
    setIsDate(value);
  };
  const handleAllday = () => {
    if (allDay)
      onChange({
        start: Timestamp.fromDate(startPickerValues.value),
        end: Timestamp.fromDate(endPickerValues.value),
      });
    else
      onChange({
        start: Timestamp.fromDate(startPickerValues.value),
        end: Timestamp.fromDate(startPickerValues.value),
      });
    setAllDay(!allDay);
  };
  return (
    <Container
      style={[
        styles.border,
        {
          marginTop: 10,
          borderColor: error ? "red" : colors.black,
        },
      ]}
    >
      <Row $justify="space-between" $padding="5px">
        <Text $dark>Définir une date : </Text>
        <Row>
          <Text $dark>Non</Text>
          <Switch
            value={isDate}
            onValueChange={handleIsDate}
            style={{ marginHorizontal: 5 }}
          />
          <Text $dark>Oui</Text>
        </Row>
      </Row>
      {isDate && (
        <>
          <TouchableOpacity onPress={handleAllday}>
            <Row
              $padding="5px"
              style={[
                styles.border,
                {
                  alignSelf: "center",
                  marginVertical: 10,
                  backgroundColor: allDay ? colors.primary : "transparent",
                },
              ]}
            >
              <Text $dark={!allDay}>Journée entière</Text>
              <Checkbox
                status={allDay ? "checked" : "unchecked"}
                color={colors.secondary}
                uncheckedColor={colors.primary}
              />
            </Row>
          </TouchableOpacity>
          {/* Dates Inputs */}
          <View style={{ rowGap: 10 }}>
            {/* Start Date */}
            <Row>
              {!allDay && (
                <Text $dark style={{ flex: 1 }}>
                  Début :
                </Text>
              )}
              <Row $justify="space-evenly" style={{ flex: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    setStartPickerValues((prev) => ({
                      ...prev,
                      show: true,
                      mode: "date",
                    }));
                  }}
                >
                  <View style={[styles.border, styles.dateContainer]}>
                    <Text $dark>{formatDay(startPickerValues.value)}</Text>
                  </View>
                </TouchableOpacity>
                {!allDay && (
                  <>
                    <Text $dark>{" à "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setStartPickerValues((prev) => ({
                          ...prev,
                          show: true,
                          mode: "time",
                        }));
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatHour(startPickerValues.value)}</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </Row>
            </Row>
            {/* Start Date picker */}
            {startPickerValues?.show && (
              <DateTimePicker
                value={startPickerValues.value}
                onChange={(e, date) => handleOnChange("start", date)}
                mode={startPickerValues.mode}
                is24Hour
              />
            )}
            {!allDay && (
              <>
                {/* End Date */}
                <Row>
                  <Text $dark style={{ flex: 1 }}>
                    Fin :
                  </Text>
                  <Row $justify="space-evenly" style={{ flex: 5 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setEndPickerValues((prev) => ({
                          ...prev,
                          show: true,
                          mode: "date",
                        }));
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatDay(endPickerValues.value)}</Text>
                      </View>
                    </TouchableOpacity>
                    <Text $dark>{" à "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEndPickerValues((prev) => ({
                          ...prev,
                          show: true,
                          mode: "time",
                        }));
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatHour(endPickerValues.value)}</Text>
                      </View>
                    </TouchableOpacity>
                  </Row>
                </Row>
                {/* End Date picker */}
                {endPickerValues?.show && (
                  <DateTimePicker
                    value={endPickerValues.value}
                    onChange={(e, date) => handleOnChange("end", date)}
                    mode={endPickerValues.mode}
                    is24Hour
                  />
                )}
              </>
            )}
          </View>
        </>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  border: {
    justifyContent: "center",
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 5,
  },
  dateContainer: {
    height: 50,
  },
});
