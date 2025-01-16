import React, { useState } from "react";
import { useStoreMap, useUnit } from "effector-react";

import { createPartnership } from "@fb/service/partnership.service";
import { $officeStore } from "@context/officeStore";
import { CreatePartnershipProps } from "@navigation/navigationTypes";
import PartnershipForm from "./partnershipForm";
import { PartnershipFormFields } from "types/partnership.type";
import { FieldParams } from "types/form.type";
import { useRight } from "utils/rights";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export default function CreatePartnershipScreen({
  navigation,
  route,
}: CreatePartnershipProps) {
  const { officeId } = route.params;
  const { isAdmin } = useRight();
  const { officeList } = useUnit($officeStore);
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

  const fields: FieldParams<PartnershipFormFields>[] = [
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

  if (isAdmin) {
    fields.unshift({
      name: "office",
      label: "Géré par",
      type: "select",
      required: true,
      options: { choices: officeChoices },
    });
  }

  const onSubmit = async (data: PartnershipFormFields) => {
    try {
      setLoading(true);
      await createPartnership(data);
      notificationToast("success", "Partenariat créé avec succès.");
    } catch (e) {
      handleError(e);
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
