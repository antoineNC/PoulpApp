import { Controller, UseFormReturn } from "react-hook-form";
import { Container } from "@styledComponents";
import { View } from "react-native";
import { officeStyles } from "@styles";
import { FloatingValidateBtn } from "components/validateButton";
import { DatePicker } from "components/form/datePicker";
import { PointsFormFields } from "types/point.type";
import React from "react";
import { TextInputForm } from "components/form/textInput";
import { BodyText } from "components/customText";

export function ScoreForm({
  formParams,
  onSubmit,
  loading,
}: {
  formParams: UseFormReturn<PointsFormFields>;
  onSubmit: (data: PointsFormFields) => void;
  loading: boolean;
}) {
  const { control, setFocus, handleSubmit } = formParams;
  const pointsFieldValues: { name: keyof PointsFormFields; label: string }[] = [
    { name: "blue", label: "Bleu" },
    { name: "yellow", label: "Jaune" },
    { name: "orange", label: "Orange" },
    { name: "red", label: "Rouge" },
    { name: "green", label: "Vert" },
  ];
  return (
    <Container style={officeStyles.container}>
      <Controller
        control={control}
        name="title"
        rules={{ required: "Champs obligatoire" }}
        render={({ field, fieldState }) => (
          <TextInputForm
            field={field}
            fieldState={fieldState}
            label="Titre *"
            index={0}
            lastInput={false}
            setFocus={() => setFocus("date")}
            submit={handleSubmit(onSubmit)}
          />
        )}
      />
      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <DatePicker
            field={field}
            fieldState={fieldState}
            label={"Date de l'événement *"}
            setFocus={() => {}}
            index={1}
            lastInput={false}
            submit={handleSubmit(onSubmit)}
          />
        )}
      />
      <View
        style={{
          marginTop: 40,
          rowGap: 10,
        }}
      >
        <BodyText>Points :</BodyText>
        {pointsFieldValues.map(({ label, name }, index) => (
          <Controller
            key={name}
            control={control}
            name={name}
            rules={{
              required: "Champs obligatoire",
              pattern: {
                value: RegExp(/^(0|[1-9]\d*)$/),
                message: "Les points doivent être des nombres entiers positifs",
              },
            }}
            render={({ field, fieldState }) => (
              <TextInputForm
                field={{ ...field, value: field.value.toLocaleString() }}
                fieldState={fieldState}
                label={label + " *"}
                index={index + 2}
                lastInput={index === 4}
                options={{ inputMode: "numeric" }}
                setFocus={() => setFocus(pointsFieldValues[index + 1].name)}
                submit={handleSubmit(onSubmit)}
              />
            )}
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
