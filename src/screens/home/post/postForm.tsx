import { View } from "react-native";
import { useUnit } from "effector-react";
import { UseFormReturn } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import { $officeStore } from "@context/officeStore";
import CustomField from "components/form/formField";
import { FloatingValidateBtn } from "components/validateButton";
import { ContainerScroll } from "@styledComponents";
import { authStyles, officeStyles } from "@styles";
import { postTags } from "data";
import { PostFormFields } from "types/post.type";
import { FieldParams } from "types/form.type";
import React from "react";
import { useTheme } from "react-native-paper";

export const PostForm = ({
  formParams,
  loading,
  onSubmit,
  create,
}: {
  formParams: UseFormReturn<PostFormFields>;
  loading: boolean;
  onSubmit: (data: PostFormFields) => void;
  create?: boolean;
}) => {
  const { colors } = useTheme();
  const { officeList } = useUnit($officeStore);
  const { control, handleSubmit, setFocus } = formParams;
  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));
  const tagsChoices = postTags
    .sort()
    .map((tag) => ({ value: tag, label: tag }));
  const values: FieldParams<PostFormFields>[] = [
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

  return (
    <>
      <ContainerScroll style={officeStyles.container}>
        {loading && (
          <Spinner
            visible={loading}
            textContent={create ? "Création..." : "Modification..."}
            textStyle={{ color: colors.onBackground }}
          />
        )}
        <View style={authStyles.formList}>
          {values.map((field, index) => (
            <CustomField<PostFormFields>
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
        <View style={{ height: 100 }} />
      </ContainerScroll>
      <FloatingValidateBtn
        disabled={loading}
        label={create ? "Publier le post" : "Valider les modifications"}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};
