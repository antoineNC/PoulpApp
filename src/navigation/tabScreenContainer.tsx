import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialBottomTabScreenProps } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import CalendarScreen from "@screens/home/calendar";
import HomeScreen from "@screens/home/home";
import { colors } from "theme";

type Props = MaterialBottomTabScreenProps<TabParamList>;
const Stack = createNativeStackNavigator();

export default function TabScreenContainer({ route }: Props) {
  const tabName = route.name;
  const renderScreens = (name: string) => {
    switch (name) {
      case "homeContainer":
        return (
          <>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{
                title: "Fil d'actualité",
                headerRight: ({ tintColor }) => (
                  <Pressable style={{ alignSelf: "center" }}>
                    <Ionicons
                      name="calendar-sharp"
                      size={30}
                      color={tintColor}
                    />
                  </Pressable>
                ),
              }}
            />
            <Stack.Screen name="calendar" component={CalendarScreen} />
          </>
        );
      case "officeContainer":
        return (
          <>
            <Stack.Screen
              name="offices"
              component={HomeScreen}
              options={{ title: "Bureaux" }}
            />
            <Stack.Screen name="updateOffice" component={CalendarScreen} />
          </>
        );
      case "famCupContainer":
        return (
          <>
            <Stack.Screen
              name="score"
              component={HomeScreen}
              options={{ title: "Tableau des scores" }}
            />
            <Stack.Screen name="feed" component={CalendarScreen} />
          </>
        );
      case "menuContainer":
        return (
          <>
            <Stack.Screen
              name="profile"
              component={HomeScreen}
              options={{ title: "Menu" }}
            />
            <Stack.Screen name="allSubs" component={CalendarScreen} />
          </>
        );
      default:
        return <Stack.Screen name="notFound" component={CalendarScreen} />;
    }
  };
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarTranslucent: true,
        headerTransparent: true,
        headerTintColor: colors.white,
        contentStyle: { backgroundColor: colors.primary },
      }}
    >
      {renderScreens(tabName)}
    </Stack.Navigator>
  );
}
