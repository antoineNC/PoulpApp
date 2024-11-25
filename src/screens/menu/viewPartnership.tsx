import { ViewPartnershipMenuProps } from "@navigation/navigationTypes";
import PartnershipDisplay from "components/partnershipDisplay";

export default function ViewPartnershipMenuScreen({
  navigation,
  route,
}: ViewPartnershipMenuProps) {
  const { partnershipId } = route.params;
  return (
    <PartnershipDisplay
      id={partnershipId}
      onPress={(officeId) => navigation.navigate("viewOffice", { officeId })}
    />
  );
}
