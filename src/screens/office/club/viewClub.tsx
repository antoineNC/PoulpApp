import { ViewClubProps } from "@navigation/navigationTypes";
import ClubDisplay from "components/clubDisplay";

export default function ViewClubScreen({ navigation, route }: ViewClubProps) {
  const { clubId } = route.params;
  return (
    <ClubDisplay
      id={clubId}
      onPress={(officeId) => navigation.navigate("viewOffice", { officeId })}
    />
  );
}
