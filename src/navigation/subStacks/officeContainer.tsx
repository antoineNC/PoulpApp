import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalendarScreen from "@screens/home/calendar";
import HomeScreen from "@screens/home/home";
const Stack = createNativeStackNavigator();
export default function OfficeContainer() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="office" component={HomeScreen} />
      <Stack.Screen name="updateOffice" component={CalendarScreen} />
    </Stack.Navigator>
  );
}
