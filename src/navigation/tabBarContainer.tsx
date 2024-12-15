import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  FamCupNavigator,
  HomeNavigator,
  MenuNavigator,
  OfficeNavigator,
} from "@navigation/tabScreenNavigators";
import { TabBarParamList } from "@navigation/navigationTypes";
import { useSubOffice, useSubRoleOffice } from "hooks/office";
import { useSubClub } from "hooks/club";
import { useSubPartnership } from "hooks/partnership";
import { useSubPoint } from "hooks/point";
import { useSubStudent } from "hooks/student";
import { useCalendar } from "hooks/calendar";

const TabBar = createMaterialBottomTabNavigator<TabBarParamList>();

export default function TabBarContainer() {
  useSubOffice();
  useSubRoleOffice();
  useSubClub();
  useSubPartnership();
  useSubPoint();
  useSubStudent();
  useCalendar();
  return (
    <TabBar.Navigator>
      <TabBar.Screen
        name="homeContainer"
        component={HomeNavigator}
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <TabBar.Screen
        name="officeContainer"
        component={OfficeNavigator}
        options={{
          title: "Bureaux",
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums" size={20} color={color} />
          ),
        }}
      />
      <TabBar.Screen
        name="famCupContainer"
        component={FamCupNavigator}
        options={{
          title: "Coupe des Familles",
          tabBarIcon: ({ color }) => (
            <Ionicons name="trophy" size={20} color={color} />
          ),
        }}
      />
      <TabBar.Screen
        name="menuContainer"
        component={MenuNavigator}
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Ionicons name="menu" size={20} color={color} />
          ),
        }}
      />
    </TabBar.Navigator>
  );
}
