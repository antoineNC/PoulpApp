import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateScoreProps } from "@navigation/navigationTypes";
import { Container } from "@styledComponents";
import { HelperText, TextInput } from "react-native-paper";
import { View } from "react-native";
import { colors } from "@theme";
import { officeStyles } from "@styles";
import { FloatingValidateBtn } from "components/validateButton";
import { PointInputController } from "components/pointInput";
import { useStoreMap } from "effector-react";
import { $pointStore } from "@context/pointStore";
import { DateComponent } from "components/dateScoreInput";
import { PointsFormFields } from "types/point.type";
import { updatePoint } from "@fb/service/point.service";
import React from "react";

export default function UpdateScoreScreen({
  navigation,
  route,
}: UpdateScoreProps) {
  const { idPoint } = route.params;
  const point = useStoreMap({
    store: $pointStore,
    keys: [idPoint],
    fn: (pointList) => pointList.find((point) => point.id === idPoint),
  });
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<PointsFormFields>({
    defaultValues: {
      ...point,
    },
  });

  const pointsFieldValues: { name: keyof PointsFormFields; label: string }[] = [
    { name: "blue", label: "Bleu" },
    { name: "yellow", label: "Jaune" },
    { name: "orange", label: "Orange" },
    { name: "red", label: "Rouge" },
    { name: "green", label: "Vert" },
  ];

  const onSubmit = async (data: PointsFormFields) => {
    try {
      const formattedData: PointsFormFields = {
        title: data.title,
        date: data.date,
        blue: Number(data.blue),
        yellow: Number(data.yellow),
        orange: Number(data.orange),
        red: Number(data.red),
        green: Number(data.green),
      };
      setLoading(true);
      await updatePoint(formattedData, idPoint);
    } catch (e) {
      throw new Error("[create score]: " + e);
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
              // style={{ backgroundColor: colors.secondary }}
            />
            {error && <HelperText type="error">{error.message}</HelperText>}
          </>
        )}
      />
      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <DateComponent value={value} onChange={onChange} error={error} />
        )}
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
        label="Enregistrer"
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
