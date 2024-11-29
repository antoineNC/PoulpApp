import { CreateScoreProps } from "@navigation/navigationTypes";
import { Container } from "@styledComponents";
import { TextInputForm } from "components/form/textInput";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function CreateScoreScreen({ navigation }: CreateScoreProps) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
    register,
  } = useForm<{
    title: string;
    date: string;
    blue: string;
    red: string;
    yellow: string;
    orange: string;
    green: string;
  }>();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      //   await createPost({ ...data });
    } catch (e) {
      console.error("[create score]", e);
    } finally {
      setLoading(false);
      //   navigation.goBack();
    }
  };

  return (
    <Container>
      <Controller
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextInputForm
            field={field}
            fieldState={fieldState}
            label="Titre *"
            index={0}
            lastInput={false}
            setFocus={() => setFocus("date")}
            type="text"
            submit={handleSubmit(onSubmit)}
          />
        )}
      />
      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextInputForm
            field={field}
            fieldState={fieldState}
            label="Nom *"
            index={1}
            lastInput={false}
            setFocus={() => setFocus("date")}
            type="text"
            submit={handleSubmit(onSubmit)}
            options={{ inputMode: "numeric" }}
          />
        )}
      />
    </Container>
  );
}
