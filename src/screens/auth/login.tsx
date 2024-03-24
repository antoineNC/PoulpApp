import { NavigationProp } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import CustomField from "components/formField";
import { useForm } from "react-hook-form";
import { TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";
import { ScreenStackProps } from "react-native-screens";

type FormValues = {
  mail: string;
  password: string;
};

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const { control, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: { mail: string; password: string }) =>
    console.log(data);
  return (
    <>
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
      <Button children="Se connecter" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity onPress={() => navigation.navigate("signup")}>
        <Text>OUIIIII</Text>
      </TouchableOpacity>
    </>
  );
}
