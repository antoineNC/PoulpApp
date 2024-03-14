import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "@screens/calendar";
import HomeScreen from "@screens/home";
const Stack = createNativeStackNavigator();
export default function MenuContainer() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="profile" component={HomeScreen} />
      <Stack.Screen name="allSubs" component={CalendarScreen} />
    </Stack.Navigator>
  );
}