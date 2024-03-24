import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomField from "components/formField";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput, View } from "react-native";
import { Button } from "react-native-paper";

type FieldNames = {
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
  const submitRef = React.createRef<View>();
  const values: FormFieldProps<FieldNames> = [
    { name: "firstName", required: true },
    { name: "lastName", required: true },
    { name: "mail", required: true },
    { name: "password", required: true },
    { name: "repeatPassword", required: true, confirm: true },
    { name: "code", required: true },
  ];
  const { control, handleSubmit, watch, setFocus } = useForm<FieldNames>();
  const pwd = watch("password");
  const onSubmit = (data: any) => console.log(data);

  return (
    <>
      {values.map((field, index) => {
        return (
          <CustomField<FieldNames>
            key={index}
            index={index}
            lastInput={index === values.length - 1}
            control={control}
            name={field.name}
            required={field.required}
            repeat={field.confirm ? pwd : undefined}
            setFocus={(index) => {
              index < values.length
                ? setFocus(values[index].name)
                : submitRef.current?.focus();
            }}
          />
        );
      })}
      <Button
        ref={submitRef}
        mode="contained"
        children="S'inscrire"
        onPress={handleSubmit(onSubmit)}
      />
      <Button
        children="T'as déjà un compte ? Connecte-toi !"
        onPress={() => navigation.navigate("login")}
      />
    </>
  );
}
