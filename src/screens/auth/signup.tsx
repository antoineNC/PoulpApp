import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomField from "components/formField";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";

type FormValues = {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  repeatPassword: string;
  code: string;
};

type FieldProps = {
  name: keyof FormValues;
  required: boolean;
  confirm?: boolean;
};

export default function SignupScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const values: FieldProps[] = [
    { name: "firstName", required: true },
    { name: "lastName", required: true },
    { name: "mail", required: true },
    { name: "password", required: true },
    { name: "repeatPassword", required: true, confirm: true },
    { name: "code", required: true },
  ];
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const pwd = watch("password");
  const onSubmit = (data: any) => console.log(data);

  return (
    <>
      {values.map((field) => (
        <CustomField<FormValues>
          control={control}
          name={field.name}
          label={field.name}
          required={field.required}
          repeat={field.confirm ? pwd : undefined}
        />
      ))}
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
