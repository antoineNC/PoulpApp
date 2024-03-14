import HomeScreen from "@screens/home";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

const MainTab = createMaterialBottomTabNavigator();

export default function TabBarContainer() {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="home" component={HomeScreen} />
      {/* <MainTab.Screen name="office" component={} />
            <MainTab.Screen name="famCup" component={} />
            <MainTab.Screen name="menu" component={} /> */}
    </MainTab.Navigator>
  );
}
