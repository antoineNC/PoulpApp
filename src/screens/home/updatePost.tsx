import { useState } from "react";
import { View } from "react-native";
import { Timestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useUnit } from "effector-react";
import { Button, Modal } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import { usePost } from "@firebase";
import { UpdatePostProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import CustomField from "components/formField";
import { ContainerScroll } from "@styledComponents";
import { FormFieldValues } from "@types";
import { authStyles, officeStyles } from "@styles";
import { colors } from "@theme";
import { postTags } from "data";

export type FieldNames = {
  title: string;
  description: string;
  date?: { start: Timestamp; end: Timestamp };
  tags: string[];
  editor: { value: string; label: string };
  imageFile?: string;
};

export default function UpdatePostScreen({
  navigation,
  route,
}: UpdatePostProps) {
  const { post } = route.params;
  const { officeList } = useUnit($officeStore);
  const [loading, setLoading] = useState(false);
  const { updatePost } = usePost();
  const { control, handleSubmit, setFocus } = useForm<FieldNames>({
    defaultValues: {
      title: post.title,
      description: post.description,
      editor: { value: post.editorId, label: post.editor?.name },
      tags: post.tags,
      date: post.date,
      imageFile: post.imageUrl,
    },
  });
  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));
  const tagsChoices = postTags
    .sort()
    .map((tag) => ({ value: tag, label: tag }));
  const values: FormFieldValues<FieldNames> = [
    {
      name: "editor",
      label: "Bureau",
      type: "select",
      required: true,
      options: { choices: officeChoices },
    },
    {
      name: "title",
      label: "Titre du post",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      options: { multiline: true },
    },
    {
      name: "tags",
      label: "Tags",
      type: "chip",
      options: { choices: tagsChoices },
    },
    {
      name: "date",
      label: "Date de l'événement",
      type: "date",
    },
    {
      name: "imageFile",
      label: "Image",
      type: "image",
    },
  ];

  const onSubmit = async (data: FieldNames) => {
    try {
      setLoading(true);
      await updatePost({ ...data }, post.id);
    } catch (e) {
      console.log("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <ContainerScroll style={officeStyles.container}>
      {loading && (
        <Spinner
          visible={loading}
          textContent={"Modification..."}
          textStyle={{ color: colors.white }}
        />
      )}
      <View style={authStyles.formList}>
        {values.map((field, index) => (
          <CustomField<FieldNames>
            {...field}
            key={index}
            control={control}
            index={index}
            lastInput={index === values.length - 1}
            setFocus={(index) =>
              index < values.length && setFocus(values[index].name)
            }
            submit={handleSubmit(onSubmit)}
          />
        ))}
      </View>
      <View style={authStyles.buttonContainer}>
        <Button
          mode="contained"
          children="Valider les modifications"
          onPress={handleSubmit(onSubmit)}
          uppercase
          buttonColor={colors.primary}
          disabled={loading}
        />
      </View>
    </ContainerScroll>
  );
}
