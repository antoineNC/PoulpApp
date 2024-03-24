import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomField from "components/formField";
import { useForm } from "react-hook-form";
import { TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";

type FormValues = {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  repeatPassword: string;
  code: string;
};

export default function SignupScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const { control, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: { mail: string; password: string }) =>
    console.log(data);

  return (
    <>
      <CustomField<FormValues>
        control={control}
        name="firstName"
        label="Prénom"
        required
      />
      <CustomField<FormValues>
        control={control}
        name="lastName"
        label="Nom"
        required
      />
      <CustomField<FormValues>
        control={control}
        name="mail"
        label="Email"
        required
      />
      <CustomField<FormValues>
        control={control}
        name="password"
        label="Mot de passe"
        required
      />

      <CustomField<FormValues>
        control={control}
        name="repeatPassword"
        label="Confirmation du mot de passe"
        required
      />

      <CustomField<FormValues>
        control={control}
        name="code"
        label="Code ENSC"
        required
      />
      <Button
        mode="contained"
        children="S'inscrire"
        onPress={handleSubmit(onSubmit)}
      />
      <Button
        children="T'as déjà un compte ? Connecte-toi"
        onPress={() => navigation.navigate("login")}
      />
    </>
  );
}
