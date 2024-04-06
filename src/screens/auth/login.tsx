import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

import CustomField from "components/formField";
import { loginUser } from "utils/user";
import { colors } from "theme";

type FieldNames = {
  email: string;
  password: string;
};

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const [loading, setLoading] = useState(false);
  const values: FormFieldProps<FieldNames> = [
    { name: "email", required: true },
    { name: "password", required: true },
  ];
  const { control, handleSubmit, setFocus } = useForm<FieldNames>();

  const onSubmit = async (data: FieldNames) => {
    setLoading(true);
    try {
      await loginUser(data);
      setLoading(false);
    } catch (e) {
      console.log("erroooooor", e);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Spinner
          visible={true}
          textContent={"Connexion..."}
          textStyle={{ color: colors.white }}
        />
      )}
      {values.map((field, index) => (
        <CustomField<FieldNames>
          key={index}
          index={index}
          lastInput={index === values.length - 1}
          control={control}
          name={field.name}
          label={field.name}
          required={field.required}
          setFocus={(index) => setFocus(values[index].name)}
        />
      ))}
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
    </>
  );
}
