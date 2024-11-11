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
import HomeScreen from "@screens/home/home";
// import ViewPostScreen from "@screens/home/viewPost";
import CreatePostScreen from "@screens/home/post/createPost";
import UpdatePostScreen from "@screens/home/post/updatePost";
// import CalendarScreen from "@screens/home/calendar";
import { ScoreScreen } from "@screens/famCup/score";
import { FeedScreen } from "@screens/famCup/feed";
import OfficesScreen from "@screens/office/offices";
import ViewOfficeScreen from "@screens/office/viewOffice";
import UpdateOfficeScreen from "@screens/office/updateOffice";
import UpdateClubScreen from "@screens/office/updateClub";
import UpdatePartnershipScreen from "@screens/office/updatePartnership";
import { ProfileScreen } from "@screens/menu/profile";
import { colors } from "@theme";
import { Image, Row, Title2 } from "@styledComponents";
import { $officeStore } from "@context/officeStore";

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
        component={HomeScreen}
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
        name="offices"
        component={OfficesScreen}
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
        options={({ route }) => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
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
        name="updateClub"
        component={UpdateClubScreen}
        options={({ route }) => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
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
                <Image $size={45} source={{ uri: club?.logoUrl }} />
                <Title2>{club?.name}</Title2>
              </Row>
            );
          },
        })}
      />
      <OfficeStack.Screen
        name="updatePartnership"
        component={UpdatePartnershipScreen}
        options={({ route }) => ({
          contentStyle: {
            backgroundColor: colors.secondary,
          },
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
                <Image $size={45} source={{ uri: partner?.logoUrl }} />
                <Title2>{partner?.name}</Title2>
              </Row>
            );
          },
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
      <FamCupStack.Screen name="feed" component={FeedScreen} />
    </FamCupStack.Navigator>
  );
}

export function MenuNavigator() {
  return (
    <MenuStack.Navigator screenOptions={screenOptions}>
      <MenuStack.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: "Menu" }}
      />
      {/* <MenuStack.Screen name="allSubs" component={CalendarScreen} /> */}
    </MenuStack.Navigator>
  );
}
