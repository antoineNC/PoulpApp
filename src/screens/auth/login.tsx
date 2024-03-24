import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomField from "components/formField";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { loginUser } from "utils/user";

type FieldNames = {
  email: string;
  password: string;
};

export default function LoginScreen({
  navigation,
}: NativeStackScreenProps<AuthParamList>) {
  const submitRef = useRef<View>(null);
  const values: FormFieldProps<FieldNames> = [
    { name: "email", required: true },
    { name: "password", required: true },
  ];
  const { control, handleSubmit, setFocus } = useForm<FieldNames>();

  const onSubmit = (data: FieldNames) => {
    loginUser(data);
  };
  return (
    <>
      {values.map((field, index) => (
        <CustomField<FieldNames>
          key={index}
          index={index}
          lastInput={index === values.length - 1}
          control={control}
          name={field.name}
          label={field.name}
          required={field.required}
          setFocus={(index) => {
            index < values.length
              ? setFocus(values[index].name)
              : submitRef.current?.focus();
          }}
        />
      ))}
      <Button
        ref={submitRef}
        mode="contained"
        children="Se connecter"
        onPress={handleSubmit(onSubmit)}
      />
      <Button
        children="Pas de compte ? Inscris-toi ici"
        onPress={() => navigation.navigate("signup")}
      />
    </>
  );
}
