import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import { Image, Row, Title2 } from "@styledComponents";
import { $officeStore } from "@context/officeStore";
import { getCalendarItems } from "@fb/service/post.service";
import { actionCalendar } from "@context/calendar.store";
import { HeaderText } from "components/customText";

const HomeStack = createNativeStackNavigator<HomeTabParamList>();
const OfficeStack = createNativeStackNavigator<OfficeTabParamList>();
const FamCupStack = createNativeStackNavigator<FamCupTabParamList>();
const MenuStack = createNativeStackNavigator<MenuTabParamList>();

const screenOptions = {
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
  <Row>
    {logoUrl && (
      <Image style={{ borderRadius: 5 }} $size={45} source={{ uri: logoUrl }} />
    )}
    <Title2>{name}</Title2>
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
        options={() => ({
          headerTitle: ({ tintColor }) => (
            <Row>
              <HeaderText>Création d'un post</HeaderText>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
      />
      <HomeStack.Screen
        name="updatePost"
        component={UpdatePostScreen}
        options={() => ({
          headerTitle: ({ tintColor }) => (
            <Row>
              <HeaderText>Modification du post</HeaderText>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

export function OfficeNavigator() {
  return (
    <OfficeStack.Navigator screenOptions={screenOptions}>
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
        options={() => ({
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          headerTitle: ({ tintColor }) => (
            <Row>
              <Title2>Modification du bureau</Title2>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
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
        options={() => ({
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          headerTitle: ({ tintColor }) => (
            <Row>
              <Title2>Création d'un club</Title2>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen
        name="updateClub"
        component={UpdateClubScreen}
        options={() => ({
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          headerTitle: ({ tintColor }) => (
            <Row>
              <Title2>Modification du club</Title2>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
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
        options={() => ({
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          headerTitle: ({ tintColor }) => (
            <Row>
              <Title2>Création d'un partenariat</Title2>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen
        name="updatePartnership"
        component={UpdatePartnershipScreen}
        options={() => ({
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          headerTitle: ({ tintColor }) => (
            <Row>
              <Title2>Modification du partenariat</Title2>
              <IconButton icon="pencil" iconColor={tintColor} size={25} />
            </Row>
          ),
        })}
      />
    </OfficeStack.Navigator>
  );
}

export function FamCupNavigator() {
  return (
    <FamCupStack.Navigator screenOptions={screenOptions}>
      <FamCupStack.Screen
        name="score"
        component={ScoreScreen}
        options={{ title: "Tableau des scores" }}
      />
      <FamCupStack.Screen
        name="createScore"
        component={CreateScoreScreen}
        options={{
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          title: "Ajouter des points",
        }}
      />
      <FamCupStack.Screen
        name="updateScore"
        component={UpdateScoreScreen}
        options={{
          contentStyle: {
            // backgroundColor: colors.secondary,
          },
          title: "Modifier les points",
        }}
      />
    </FamCupStack.Navigator>
  );
}

export function MenuNavigator() {
  return (
    <MenuStack.Navigator screenOptions={screenOptions}>
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
