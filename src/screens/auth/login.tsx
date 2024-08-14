import { useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import { AuthParamList } from "@navigation/navigationTypes";
import CustomField from "components/formField";
import { colors } from "@theme";
import { ContainerScroll as Container } from "@styledComponents";
import { authStyles } from "@styles";
import { useAuth } from "@firebase";
import { FormFieldProps } from "@types";

type FieldNames = {
  email: string;
  password: string;
};

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { control, handleSubmit, setFocus } = useForm<FieldNames>();

  const values: FormFieldProps<FieldNames> = [
    { name: "email", required: true },
    { name: "password", required: true },
  ];

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      await login(data);
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
              label={field.name}
              required={field.required}
              setFocus={(index) =>
                index < values.length ? setFocus(values[index].name) : null
              }
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
      </Container>
    </>
  );
}
