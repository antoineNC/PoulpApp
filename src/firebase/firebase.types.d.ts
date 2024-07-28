import { DocumentReference, Timestamp } from "firebase/firestore";

type fb_Partnership = {
  name: string;
  description: string;
  address: string;
  addressMap: string;
  advantages: string[];
  logo: string;
  office: string;
};

type fb_Point = {
  titre: string;
  date: Timestamp;
  bleu: number;
  jaune: number;
  orange: number;
  rouge: number;
  vert: number;
};
