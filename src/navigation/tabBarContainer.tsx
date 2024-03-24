import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

import TabScreenContainer from "@navigation/tabScreenContainer";

const MainTab = createMaterialBottomTabNavigator<TabParamList>();

export default function TabBarContainer() {
  return (
    <MainTab.Navigator>
      <MainTab.Screen
        name="homeContainer"
        component={TabScreenContainer}
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="officeContainer"
        component={TabScreenContainer}
        options={{
          title: "Bureaux",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="albums" size={20} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="famCupContainer"
        component={TabScreenContainer}
        options={{
          title: "Coupe des Familles",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="trophy" size={20} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="menuContainer"
        component={TabScreenContainer}
        options={{
          title: "Menu",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="menu" size={20} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}
