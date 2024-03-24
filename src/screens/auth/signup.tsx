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

export default function SignupScreen() {
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
        label="Mot de passe"
        required
      />

      <CustomField<FormValues>
        control={control}
        name="code"
        label="Code ENSC"
        required
      />
      <Button children="Se connecter" onPress={handleSubmit(onSubmit)} />
    </>
  );
}
