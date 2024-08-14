import React, { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { AuthParamList } from "@navigation/navigationTypes";
import CustomField from "components/formField";
import { ContainerScroll as Container } from "@styledComponents";
import { authStyles } from "@styles";
import { colors } from "@theme";
import { useAuth } from "@firebase";
import { FormFieldProps } from "@types";

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

  const values: FormFieldProps<FieldNames> = [
    { name: "firstName", required: true },
    { name: "lastName", required: true },
    { name: "email", required: true },
    { name: "password", required: true },
    { name: "repeatPassword", required: true, confirm: true },
    { name: "code", required: true },
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
      throw Error("Login Error :", e);
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
              key={index}
              index={index}
              lastInput={index === values.length - 1}
              control={control}
              name={field.name}
              required={field.required}
              repeat={field.confirm ? pwd : undefined}
              setFocus={(index) =>
                index < values.length ? setFocus(values[index].name) : null
              }
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
