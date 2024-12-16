import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { IconButton, useTheme } from "react-native-paper";
import { useStoreMap } from "effector-react";

import {
  FamCupTabParamList,
  HomeTabParamList,
  MenuTabParamList,
  OfficeTabParamList,
  TabBarScreenProps,
} from "@navigation/navigationTypes";
import FeedScreen from "@screens/home/feed";
import CalendarScreen from "@screens/home/calendar";
import CreatePostScreen from "@screens/home/post/createPost";
import UpdatePostScreen from "@screens/home/post/updatePost";
import ListOfficeScreen from "@screens/office/listOffice";
import ViewOfficeScreen from "@screens/office/viewOffice";
import UpdateOfficeScreen from "@screens/office/updateOffice";
import UpdateClubScreen from "@screens/office/club/updateClub";
import CreateClubScreen from "@screens/office/club/createClub";
import ViewClubScreen from "@screens/office/club/viewClub";
import UpdatePartnershipScreen from "@screens/office/partnership/updatePartnership";
import CreatePartnershipScreen from "@screens/office/partnership/createPartnership";
import ViewPartnershipScreen from "@screens/office/partnership/viewPartnership";
import ScoreScreen from "@screens/famCup/score";
import CreateScoreScreen from "@screens/famCup/createScore";
import UpdateScoreScreen from "@screens/famCup/updateScore";
import MenuScreen from "@screens/menu/menu";
import CalendarMenuScreen from "@screens/menu/calendar";
import ListAdhesion from "@screens/menu/listAdhesion";
import ListAdherent from "@screens/menu/listAdherent";
import ListClubScreen from "@screens/menu/listClub";
import ViewClubMenuScreen from "@screens/menu/viewClub";
import ListPartnershipScreen from "@screens/menu/listPartnership";
import ViewPartnershipMenuScreen from "@screens/menu/viewPartnership";
import NotificationScreen from "@screens/menu/notification";
import { Image, Row } from "@styledComponents";
import { $officeStore } from "@context/officeStore";
import { getCalendarItems } from "@fb/service/post.service";
import { actionCalendar } from "@context/calendar.store";
import { TitleText } from "components/customText";

const HomeStack = createNativeStackNavigator<HomeTabParamList>();
const OfficeStack = createNativeStackNavigator<OfficeTabParamList>();
const FamCupStack = createNativeStackNavigator<FamCupTabParamList>();
const MenuStack = createNativeStackNavigator<MenuTabParamList>();

const screenOptions: NativeStackNavigationOptions = {
  statusBarTranslucent: true,
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

const TitleComponent = ({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string;
}) => (
  <Row style={{ columnGap: 10 }}>
    {logoUrl && (
      <Image style={{ borderRadius: 5 }} $size={45} source={{ uri: logoUrl }} />
    )}
    <TitleText>{name}</TitleText>
  </Row>
);

const OfficeHeaderTitle = ({ officeId }: { officeId: string }) => {
  const office = useStoreMap({
    store: $officeStore,
    keys: [officeId],
    fn: (officeStore) =>
      officeStore.officeList.find((office) => office.id === officeId),
  });
  return (
    office && <TitleComponent name={office.name} logoUrl={office.logoUrl} />
  );
};

const ClubHeaderTitle = ({ clubId }: { clubId: string }) => {
  const club = useStoreMap({
    store: $officeStore,
    keys: [clubId],
    fn: (officeStore) =>
      officeStore.clubList.find((club) => club.id === clubId),
  });
  return club && <TitleComponent name={club.name} logoUrl={club.logoUrl} />;
};

const PartnerHeaderTitle = ({ partnerId }: { partnerId: string }) => {
  const partner = useStoreMap({
    store: $officeStore,
    keys: [partnerId],
    fn: (officeStore) =>
      officeStore.partnershipList.find((partner) => partner.id === partnerId),
  });
  return (
    partner && <TitleComponent name={partner.name} logoUrl={partner.logoUrl} />
  );
};

export function HomeNavigator({
  navigation,
}: TabBarScreenProps<"homeContainer">) {
  const { colors } = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { backgroundColor: colors.background },
      }}
      initialRouteName="feed"
    >
      <HomeStack.Screen
        name="feed"
        component={FeedScreen}
        options={() => ({
          title: "Fil d'actualité",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="calendar-month-outline"
              size={30}
              iconColor={tintColor}
              onPress={() =>
                navigation.navigate("homeContainer", {
                  screen: "calendar",
                  params: {},
                })
              }
            />
          ),
        })}
      />
      <HomeStack.Screen
        name="calendar"
        component={CalendarScreen}
        options={{
          title: "Calendrier",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon={"sync"}
              size={30}
              iconColor={tintColor}
              onPress={async () => {
                const items = await getCalendarItems();
                actionCalendar.setItems(items);
              }}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="createPost"
        component={CreatePostScreen}
        options={{ title: "Création d'un post" }}
      />
      <HomeStack.Screen
        name="updatePost"
        component={UpdatePostScreen}
        options={{ title: "Modification du post" }}
      />
    </HomeStack.Navigator>
  );
}

export function OfficeNavigator() {
  const { colors } = useTheme();
  return (
    <OfficeStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <OfficeStack.Screen
        name="listOffice"
        component={ListOfficeScreen}
        options={{ title: "Bureaux" }}
      />
      <OfficeStack.Screen
        name="viewOffice"
        component={ViewOfficeScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <OfficeHeaderTitle officeId={route.params.officeId} />
          ),
        })}
      />
      <OfficeStack.Screen
        name="updateOffice"
        component={UpdateOfficeScreen}
        options={{ title: "Modification du bureau" }}
      />
      <OfficeStack.Screen
        name="viewClub"
        component={ViewClubScreen}
        options={({ route }) => ({
          headerTitle: () => <ClubHeaderTitle clubId={route.params.clubId} />,
        })}
      />
      <OfficeStack.Screen
        name="createClub"
        component={CreateClubScreen}
        options={{ title: "Création d'un club" }}
      />
      <OfficeStack.Screen
        name="updateClub"
        component={UpdateClubScreen}
        options={{ title: "Modification du club" }}
      />
      <OfficeStack.Screen
        name="viewPartnership"
        component={ViewPartnershipScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <PartnerHeaderTitle partnerId={route.params.partnershipId} />
          ),
        })}
      />
      <OfficeStack.Screen
        name="createPartnership"
        component={CreatePartnershipScreen}
        options={{ title: "Création d'un partenariat" }}
      />
      <OfficeStack.Screen
        name="updatePartnership"
        component={UpdatePartnershipScreen}
        options={{ title: "Modification du partenariat" }}
      />
    </OfficeStack.Navigator>
  );
}

export function FamCupNavigator() {
  const { colors } = useTheme();
  return (
    <FamCupStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <FamCupStack.Screen
        name="score"
        component={ScoreScreen}
        options={{ title: "Tableau des scores" }}
      />
      <FamCupStack.Screen
        name="createScore"
        component={CreateScoreScreen}
        options={{ title: "Ajouter des points" }}
      />
      <FamCupStack.Screen
        name="updateScore"
        component={UpdateScoreScreen}
        options={{ title: "Modifier les points" }}
      />
    </FamCupStack.Navigator>
  );
}

export function MenuNavigator() {
  const { colors } = useTheme();
  return (
    <MenuStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: { backgroundColor: colors.background },
      }}
    >
      <MenuStack.Screen
        name="menu"
        component={MenuScreen}
        options={{ title: "Menu" }}
      />
      <MenuStack.Screen
        name="listAdhesion"
        component={ListAdhesion}
        options={{ title: "Mes adhésions" }}
      />
      <MenuStack.Screen
        name="listAdherent"
        component={ListAdherent}
        options={{ title: "Mes adhérent.es" }}
      />
      <MenuStack.Screen
        name="calendar"
        component={CalendarMenuScreen}
        options={{ title: "Calendrier" }}
      />
      <MenuStack.Screen
        name="listClub"
        component={ListClubScreen}
        options={{ title: "Liste des clubs" }}
      />
      <MenuStack.Screen
        name="viewClub"
        component={ViewClubMenuScreen}
        options={({ route }) => ({
          headerTitle: () => <ClubHeaderTitle clubId={route.params.clubId} />,
        })}
      />
      <MenuStack.Screen
        name="listPartnership"
        component={ListPartnershipScreen}
        options={{ title: "Liste des partenariats" }}
      />
      <MenuStack.Screen
        name="viewPartnership"
        component={ViewPartnershipMenuScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <PartnerHeaderTitle partnerId={route.params.partnershipId} />
          ),
        })}
      />
      <MenuStack.Screen
        name="notification"
        component={NotificationScreen}
        options={{ title: "Notifications" }}
      />
    </MenuStack.Navigator>
  );
}
