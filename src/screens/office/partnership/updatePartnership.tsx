import React, { useEffect, useState } from "react";
import { useStoreMap, useUnit } from "effector-react";

import { $officeStore } from "@context/officeStore";
import { UpdatePartnershipProps } from "@navigation/navigationTypes";
import PartnershipForm from "./partnershipForm";
import { useRight } from "utils/rights";
import { PartnershipFormFields } from "types/partnership.type";
import { updatePartnership } from "@fb/service/partnership.service";
import { FieldParams } from "types/form.type";
import { handleError } from "utils/errorUtils";
import { notificationToast } from "utils/toast";

export default function UpdatePartnershipScreen({
  navigation,
  route,
}: UpdatePartnershipProps) {
  const { partnershipId } = route.params;
  const { isAdmin, hasRight } = useRight();
  const { officeList } = useUnit($officeStore);
  const [loading, setLoading] = useState(false);
  const partnership = useStoreMap({
    store: $officeStore,
    keys: [partnershipId],
    fn: (officeStore) =>
      officeStore.partnershipList.find(
        (partner) => partner.id === partnershipId
      ),
  });
  const office = useStoreMap({
    store: $officeStore,
    keys: [partnershipId],
    fn: (officeStore) =>
      officeStore.officeList.find(
        (office) => office.id === partnership?.officeId
      ),
  });

  useEffect(() => {
    if (!hasRight("OFFICE", "UPDATE", office?.id))
      navigation.navigate("homeContainer", { screen: "feed" });
  }, [hasRight, navigation, office?.id]);

  const officeChoices = officeList.map((office) => ({
    value: office.id,
    label: office.name,
  }));

  if (!partnership) {
    return <></>;
  }
  const defaultValues = {
    ...partnership,
    office: { label: office?.name, value: office?.id },
    logoFile: partnership.logoUrl,
    benefits: partnership.benefits?.map((val) => ({
      value: val,
    })),
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
      await updatePartnership(data, partnershipId);
      notificationToast("success", "Partenariat mis à jour.");
    } catch (e) {
      handleError(e);
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
