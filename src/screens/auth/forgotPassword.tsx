import { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button, Text } from "react-native-paper";

import { forgotPassword } from "@fb/service/auth.service";
import CustomField from "components/form/formField";
import { ContainerScroll } from "@styledComponents";
import { authStyles } from "@styles";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

type FieldNames = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<FieldNames>();

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      await forgotPassword(data);
      notificationToast(
        "success",
        "Un email de réinitialisation vous a été envoyé !"
      );
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerScroll style={authStyles.container}>
      <View style={authStyles.formList}>
        <Text>
          Entrez votre email pour recevoir le lien de réinitialisation du mot de
          passe.
        </Text>
        <CustomField<FieldNames>
          control={control}
          name="email"
          label="Email"
          type="text"
          required={true}
          options={{ inputMode: "email", autoCap: "none" }}
          index={0}
          lastInput={false}
          setFocus={() => {}}
          submit={handleSubmit(onSubmit)}
        />
      </View>
      <View style={authStyles.buttonContainer}>
        <Button
          mode="contained"
          children="Envoyer"
          onPress={handleSubmit(onSubmit)}
          uppercase
          loading={loading}
        />
        <Text>Pensez à vérifier vos spams si vous ne recevez pas l'email.</Text>
      </View>
    </ContainerScroll>
  );
}
