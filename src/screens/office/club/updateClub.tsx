import React, { useState } from "react";
import { useStoreMap, useUnit } from "effector-react";
import { useForm } from "react-hook-form";
import { useClub } from "@firebase";
import { $officeStore } from "@context/officeStore";
import { $sessionStore } from "@context/sessionStore";
import { ClubFieldNames, FormFieldValues } from "@types";
import { UpdateClubProps } from "@navigation/navigationTypes";
import ClubForm from "./clubForm";

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

  if (role === "ADMIN") {
    values.unshift({
      name: "office",
      label: "Géré par",
      type: "select",
      required: true,
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
    <ClubForm
      create={false}
      loading={loading}
      control={control}
      values={values}
      onSubmit={handleSubmit(onSubmit)}
      setFocus={setFocus}
    />
  );
}
