import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, HelperText, Switch, useTheme } from "react-native-paper";
import { Container, Row } from "@styledComponents";
import { formatHour } from "utils/dateUtils";
import { FieldValues } from "react-hook-form";
import { InputProps } from "types/form.type";
import React from "react";
import { setHours, setMinutes, setSeconds } from "date-fns";
import { BodyText, LabelText } from "components/customText";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

export function DateTimeFormPicker<T extends FieldValues>({
  field: { value, onChange },
  fieldState: { error },
  label,
  options,
}: InputProps<T>) {
  const startDate: Date = value?.start || new Date();
  const endDate: Date = value?.end || startDate;
  const { colors, roundness } = useTheme();
  const [startTimeVisible, setstartTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);
  const [allDay, setAllDay] = useState(options?.allDay || !value?.end);
  const [isDate, setIsDate] = useState(value?.start ? true : false);

  const onChangeDate = (d: Date, period: "start" | "end") => {
    const newDate = d;
    if (period === "start") {
      newDate.setHours(startDate.getHours(), startDate.getMinutes());
      onChange({ ...value, start: newDate });
    } else {
      newDate.setHours(endDate.getHours(), endDate.getMinutes());
      onChange({ ...value, end: newDate });
    }
  };
  const onChangeTime = (
    time: { hours: number; minutes: number },
    period: "start" | "end"
  ) => {
    if (period === "start") {
      const newDate = startDate;
      newDate.setHours(time.hours, time.minutes);
      onChange({ ...value, start: newDate });
      setstartTimeVisible(false);
    } else {
      const newDate = endDate;
      newDate.setHours(time.hours, time.minutes);
      onChange({ ...value, end: newDate });
      setEndTimeVisible(false);
    }
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
      <LabelText style={[styles.label, { backgroundColor: colors.background }]}>
        {label}
      </LabelText>
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
              <Row
                $justify="space-evenly"
                style={{
                  flex: 5,
                }}
              >
                <DatePickerInput
                  locale="fr"
                  value={startDate}
                  onChange={(d) => d && onChangeDate(d, "start")}
                  inputMode="start"
                  mode="outlined"
                  startWeekOnMonday
                  presentationStyle="overFullScreen"
                />
                {!allDay && (
                  <>
                    <BodyText style={{ marginHorizontal: 15 }}>
                      {" à "}
                    </BodyText>
                    <TouchableOpacity
                      onPress={() => {
                        setstartTimeVisible(true);
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
            <TimePickerModal
              locale="fr"
              visible={startTimeVisible}
              onDismiss={() => setstartTimeVisible(false)}
              onConfirm={(params) => onChangeTime(params, "start")}
              hours={startDate.getHours()}
              minutes={startDate.getMinutes()}
              cancelLabel="Annuler"
              confirmLabel="Confirmer"
              animationType="fade"
            />
          </View>
          {!allDay && (
            <View>
              {/* End Date */}
              <Row style={styles.rowContainer}>
                <BodyText style={{ flex: 1 }}>Fin :</BodyText>
                <Row $justify="space-evenly" style={{ flex: 5 }}>
                  <DatePickerInput
                    locale="fr"
                    value={endDate}
                    onChange={(d) => d && onChangeDate(d, "end")}
                    inputMode="end"
                    mode="outlined"
                    startWeekOnMonday
                    presentationStyle="overFullScreen"
                    style={{ flex: 1 }}
                  />
                  <BodyText style={{ marginHorizontal: 15 }}>{" à "}</BodyText>
                  <TouchableOpacity
                    onPress={() => {
                      setEndTimeVisible(true);
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
              <TimePickerModal
                locale="fr"
                visible={endTimeVisible}
                onDismiss={() => setEndTimeVisible(false)}
                onConfirm={(params) => onChangeTime(params, "end")}
                hours={endDate.getHours()}
                minutes={endDate.getMinutes()}
                cancelLabel="Annuler"
                confirmLabel="Confirmer"
                animationType="fade"
              />
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
