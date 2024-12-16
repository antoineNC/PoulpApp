import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, HelperText, Switch, useTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Container, Row } from "@styledComponents";
import { formatDay, formatHour } from "utils/dateUtils";
import { FieldValues } from "react-hook-form";
import { FieldInputProps } from "types/form.type";
import React from "react";
import { setHours, setMinutes, setSeconds } from "date-fns";
import { BodyText } from "components/customText";

export function DateTimeFormPicker<T extends FieldValues>({
  field: { value, onChange },
  fieldState: { error },
  label,
  options,
}: FieldInputProps<T>) {
  // FIXME : composant avec validation pour éviter de rerender a cause de la valeur qui change
  const startDate: Date = value?.start || new Date();
  const endDate: Date = value?.end || startDate;
  const { colors, roundness } = useTheme();
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
        styles.container,
        {
          borderRadius: roundness,
          borderColor: error ? colors.error : colors.onBackground,
        },
      ]}
    >
      <BodyText style={[styles.label, { backgroundColor: colors.background }]}>
        {label}
      </BodyText>
      {/* Is date switch */}
      <Row $justify="space-between">
        <BodyText>Définir une date : </BodyText>
        <Row>
          <BodyText>Non</BodyText>
          <Switch
            value={isDate}
            onValueChange={handleIsDate}
            style={{ marginHorizontal: 5 }}
          />
          <BodyText>Oui</BodyText>
        </Row>
      </Row>
      {isDate && (
        <View>
          {/* All Day checkbox */}
          <TouchableOpacity onPress={handleAllday} style={{ margin: 10 }}>
            <Row
              $padding="0 10px"
              style={{
                alignSelf: "center",
                borderWidth: 0.5,
                borderRadius: roundness,
                borderColor: colors.onBackground,
              }}
            >
              <BodyText>Journée entière</BodyText>
              <Checkbox status={allDay ? "checked" : "unchecked"} />
            </Row>
          </TouchableOpacity>
          {/* Start Date */}
          <View>
            <Row style={styles.rowContainer}>
              {!allDay && <BodyText style={{ flex: 1 }}>Début :</BodyText>}
              <Row $justify="space-evenly" style={{ flex: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    setModePicker("date");
                    setStartPicker(true);
                  }}
                >
                  <View
                    style={[
                      styles.dateContainer,
                      {
                        borderRadius: roundness,
                        borderColor: colors.onBackground,
                      },
                    ]}
                  >
                    <BodyText>{formatDay(startDate)}</BodyText>
                  </View>
                </TouchableOpacity>
                {!allDay && (
                  <>
                    <BodyText>{" à "}</BodyText>
                    <TouchableOpacity
                      onPress={() => {
                        setModePicker("time");
                        setStartPicker(true);
                      }}
                    >
                      <View
                        style={[
                          styles.dateContainer,
                          {
                            borderRadius: roundness,
                            borderColor: colors.onBackground,
                          },
                        ]}
                      >
                        <BodyText>{formatHour(startDate)}</BodyText>
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
          </View>
          {!allDay && (
            <View>
              {/* End Date */}
              <Row style={styles.rowContainer}>
                <BodyText style={{ flex: 1 }}>Fin :</BodyText>
                <Row $justify="space-evenly" style={{ flex: 5 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModePicker("date");
                      setEndPicker(true);
                    }}
                  >
                    <View
                      style={[
                        styles.dateContainer,
                        {
                          borderRadius: roundness,
                          borderColor: colors.onBackground,
                        },
                      ]}
                    >
                      <BodyText>{formatDay(endDate)}</BodyText>
                    </View>
                  </TouchableOpacity>
                  <BodyText>{" à "}</BodyText>
                  <TouchableOpacity
                    onPress={() => {
                      setModePicker("time");
                      setEndPicker(true);
                    }}
                  >
                    <View
                      style={[
                        styles.dateContainer,
                        {
                          borderRadius: roundness,
                          borderColor: colors.onBackground,
                        },
                      ]}
                    >
                      <BodyText>{formatHour(endDate)}</BodyText>
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
            </View>
          )}
        </View>
      )}
      {error && <HelperText type="error">{error.message}</HelperText>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "center",
    borderWidth: 0.5,
    padding: 10,
  },
  label: {
    position: "absolute",
    left: 15,
    top: -10,
    paddingHorizontal: 5,
  },
  rowContainer: { marginVertical: 10 },
  dateContainer: {
    height: 40,
    justifyContent: "center",
    borderWidth: 0.5,
    padding: 5,
  },
});
