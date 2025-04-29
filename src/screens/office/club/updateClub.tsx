import React, { useEffect, useState } from "react";
import { useStoreMap, useUnit } from "effector-react";
import { useForm } from "react-hook-form";

import { updateClub } from "@fb/service/club.service";
import { $officeStore } from "@context/officeStore";
import { UpdateClubProps } from "@navigation/navigationTypes";
import ClubForm from "./clubForm";
import { ClubFormFields } from "types/club.type";
import { FieldParams } from "types/form.type";
import { useRight } from "utils/rights";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export default function UpdateClubScreen({
  navigation,
  route,
}: UpdateClubProps) {
  const { clubId } = route.params;
  const { isAdmin, hasRight } = useRight();
  const { officeList } = useUnit($officeStore);
  const [loading, setLoading] = useState(false);
  const club = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.clubList.find((club) => club.id === clubId),
  });
  const office = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === club?.officeId),
  });

  useEffect(() => {
    if (!hasRight("OFFICE", "UPDATE", office?.id))
      navigation.navigate("homeContainer", { screen: "feed" });
  }, [hasRight, navigation, office?.id]);

  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));
  const { control, handleSubmit, setFocus } = useForm<ClubFormFields>({
    defaultValues: {
      name: club?.name,
      description: club?.description,
      office: { label: office?.name, value: office?.id },
      logoFile: club?.logoUrl,
      contact: club?.contact,
    },
  });
  if (!club) {
    return <></>;
  }

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
      await updateClub(data, clubId);
      notificationToast("success", "Club mis à jour.");
    } catch (e) {
      handleError(e);
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
