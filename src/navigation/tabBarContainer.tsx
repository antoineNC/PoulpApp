import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { Icon } from "react-native-paper";

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
import { feed, menu, trophy } from "components/icon/icons";

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
            <Icon source={feed} size={20} color={color} />
          ),
        }}
      />
      <TabBar.Screen
        name="officeContainer"
        component={OfficeNavigator}
        options={{
          title: "Bureaux",
          tabBarIcon: ({ color }) => (
            <Icon source="account-hard-hat" size={20} color={color} />
          ),
        }}
      />
      <TabBar.Screen
        name="famCupContainer"
        component={FamCupNavigator}
        options={{
          title: "Coupe des Familles",
          tabBarIcon: ({ color }) => (
            <Icon source={trophy} size={20} color={color} />
          ),
        }}
      />
      <TabBar.Screen
        name="menuContainer"
        component={MenuNavigator}
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Icon source={menu} size={20} color={color} />
          ),
        }}
      />
    </TabBar.Navigator>
  );
}
