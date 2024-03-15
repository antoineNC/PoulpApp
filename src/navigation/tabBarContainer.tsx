import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeContainer from "@navigation/subStacks/homeContainer";
// import OfficeContainer from "@navigation/subStacks/officeContainer";
// import FamCupContainer from "@navigation/subStacks/famCupContainer";
// import MenuContainer from "@navigation/subStacks/menuContainer";

const MainTab = createMaterialBottomTabNavigator<TabParamList>();

export default function TabBarContainer() {
  return (
    <MainTab.Navigator>
      <MainTab.Screen
        name="homeContainer"
        component={HomeContainer}
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="officeContainer"
        component={HomeContainer}
        options={{
          title: "Bureaux",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="albums" size={20} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="famCupContainer"
        component={HomeContainer}
        options={{
          title: "Coupe des Familles",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="trophy" size={20} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name="menuContainer"
        component={HomeContainer}
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
