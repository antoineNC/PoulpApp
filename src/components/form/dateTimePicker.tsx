import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, HelperText, Switch } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Container, Row, Text } from "@styledComponents";
import { formatDay, formatHour } from "utils/dateUtils";
import { colors } from "@theme";
import { FieldValues } from "react-hook-form";
import { FieldInputProps } from "types/form.type";
import React from "react";
import { setHours, setMinutes, setSeconds } from "date-fns";

export function DateTimeFormPicker<T extends FieldValues>({
  field: { value, onChange },
  fieldState: { error },
  options,
}: FieldInputProps<T>) {
  // FIXME : composant avec validation pour éviter de rerender a cause de la valeur qui change
  const startDate: Date = value?.start || new Date();
  const endDate: Date = value?.end || startDate;
  const [startPicker, setStartPicker] = useState(false);
  const [endPicker, setEndPicker] = useState(false);
  const [modePicker, setModePicker] = useState<"date" | "time">("date");
  const [allDay, setAllDay] = useState(options?.allDay || !value?.end);
  const [isDate, setIsDate] = useState(value?.start ? true : false);

  const handleStart = (date: Date) => {
    onChange({ ...value, start: date });
    setStartPicker(false);
  };

  const handleEnd = (date: Date) => {
    onChange({ ...value, end: date });
    setEndPicker(false);
  };

  const handleIsDate = (value: boolean) => {
    onChange(
      value
        ? {
            start: startDate,
            end: endDate,
          }
        : {}
    );
    setIsDate(value);
  };

  const handleAllday = () => {
    // la condition est inversée puisqu'on prend la valeur avant update
    if (allDay) {
      onChange({
        start: startDate,
        end: endDate,
      });
    } else {
      const allDayDate = setHours(setMinutes(setSeconds(startDate, 0), 0), 0);
      onChange({ start: allDayDate });
    }
    setAllDay((value) => !value);
  };

  return (
    <Container
      style={[
        styles.border,
        {
          marginTop: 10,
          // borderColor: error ? "red" : colors.black,
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
                  // backgroundColor: allDay ? colors.primary : "transparent",
                },
              ]}
            >
              <Text $dark={!allDay}>Journée entière</Text>
              <Checkbox
                status={allDay ? "checked" : "unchecked"}
                // color={colors.secondary}
                // uncheckedColor={colors.primary}
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
                    setModePicker("date");
                    setStartPicker(true);
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
                        setModePicker("time");
                        setStartPicker(true);
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
            {startPicker && (
              <DateTimePicker
                value={startDate}
                onChange={(_, date) => date && handleStart(date)}
                mode={modePicker}
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
                        setModePicker("date");
                        setEndPicker(true);
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatDay(endDate)}</Text>
                      </View>
                    </TouchableOpacity>
                    <Text $dark>{" à "}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModePicker("time");
                        setEndPicker(true);
                      }}
                    >
                      <View style={[styles.border, styles.dateContainer]}>
                        <Text $dark>{formatHour(endDate)}</Text>
                      </View>
                    </TouchableOpacity>
                  </Row>
                </Row>
                {/* End Date picker */}
                {endPicker && (
                  <DateTimePicker
                    value={endDate}
                    onChange={(_, date) => date && handleEnd(date)}
                    mode={modePicker}
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
