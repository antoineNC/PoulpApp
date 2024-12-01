import {
  CompositeScreenProps,
  NavigatorScreenParams,
  ParamListBase,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialBottomTabScreenProps } from "react-native-paper";
import { Post } from "@types";
import { Timestamp } from "firebase/firestore";

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
  menuContainer: NavigatorScreenParams<MenuTabParamList>;
};
export type TabBarScreenProps<T extends keyof TabBarParamList> =
  MaterialBottomTabScreenProps<TabBarParamList, T>;

// === Home tab
export type HomeTabParamList = {
  feed: undefined;
  calendar: { postDate?: Timestamp };
  viewPost: { post: Post };
  createPost: undefined;
  updatePost: { post: Post };
};
export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;
export type FeedProps = HomeTabScreenProps<"feed">;
export type CalendarProps = HomeTabScreenProps<"calendar">;
export type ViewPostProps = HomeTabScreenProps<"viewPost">;
export type CreatePostProps = HomeTabScreenProps<"createPost">;
export type UpdatePostProps = HomeTabScreenProps<"updatePost">;

// === Office tab
export type OfficeTabParamList = {
  listOffice: undefined;
  viewOffice: { officeId: string };
  updateOffice: { officeId: string };
  updateMembers: { officeId: string };
  viewClub: { clubId: string };
  createClub: { officeId: string };
  updateClub: { clubId: string };
  viewPartnership: { partnershipId: string };
  createPartnership: { officeId: string };
  updatePartnership: { partnershipId: string };
};
export type OfficeTabScreenProps<T extends keyof OfficeTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<OfficeTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;
export type ListOfficeProps = OfficeTabScreenProps<"listOffice">;
export type ViewOfficeProps = OfficeTabScreenProps<"viewOffice">;
export type UpdateOfficeProps = OfficeTabScreenProps<"updateOffice">;
export type UpdateMembersProps = OfficeTabScreenProps<"updateMembers">;
export type ViewClubProps = OfficeTabScreenProps<"viewClub">;
export type CreateClubProps = OfficeTabScreenProps<"createClub">;
export type UpdateClubProps = OfficeTabScreenProps<"updateClub">;
export type ViewPartnershipProps = OfficeTabScreenProps<"viewPartnership">;
export type CreatePartnershipProps = OfficeTabScreenProps<"createPartnership">;
export type UpdatePartnershipProps = OfficeTabScreenProps<"updatePartnership">;

// === FamCup tab
export type FamCupTabParamList = {
  score: undefined;
  createScore: undefined;
  updateScore: { idPoint: string };
  feed: undefined;
};
export type FamCupTabScreenProps<T extends keyof FamCupTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<FamCupTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;

export type ScoreProps = FamCupTabScreenProps<"score">;
export type CreateScoreProps = FamCupTabScreenProps<"createScore">;
export type UpdateScoreProps = FamCupTabScreenProps<"updateScore">;

// === Menu tab
export type MenuTabParamList = {
  menu: undefined;
  calendar: undefined;
  listAdhesion: undefined;
  listAdherent: undefined;
  listClub: undefined;
  viewClub: { clubId: string };
  listPartnership: undefined;
  viewPartnership: { partnershipId: string };
};
export type MenuTabScreenProps<T extends keyof MenuTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MenuTabParamList, T>,
    TabBarScreenProps<keyof TabBarParamList>
  >;

export type MenuProps = MenuTabScreenProps<"menu">;
export type CalendarMenuProps = MenuTabScreenProps<"calendar">;
export type ListClubProps = MenuTabScreenProps<"listClub">;
export type ViewClubMenuProps = OfficeTabScreenProps<"viewClub">;
export type ListPartnershipProps = MenuTabScreenProps<"listPartnership">;
export type ViewPartnershipMenuProps = OfficeTabScreenProps<"viewPartnership">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabBarParamList {}
  }
}
