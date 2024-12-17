import { Timestamp } from "firebase/firestore";

export type FirestorePoint = {
  title: string;
  date: Timestamp;
  blue: number;
  yellow: number;
  orange: number;
  red: number;
  green: number;
};

export type Point = {
  id: string;
  title: string;
  date: Date;
  blue: number;
  yellow: number;
  orange: number;
  red: number;
  green: number;
};

export type PointsFormFields = {
  title: string;
  date: Date;
  blue: number;
  yellow: number;
  orange: number;
  red: number;
  green: number;
};
