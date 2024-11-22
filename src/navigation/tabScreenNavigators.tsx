import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton } from "react-native-paper";
import { useStoreMap } from "effector-react";

import {
  FamCupTabParamList,
  HomeTabParamList,
  MenuTabParamList,
  OfficeTabParamList,
  TabBarScreenProps,
} from "@navigation/navigationTypes";
import FeedScreen from "@screens/home/feed";
import CreatePostScreen from "@screens/home/post/createPost";
import UpdatePostScreen from "@screens/home/post/updatePost";
// import CalendarScreen from "@screens/home/calendar";
import { ScoreScreen } from "@screens/famCup/score";
import ListOfficeScreen from "@screens/office/listOffice";
import ViewOfficeScreen from "@screens/office/viewOffice";
import UpdateOfficeScreen from "@screens/office/updateOffice";
import UpdateClubScreen from "@screens/office/club/updateClub";
import UpdatePartnershipScreen from "@screens/office/partnership/updatePartnership";
import CreateClubScreen from "@screens/office/club/createClub";
import CreatePartnershipScreen from "@screens/office/partnership/createPartnership";
import { ProfileScreen } from "@screens/menu/profile";
import { colors } from "@theme";
import { Image, Row, Title2 } from "@styledComponents";
import { $officeStore } from "@context/officeStore";
import ViewClubScreen from "@screens/office/club/viewClub";
import ViewPartnershipScreen from "@screens/office/partnership/viewPartnership";
import MenuScreen from "@screens/menu/menu";
import ListClubScreen from "@screens/menu/listClub";
import ViewClubMenuScreen from "@screens/menu/viewClub";
import ListPartnershipScreen from "@screens/menu/listPartnership";
import ViewPartnershipMenuScreen from "@screens/menu/viewPartnership";

const HomeStack = createNativeStackNavigator<HomeTabParamList>();
const OfficeStack = createNativeStackNavigator<OfficeTabParamList>();
const FamCupStack = createNativeStackNavigator<FamCupTabParamList>();
const MenuStack = createNativeStackNavigator<MenuTabParamList>();

const screenOptions = {
  statusBarTranslucent: true,
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.primary },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: colors.primary,
  },
};

export function HomeNavigator({
  navigation,
}: TabBarScreenProps<"homeContainer">) {
  return (
    <HomeStack.Navigator screenOptions={screenOptions} initialRouteName="home">
      <HomeStack.Screen
        name="home"
        component={FeedScreen}
        options={{
          title: "Fil d'actualité",
          // headerRight: ({ tintColor }) => (
          //   <TouchableOpacity
          //     style={{ alignSelf: "center" }}
          //     onPress={() =>
          //       navigation.navigate("homeContainer", { screen: "calendar" })
          //     }
          //   >
          //     <Ionicons name="calendar-sharp" size={30} color={tintColor} />
          //   </TouchableOpacity>
          // ),
        }}
      />
      {/* <HomeStack.Screen
        name="viewPost"
        component={ViewPostScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <Row>
              <Title2>{route.params.post.title}</Title2>
            </Row>
          ),
        })}
      /> */}
      <HomeStack.Screen
        name="createPost"
        component={CreatePostScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Création d'un post</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
            </Row>
          ),
        })}
      />
      <HomeStack.Screen
        name="updatePost"
        component={UpdatePostScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Modification du post</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
            </Row>
          ),
        })}
      />
      {/* <HomeStack.Screen name="calendar" component={CalendarScreen} /> */}
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
          headerTitle: () => {
            const office = useStoreMap({
              store: $officeStore,
              keys: [route.params.officeId],
              fn: (officeStore) =>
                officeStore.officeList.find(
                  (office) => office.id === route.params.officeId
                ),
            });
            return (
              <Row>
                <Image $size={45} source={{ uri: office?.logoUrl }} />
                <Title2>{office?.name}</Title2>
              </Row>
            );
          },
        })}
      />
      <OfficeStack.Screen
        name="updateOffice"
        component={UpdateOfficeScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Modification du bureau</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen
        name="viewClub"
        component={ViewClubScreen}
        options={({ route }) => ({
          headerTitle: () => {
            const club = useStoreMap({
              store: $officeStore,
              keys: [route.params.clubId],
              fn: (officeStore) =>
                officeStore.clubList.find(
                  (club) => club.id === route.params.clubId
                ),
            });
            return (
              <Row>
                {club?.logoUrl && (
                  <Image
                    style={{ borderRadius: 5 }}
                    $size={45}
                    source={{ uri: club.logoUrl }}
                  />
                )}
                <Title2>{club?.name}</Title2>
              </Row>
            );
          },
        })}
      />
      <OfficeStack.Screen
        name="createClub"
        component={CreateClubScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Création d'un club</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen
        name="updateClub"
        component={UpdateClubScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Modification du club</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen
        name="viewPartnership"
        component={ViewPartnershipScreen}
        options={({ route }) => ({
          headerTitle: () => {
            const partner = useStoreMap({
              store: $officeStore,
              keys: [route.params.partnershipId],
              fn: (officeStore) =>
                officeStore.partnershipList.find(
                  (partner) => partner.id === route.params.partnershipId
                ),
            });
            return (
              <Row>
                {partner?.logoUrl && (
                  <Image
                    style={{ borderRadius: 5 }}
                    $size={45}
                    source={{ uri: partner.logoUrl }}
                  />
                )}
                <Title2>{partner?.name}</Title2>
              </Row>
            );
          },
        })}
      />
      <OfficeStack.Screen
        name="createPartnership"
        component={CreatePartnershipScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Création d'un partenariat</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen
        name="updatePartnership"
        component={UpdatePartnershipScreen}
        options={() => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
          headerTitle: () => (
            <Row>
              <Title2>Modification du partenariat</Title2>
              <IconButton icon="pencil" iconColor={colors.white} size={25} />
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
        name="listClub"
        component={ListClubScreen}
        options={{ title: "Liste des clubs" }}
      />
      <MenuStack.Screen
        name="viewClub"
        component={ViewClubMenuScreen}
        options={({ route }) => ({
          headerTitle: () => {
            const club = useStoreMap({
              store: $officeStore,
              keys: [route.params.clubId],
              fn: (officeStore) =>
                officeStore.clubList.find(
                  (club) => club.id === route.params.clubId
                ),
            });
            return (
              <Row>
                {club?.logoUrl && (
                  <Image
                    style={{ borderRadius: 5 }}
                    $size={45}
                    source={{ uri: club.logoUrl }}
                  />
                )}
                <Title2>{club?.name}</Title2>
              </Row>
            );
          },
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
          headerTitle: () => {
            const partner = useStoreMap({
              store: $officeStore,
              keys: [route.params.partnershipId],
              fn: (officeStore) =>
                officeStore.partnershipList.find(
                  (partner) => partner.id === route.params.partnershipId
                ),
            });
            return (
              <Row>
                {partner?.logoUrl && (
                  <Image
                    style={{ borderRadius: 5 }}
                    $size={45}
                    source={{ uri: partner.logoUrl }}
                  />
                )}
                <Title2>{partner?.name}</Title2>
              </Row>
            );
          },
        })}
      />
    </MenuStack.Navigator>
  );
}
