import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  FamCupTabParamList,
  HomeTabParamList,
  MenuTabParamList,
  OfficeTabParamList,
  TabBarScreenProps,
} from "@navigation/navigation.types";
import HomeScreen from "@screens/home/home";
import CalendarScreen from "@screens/home/calendar";
import { ScoreScreen } from "@screens/famCup/score";
import { FeedScreen } from "@screens/famCup/feed";
import { OfficesScreen } from "@screens/office/offices";
import { ProfileScreen } from "@screens/menu/profile";
import { colors } from "theme";

const HomeStack = createNativeStackNavigator<HomeTabParamList>();
const OfficeStack = createNativeStackNavigator<OfficeTabParamList>();
const FamCupStack = createNativeStackNavigator<FamCupTabParamList>();
const MenuStack = createNativeStackNavigator<MenuTabParamList>();

const screenOptions = {
  statusBarTranslucent: true,
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.primary },
  headerShadowVisible: false,
  contentStyle: {
    flex: 1,
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
          headerRight: ({ tintColor }) => (
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() =>
                navigation.navigate("homeContainer", { screen: "calendar" })
              }
            >
              <Ionicons name="calendar-sharp" size={30} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
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
