import React, { useState } from "react";
import { useStoreMap, useUnit } from "effector-react";
import { useForm } from "react-hook-form";

import { $officeStore } from "@context/officeStore";
import { CreateClubProps } from "@navigation/navigationTypes";
import ClubForm from "./clubForm";
import { useRight } from "utils/rights";
import { ClubFormFields } from "types/club.type";
import { createClub } from "@fb/service/club.service";
import { FieldParams } from "types/form.type";

export default function CreateClubScreen({
  navigation,
  route,
}: CreateClubProps) {
  const { officeId } = route.params;
  const { officeList } = useUnit($officeStore);
  const { isAdmin } = useRight();
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
  const { control, handleSubmit, setFocus } = useForm<ClubFormFields>({
    defaultValues: {
      office: { label: office?.name, value: office?.id },
    },
  });

  const values: FieldParams<ClubFormFields>[] = [
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

  if (isAdmin) {
    values.unshift({
      name: "office",
      label: "Géré par",
      type: "select",
      required: true,
      options: { choices: officeChoices },
    });
  }

  const onSubmit = async (data: ClubFormFields) => {
    try {
      setLoading(true);
      await createClub(data);
    } catch (e) {
      throw new Error("[submit create club]: " + e);
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
