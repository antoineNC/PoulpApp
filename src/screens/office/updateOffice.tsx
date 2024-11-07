import { useState } from "react";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useStoreMap } from "effector-react";
import { Button } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import { useOffice } from "@firebase";
import { UpdateOfficeProps } from "@navigation/navigationTypes";
import { $officeStore } from "@context/officeStore";
import { ContainerScroll } from "@styledComponents";
import { OfficeFieldNames } from "@types";
import { authStyles, officeStyles } from "@styles";
import { colors } from "@theme";
import { TextInputForm } from "components/form/textInput";
import { ImagePickerForm } from "components/form/imagePicker";
import { ValidateButton } from "components/validateButton";

export default function UpdateOfficeScreen({
  navigation,
  route,
}: UpdateOfficeProps) {
  const { officeId } = route.params;
  const [loading, setLoading] = useState(false);
  const { updateOffice } = useOffice();
  const office = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === officeId),
  });

  if (!office) {
    return <></>;
  }
  const { control, handleSubmit, setFocus } = useForm<OfficeFieldNames>({
    defaultValues: {
      ...office,
    },
  });

  const onSubmit = async (data: OfficeFieldNames) => {
    try {
      setLoading(true);
      await updateOffice({ ...data }, office.id);
    } catch (e) {
      console.log("[updateoffice]", e);
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
        <Controller
          control={control}
          name="acronym"
          render={({ field, fieldState }) => (
            <TextInputForm
              field={field}
              fieldState={fieldState}
              label="Acronyme"
              index={0}
              lastInput={false}
              setFocus={() => setFocus("name")}
              type="text"
              submit={handleSubmit(onSubmit)}
            />
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextInputForm
              field={field}
              fieldState={fieldState}
              label="Nom"
              index={1}
              lastInput={false}
              setFocus={() => setFocus("description")}
              type="text"
              submit={handleSubmit(onSubmit)}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <TextInputForm
              field={field}
              fieldState={fieldState}
              type="text"
              label="Description"
              index={2}
              lastInput={false}
              options={{ multiline: true }}
              setFocus={() => setFocus("logoUrl")}
              submit={handleSubmit(onSubmit)}
            />
          )}
        />
        <Controller
          control={control}
          name="logoUrl"
          render={({ field, fieldState }) => (
            <ImagePickerForm
              field={field}
              fieldState={fieldState}
              label=""
              index={3}
              lastInput={false}
              setFocus={() => setFocus("members")}
              type="image"
              submit={handleSubmit(onSubmit)}
            />
          )}
        />
        <View style={{ marginVertical: 20, rowGap: 10 }}>
          <Button
            mode="outlined"
            icon="chevron-right"
            contentStyle={{
              flexDirection: "row-reverse",
            }}
            style={{ borderRadius: 5 }}
            textColor={colors.primary}
            onPress={() => navigation.navigate("updateMembers", { officeId })}
          >
            Modifier les membres
          </Button>
          <Button
            mode="outlined"
            icon="chevron-right"
            contentStyle={{
              flexDirection: "row-reverse",
            }}
            style={{ borderRadius: 5 }}
            textColor={colors.primary}
            onPress={() => navigation.navigate("updateMembers", { officeId })}
          >
            Modifier les clubs
          </Button>
          <Button
            mode="outlined"
            icon="chevron-right"
            contentStyle={{
              flexDirection: "row-reverse",
            }}
            style={{ borderRadius: 5 }}
            textColor={colors.primary}
            onPress={() => navigation.navigate("updateMembers", { officeId })}
          >
            Modifier les partenariats
          </Button>
        </View>
      </View>
      <View style={authStyles.buttonContainer}>
        <ValidateButton
          text="Valider les modifications"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          icon="content-save"
          iconPos="right"
        />
      </View>
    </ContainerScroll>
  );
}
