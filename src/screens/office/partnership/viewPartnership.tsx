import { ViewPartnershipProps } from "@navigation/navigationTypes";
import PartnershipDisplay from "components/partnershipDisplay";

export default function ViewPartnershipScreen({
  navigation,
  route,
}: ViewPartnershipProps) {
  const { partnershipId } = route.params;
  return (
    <PartnershipDisplay
      id={partnershipId}
      onPress={(officeId) => navigation.navigate("viewOffice", { officeId })}
    />
  );
}
