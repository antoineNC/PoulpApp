import React, { useState } from "react";
import { useStoreMap, useUnit } from "effector-react";

import { usePartnership } from "@firebase";
import { $sessionStore } from "@context/sessionStore";
import { $officeStore } from "@context/officeStore";
import { UpdatePartnershipProps } from "@navigation/navigationTypes";
import { FormFieldValues, PartnershipFieldNames } from "@types";
import PartnershipForm from "./partnershipForm";

export default function UpdatePartnershipScreen({
  navigation,
  route,
}: UpdatePartnershipProps) {
  const { partnershipId } = route.params;
  const { updatePartnership } = usePartnership();
  const { officeList } = useUnit($officeStore);
  const { role } = useUnit($sessionStore);
  const [loading, setLoading] = useState(false);
  const partnership = useStoreMap({
    store: $officeStore,
    keys: [partnershipId],
    fn: (officeStore) =>
      officeStore.partnershipList.find(
        (partner) => partner.id === partnershipId
      ),
  });
  if (!partnership) {
    return <></>;
  }
  const office = useStoreMap({
    store: $officeStore,
    keys: [partnershipId],
    fn: (officeStore) =>
      officeStore.officeList.find(
        (office) => office.id === partnership.officeId
      ),
  });
  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));

  const defaultValues = {
    ...partnership,
    office: { label: office?.name, value: office?.id },
    logoFile: partnership.logoUrl,
    benefits: partnership.benefits?.map((val) => ({
      value: val,
    })),
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
      await updatePartnership({ ...data }, partnershipId);
    } catch (e) {
      console.error("[updatepost]", e);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

  return (
    <PartnershipForm
      create={false}
      loading={loading}
      onSubmit={onSubmit}
      fieldItems={fields}
      defaultValues={defaultValues}
    />
  );
}
