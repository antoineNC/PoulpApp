import { DocumentReference, Timestamp } from "firebase/firestore";

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

type fb_Office = {
  mail: string;
  role: string;
  name: string;
  acronym: string;
  description: string;
  role: string;
  members: string[];
  clubs: string[];
  partnerships: string[];
};

type fb_Club = {
  name: string;
  description: string;
  contact: string;
  logo: string;
  office: DocumentReference;
};
