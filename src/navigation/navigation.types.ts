import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialBottomTabScreenProps } from "react-native-paper";

export type AuthParamList = {
  login: undefined;
  signup: undefined;
  forgotPassword: undefined;
};

export type TabBarParamList = {
  homeContainer: NavigatorScreenParams<HomeTabParamList>;
  officeContainer: undefined;
  famCupContainer: undefined;
  menuContainer: undefined;
};
export type TabBarScreenProps<T extends keyof TabBarParamList> =
  MaterialBottomTabScreenProps<TabBarParamList, T>;

// === Home tab
export type HomeTabParamList = {
  home: undefined;
  calendar: undefined;
};
export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;

// === Office tab
export type OfficeTabScreenProps<T extends keyof OfficeTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OfficeTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;
export type OfficeTabParamList = {
  offices: undefined;
  viewOffice: { office: Office };
  updateOffice: undefined;
};
export type ViewOfficeProps = MaterialBottomTabScreenProps<
  OfficeTabParamList,
  "viewOffice"
>;
export type OfficesProps = MaterialBottomTabScreenProps<
  OfficeTabParamList,
  "offices"
>;

// === FamCup tab
export type FamCupTabParamList = {
  score: undefined;
  feed: undefined;
};
export type FamCupTabScreenProps<T extends keyof FamCupTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<FamCupTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;

// === Menu tab
export type MenuTabParamList = {
  profile: undefined;
  allSubs: undefined;
};
export type MenuTabScreenProps<T extends keyof MenuTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MenuTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabBarParamList {}
  }
}
