import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
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
        options={{ title: "Accueil" }}
      />
      <MainTab.Screen
        name="officeContainer"
        component={HomeContainer}
        options={{ title: "Bureaux" }}
      />
      <MainTab.Screen
        name="famCupContainer"
        component={HomeContainer}
        options={{ title: "Coupe des Familles" }}
      />
      <MainTab.Screen
        name="menuContainer"
        component={HomeContainer}
        options={{ title: "Menu" }}
      />
    </MainTab.Navigator>
  );
}
