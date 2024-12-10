import React, { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { AuthParamList } from "@navigation/navigationTypes";
import CustomField from "components/form/formField";
import { ContainerScroll as Container } from "@styledComponents";
import { authStyles } from "@styles";
import { colors } from "@theme";
import { useAuth } from "firebase/api";
import { FormFieldValues } from "@types";

type FieldNames = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  code: string;
};

export default function SignupScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { control, handleSubmit, watch, setFocus } = useForm<FieldNames>();
  const pwd = watch("password");

  const values: FormFieldValues<FieldNames> = [
    {
      name: "firstName",
      label: "Prénom",
      type: "text",
      required: true,
      options: { rules: ["name"] },
    },
    {
      name: "lastName",
      label: "Nom",
      type: "text",
      required: true,
      options: { rules: ["name"] },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      options: { inputMode: "email", autoCap: "none" },
    },
    {
      name: "password",
      label: "Mot de passe",
      type: "text",
      required: true,
      options: { secureText: true, rules: ["password"] },
    },
    {
      name: "repeatPassword",
      label: "Confirmer mot de passe",
      type: "text",
      required: true,
      options: { secureText: true, confirm: true },
    },
    {
      name: "code",
      label: "Code ENSC",
      type: "text",
      required: true,
    },
  ];

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      await signup({
        ...data,
      });
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      throw Error("signup Error :", e);
    }
  };

  return (
    <>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Connexion..."}
          textStyle={{ color: colors.white }}
        />
      )}
      <Container style={authStyles.container}>
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<FieldNames>
              {...field}
              key={index}
              control={control}
              repeat={field.options?.confirm ? pwd : undefined}
              index={index}
              lastInput={index === values.length - 1}
              setFocus={(index) =>
                index < values.length && setFocus(values[index].name)
              }
              submit={handleSubmit(onSubmit)}
            />
          ))}
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode="contained"
            children="S'inscrire"
            onPress={handleSubmit(onSubmit)}
            uppercase
          />
          <Button
            children="T'as déjà un compte ? Connecte-toi !"
            onPress={() => navigation.navigate("login")}
          />
        </View>
      </Container>
    </>
  );
}
