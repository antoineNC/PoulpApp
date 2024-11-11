import React, { useState } from "react";
import { View } from "react-native";
import { useStoreMap, useUnit } from "effector-react";
import { useForm } from "react-hook-form";
import { AnimatedFAB } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import { useClub } from "@firebase";
import { $officeStore } from "@context/officeStore";
import { $sessionStore } from "@context/sessionStore";
import { ClubFieldNames, FormFieldValues } from "@types";
import { UpdateClubProps } from "@navigation/navigationTypes";
import { colors } from "@theme";
import { authStyles, officeStyles } from "@styles";
import { ContainerScroll } from "@styledComponents";
import CustomField from "components/form/formField";

export default function UpdateClubScreen({
  navigation,
  route,
}: UpdateClubProps) {
  const { clubId } = route.params;
  const { updateClub } = useClub();
  const { officeList } = useUnit($officeStore);
  const { role } = useUnit($sessionStore);
  const [loading, setLoading] = useState(false);
  const club = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.clubList.find((club) => club.id === clubId),
  });
  if (!club) {
    return <></>;
  }
  const office = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === club.officeId),
  });
  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));
  const { control, handleSubmit, setFocus } = useForm<ClubFieldNames>({
    defaultValues: {
      name: club.name,
      description: club.description,
      office: { label: office?.name, value: office?.id },
      logoFile: club.logoUrl,
      contact: club.contact,
    },
  });

  const values: FormFieldValues<ClubFieldNames> = [
    {
      name: "name",
      label: "Nom",
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
      name: "contact",
      label: "Contact",
      type: "text",
    },
    {
      name: "logoFile",
      label: "Logo :",
      type: "image",
    },
  ];

  if (role === "ADMIN_ROLE") {
    values.unshift({
      name: "office",
      label: "Géré par",
      type: "select",
      options: { choices: officeChoices },
    });
  }

  const onSubmit = async (data: ClubFieldNames) => {
    try {
      setLoading(true);
      await updateClub({ ...data }, clubId);
    } catch (e) {
      console.error("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <>
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
            <CustomField<ClubFieldNames>
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
      <AnimatedFAB
        icon={"content-save"}
        label={"Enregistrer le club"}
        extended={true}
        onPress={handleSubmit(onSubmit)}
        visible={true}
        animateFrom="right"
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
        }}
        variant="secondary"
      />
    </>
  );
}
