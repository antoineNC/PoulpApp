import {
  CompositeScreenProps,
  NavigatorScreenParams,
  ParamListBase,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Post } from "@types";
import { MaterialBottomTabScreenProps } from "react-native-paper";

export type ScreenProps<
  T extends ParamListBase,
  screen extends keyof T = keyof T
> = MaterialBottomTabScreenProps<T, screen>;

// === Auth / Connexion
export type AuthParamList = {
  login: undefined;
  signup: undefined;
  forgotPassword: undefined;
};

// === TabBar
export type TabBarParamList = {
  homeContainer: NavigatorScreenParams<HomeTabParamList>;
  officeContainer: NavigatorScreenParams<OfficeTabParamList>;
  famCupContainer: undefined;
  menuContainer: undefined;
};
export type TabBarScreenProps<T extends keyof TabBarParamList> =
  MaterialBottomTabScreenProps<TabBarParamList, T>;

// === Home tab
export type HomeTabParamList = {
  home: undefined;
  viewPost: { post: Post };
  createPost: undefined;
  updatePost: { post: Post };
  calendar: undefined;
};
export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;
export type HomeProps = HomeTabScreenProps<"home">;
export type ViewPostProps = HomeTabScreenProps<"viewPost">;
export type CreatePostProps = HomeTabScreenProps<"createPost">;
export type UpdatePostProps = HomeTabScreenProps<"updatePost">;

// === Office tab
export type OfficeTabParamList = {
  offices: undefined;
  viewOffice: { officeId: string };
  updateOffice: { officeId: string };
  updateMembers: { officeId: string };
  updateClub: { clubId: string };
  updatePartnership: { partnershipId: string };
};
export type OfficeTabScreenProps<T extends keyof OfficeTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OfficeTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;
export type OfficesProps = OfficeTabScreenProps<"offices">;
export type ViewOfficeProps = OfficeTabScreenProps<"viewOffice">;
export type UpdateOfficeProps = OfficeTabScreenProps<"updateOffice">;
export type UpdateMembersProps = OfficeTabScreenProps<"updateMembers">;
export type UpdateClubProps = OfficeTabScreenProps<"updateClub">;
export type UpdatePartnershipProps = OfficeTabScreenProps<"updatePartnership">;

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
