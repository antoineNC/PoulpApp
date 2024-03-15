import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "@screens/home/calendar";
import HomeScreen from "@screens/home/home";
import { colors } from "theme";
import { MaterialBottomTabScreenProps } from "react-native-paper";

type Props = MaterialBottomTabScreenProps<TabParamList>;
const Stack = createNativeStackNavigator();

export default function HomeContainer({ route }: Props) {
  const tabName = route.name;
  const renderScreens = (name: string) => {
    switch (name) {
      case "homeContainer":
        return (
          <>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ title: "Fil d'actualité" }}
            />
            <Stack.Screen name="calendar" component={CalendarScreen} />
          </>
        );
      case "officeContainer":
        return (
          <>
            <Stack.Screen name="office" component={HomeScreen} />
            <Stack.Screen name="updateOffice" component={CalendarScreen} />
          </>
        );
      case "famCupContainer":
        return (
          <>
            <Stack.Screen name="score" component={HomeScreen} />
            <Stack.Screen name="feed" component={CalendarScreen} />
          </>
        );
      case "menuContainer":
        return (
          <>
            <Stack.Screen name="profile" component={HomeScreen} />
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
