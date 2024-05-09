import { DocumentReference, Timestamp } from "firebase/firestore";

type fb_Student = {
  mail: string;
  role: string;
  lastName: string;
  firstName: string;
  adhesion: string[];
};

type fb_Office = {
  mail: string;
  role: string;
  name: string;
  acronym: string;
  description: string;
  role: string;
  members: {
    idStudent: string;
    nameStudent: string;
    idRole: string;
    nameRole: string;
  }[];
  clubs: string[];
  partnerships: string[];
};

type fb_Post = {
  title: string;
  description: string;
  editor: string;
  image: string;
  tags: Array<string>;
  createdAt: Timestamp;
  visibleCal: boolean;
  date: {
    start?: Timestamp;
    end?: Timestamp;
  };
};

type fb_Club = {
  name: string;
  description: string;
  contact: string;
  logo: string;
  office: string;
};

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
