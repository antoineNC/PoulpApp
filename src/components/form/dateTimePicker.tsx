import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, HelperText, Switch } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Container, Row, Text } from "@styledComponents";
import { displayDateFromDate, formatDay, formatHour } from "utils/dateUtils";
import { colors } from "@theme";
import { FieldValues } from "react-hook-form";
import { FieldInputProps } from "utils/formUtils";
import { DatePickerValues } from "types/date.type";
import React from "react";

export function DateTimeFormPicker<T extends FieldValues>({
  field: { value, onChange },
  fieldState: { error },
  options,
}: FieldInputProps<T>) {
  const startEqualsEnd = value ? displayDateFromDate(value).allday : false;
  const startDate: Date = value?.start || new Date();
  const endDate: Date = value?.end || new Date();
  const [picker, setPicker] = useState<DatePickerValues>({
    mode: "date",
    showStart: false,
    showEnd: false,
  });
  const [allDay, setAllDay] = useState(options?.allDay || startEqualsEnd);
  const [isDate, setIsDate] = useState(value ? true : false);
  const handleOnChange = (period: "start" | "end", date?: Date) => {
    onChange({
      start: period === "start" && date ? date : startDate,
      end: period === "end" && date ? date : endDate,
    });
    setPicker((prev) => ({ ...prev, showEnd: false, showStart: false }));
  };
  const handleIsDate = (value: boolean) => {
    onChange(
      value
        ? {
            start: startDate,
            end: endDate,
          }
        : undefined
    );
    setIsDate(value);
  };
  const handleAllday = () => {
    // la condition est inversée puisqu'on prend la valeur avant update
    onChange({
      start: startDate,
      end: allDay ? endDate : startDate,
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
                    setPicker({ mode: "date", showStart: true });
                  }}
                >
                  <View style={[styles.border, styles.dateContainer]}>
                    <Text $dark>{formatDay(startDate)}</Text>
                  </View>
                </TouchableOpacity>
                {!allDay && (
                  <>
                    <Text $dark>{" à "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPicker({ mode: "time", showStart: true });
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatHour(startDate)}</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </Row>
            </Row>
            {/* Start Date picker */}
            {picker?.showStart && (
              <DateTimePicker
                value={startDate}
                onChange={(_, date) => handleOnChange("start", date)}
                mode={picker.mode}
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
                        setPicker({ mode: "date", showEnd: true });
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatDay(endDate)}</Text>
                      </View>
                    </TouchableOpacity>
                    <Text $dark>{" à "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPicker({ mode: "time", showEnd: true });
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatHour(endDate)}</Text>
                      </View>
                    </TouchableOpacity>
                  </Row>
                </Row>
                {/* End Date picker */}
                {picker?.showEnd && (
                  <DateTimePicker
                    value={endDate}
                    onChange={(_, date) => handleOnChange("end", date)}
                    mode={picker.mode}
                    is24Hour
                  />
                )}
              </>
            )}
          </View>
        </>
      )}
      {error && <HelperText type="error">{error.message}</HelperText>}
    </Container>
  );
}

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
