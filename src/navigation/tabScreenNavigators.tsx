import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  FamCupTabParamList,
  HomeTabParamList,
  MenuTabParamList,
  OfficeTabParamList,
  TabBarScreenProps,
} from "@navigation/navigationTypes";
import HomeScreen from "@screens/home/home";
import ViewPostScreen from "@screens/home/viewPost";
import UpdatePostScreen from "@screens/home/updatePost";
import CalendarScreen from "@screens/home/calendar";
import { ScoreScreen } from "@screens/famCup/score";
import { FeedScreen } from "@screens/famCup/feed";
import OfficesScreen from "@screens/office/offices";
import ViewOfficeScreen from "@screens/office/viewOffice";
import { ProfileScreen } from "@screens/menu/profile";
import { colors } from "@theme";
import { Image, Row, Text, Title2 } from "@styledComponents";

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
      <HomeStack.Screen
        name="viewPost"
        component={ViewPostScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <Row>
              <Title2>{route.params.post.title}</Title2>
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
      <HomeStack.Screen name="calendar" component={CalendarScreen} />
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
          headerTitle: () => (
            <Row>
              <Image $size={45} source={{ uri: route.params.office.logoUrl }} />
              <Title2>{route.params.office.name}</Title2>
            </Row>
          ),
        })}
      />
      <OfficeStack.Screen name="updateOffice" component={CalendarScreen} />
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
      <MenuStack.Screen name="allSubs" component={CalendarScreen} />
    </MenuStack.Navigator>
  );
}
