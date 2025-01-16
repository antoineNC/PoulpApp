import React, { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { registerUser } from "@fb/service/auth.service";
import { actionSession } from "@context/sessionStore";
import { AuthParamList } from "@navigation/navigationTypes";
import CustomField from "components/form/formField";
import { ContainerScroll } from "@styledComponents";
import { authStyles } from "@styles";
import { FieldParams } from "types/form.type";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

type FieldNames = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
};

export default function RegisterScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setFocus } = useForm<FieldNames>();

  const values: FieldParams<FieldNames>[] = [
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
      options: { inputMode: "email", autoCap: "none", rules: ["mail"] },
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
      options: { tooltip: "Ce code vous est transmis à la rentrée par le BDE" },
    },
  ];

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      const sessionCredential = await registerUser(data);
      actionSession.login(sessionCredential);
      notificationToast("success", "Votre compte a bien été créé.");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Création du compte..."}
          textStyle={{ color: colors.onBackground }}
        />
      )}
      <ContainerScroll style={authStyles.container}>
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
      </ContainerScroll>
    </>
  );
}
