import React, { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { AuthParamList } from "@navigation/navigationTypes";
import CustomField from "components/form/formField";
import { ContainerScroll as Container } from "@styledComponents";
import { authStyles } from "@styles";
import { registerUser } from "@fb/service/auth.service";
import { actionSession } from "@context/sessionStore";
import { FormFieldValues } from "types/form.type";

type FieldNames = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
};

export default function SignupScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setFocus } = useForm<FieldNames>();

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
      name: "code",
      label: "Code ENSC",
      type: "text",
      required: true,
    },
  ];

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      const sessionCredential = await registerUser(data);
      actionSession.login(sessionCredential);
    } catch (e: any) {
      throw new Error("signup Error :", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Connexion..."}
          textStyle={{ color: colors.onBackground }}
        />
      )}
      <Container style={authStyles.container}>
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<FieldNames>
              {...field}
              key={index}
              control={control}
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
