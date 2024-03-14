import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "@screens/calendar";
import HomeScreen from "@screens/home";
const Stack = createNativeStackNavigator();
export default function HomeContainer() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
}
