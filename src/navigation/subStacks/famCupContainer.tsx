import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "@screens/calendar";
import HomeScreen from "@screens/home";
const Stack = createNativeStackNavigator();
export default function FamCupContainer() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="score" component={HomeScreen} />
      <Stack.Screen name="feed" component={CalendarScreen} />
    </Stack.Navigator>
  );
}
