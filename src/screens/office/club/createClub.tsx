import React, { useState } from "react";
import { useStoreMap, useUnit } from "effector-react";
import { useForm } from "react-hook-form";

import { useClub } from "@firebase";
import { $officeStore } from "@context/officeStore";
import { $sessionStore } from "@context/sessionStore";
import { ClubFieldNames, FormFieldValues } from "@types";
import { CreateClubProps } from "@navigation/navigationTypes";
import ClubForm from "./clubForm";

export default function CreateClubScreen({
  navigation,
  route,
}: CreateClubProps) {
  const { officeId } = route.params;
  const { createClub } = useClub();
  const { officeList } = useUnit($officeStore);
  const { role } = useUnit($sessionStore);
  const [loading, setLoading] = useState(false);

  const office = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === officeId),
  });
  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));
  const { control, handleSubmit, setFocus } = useForm<ClubFieldNames>({
    defaultValues: {
      office: { label: office?.name, value: office?.id },
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
      required: true,
      options: { choices: officeChoices },
    });
  }

  const onSubmit = async (data: ClubFieldNames) => {
    try {
      setLoading(true);
      await createClub({ ...data });
    } catch (e) {
      console.error("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <ClubForm
      create
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      values={values}
      control={control}
      setFocus={setFocus}
    />
  );
}
