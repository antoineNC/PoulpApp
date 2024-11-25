import { ViewClubMenuProps } from "@navigation/navigationTypes";
import ClubDisplay from "components/clubDisplay";

export default function ViewClubMenuScreen({
  navigation,
  route,
}: ViewClubMenuProps) {
  const { clubId } = route.params;
  return (
    <ClubDisplay
      id={clubId}
      onPress={(officeId) => navigation.navigate("viewOffice", { officeId })}
    />
  );
}
