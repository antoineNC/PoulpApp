import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CreateScoreProps } from "@navigation/navigationTypes";
import { Container, Row, Text } from "@styledComponents";
import { HelperText, TextInput } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import { TouchableOpacity, View } from "react-native";
import { colors } from "@theme";
import { officeStyles } from "@styles";
import { formatDay } from "utils/dateUtils";
import { FloatingValidateBtn } from "components/validateButton";
import { PointInputController } from "components/pointInput";
import { PointsFieldNames } from "@types";
import { usePoint } from "@firebaseApi";

export default function CreateScoreScreen({ navigation }: CreateScoreProps) {
  const { createPoint } = usePoint();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<PointsFieldNames>({
    defaultValues: {
      date: Timestamp.now(),
      title: "",
      blue: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      green: 0,
    },
  });

  const pointsFieldValues: { name: keyof PointsFieldNames; label: string }[] = [
    { name: "blue", label: "Bleu" },
    { name: "yellow", label: "Jaune" },
    { name: "orange", label: "Orange" },
    { name: "red", label: "Rouge" },
    { name: "green", label: "Vert" },
  ];

  const onSubmit = async (data: PointsFieldNames) => {
    try {
      const formattedData: PointsFieldNames = {
        ...data,
        blue: Number(data.blue),
        yellow: Number(data.yellow),
        orange: Number(data.orange),
        red: Number(data.red),
        green: Number(data.green),
      };
      setLoading(true);
      await createPoint({ ...formattedData });
    } catch (e) {
      console.error("[create score]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <Container style={officeStyles.container}>
      <Controller
        control={control}
        name="title"
        rules={{ required: "Champs obligatoire" }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { invalid, error },
        }) => (
          <>
            <TextInput
              mode="outlined"
              numberOfLines={5}
              label={"Titre *"}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={invalid}
              autoFocus={true}
              enterKeyHint={"next"}
              inputMode={"text"}
              style={{ backgroundColor: colors.secondary }}
            />
            {error && <HelperText type="error">{error.message}</HelperText>}
          </>
        )}
      />
      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
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
                borderColor: error ? "red" : colors.black,
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
                    onChange={(e, newDate) => {
                      setShow(false);
                      onChange(Timestamp.fromDate(newDate || date));
                    }}
                  />
                )}
              </Row>
              {error && <HelperText type="error">{error.message}</HelperText>}
            </View>
          );
        }}
      />
      <View
        style={{
          justifyContent: "center",
          borderWidth: 0.5,
          borderRadius: 5,
          padding: 5,
          marginTop: 20,
          rowGap: 10,
        }}
      >
        {pointsFieldValues.map(({ label, name }, index) => (
          <PointInputController
            key={index}
            control={control}
            name={name}
            label={label}
          />
        ))}
      </View>
      <FloatingValidateBtn
        disabled={loading}
        label="Ajouter les points"
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
