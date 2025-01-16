import React, { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { loginUser } from "@fb/service/auth.service";
import { AuthParamList } from "@navigation/navigationTypes";
import { actionSession } from "@context/sessionStore";
import { FieldParams } from "types/form.type";
import { getAuthErrMessage } from "utils/errorUtils";
import { notificationToast } from "utils/toast";
import CustomField from "components/form/formField";
import { ContainerScroll } from "@styledComponents";
import { authStyles } from "@styles";

type FieldNames = {
  email: string;
  password: string;
};

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setFocus } = useForm<FieldNames>();

  const values: FieldParams<FieldNames>[] = [
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
      options: { secureText: true },
    },
  ];

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      const sessionCredential = await loginUser(data);
      actionSession.login(sessionCredential);
      notificationToast("success", "Connexion réussie !");
    } catch (e) {
      const msg = getAuthErrMessage(e);
      notificationToast("error", msg);
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
      <ContainerScroll style={authStyles.container}>
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<FieldNames>
              key={index}
              {...field}
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
            children="Se connecter"
            onPress={handleSubmit(onSubmit)}
            uppercase
          />
          <Button
            children="Pas de compte ? Inscris-toi ici"
            onPress={() => navigation.navigate("signup")}
          />
        </View>
      </ContainerScroll>
    </>
  );
}
