import React, { useState } from "react";
import { useStoreMap, useUnit } from "effector-react";

import { usePartnership } from "@firebase";
import { $sessionStore } from "@context/sessionStore";
import { $officeStore } from "@context/officeStore";
import { CreatePartnershipProps } from "@navigation/navigationTypes";
import { FormFieldValues, PartnershipFieldNames } from "@types";
import PartnershipForm from "./partnershipForm";

export default function CreatePartnershipScreen({
  navigation,
  route,
}: CreatePartnershipProps) {
  const { officeId } = route.params;
  const { createPartnership } = usePartnership();
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

  const defaultValues = {
    office: { label: office?.name, value: office?.id },
  };

  const fields: FormFieldValues<PartnershipFieldNames> = [
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
      name: "address",
      label: "Adresse",
      type: "text",
    },
    {
      name: "addressMap",
      label: "Adresse (lien)",
      type: "text",
    },
    {
      name: "logoFile",
      label: "Logo :",
      type: "image",
    },
  ];

  if (role === "ADMIN_ROLE") {
    fields.unshift({
      name: "office",
      label: "Géré par",
      type: "select",
      required: true,
      options: { choices: officeChoices },
    });
  }

  const onSubmit = async (data: PartnershipFieldNames) => {
    try {
      setLoading(true);
      await createPartnership({ ...data });
    } catch (e) {
      console.error("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <PartnershipForm
      create
      defaultValues={defaultValues}
      fieldItems={fields}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
}
