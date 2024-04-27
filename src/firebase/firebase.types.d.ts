import { DocumentReference, Timestamp } from "firebase/firestore";

type fb_Post = {
  title: string;
  description: string;
  editor: DocumentReference;
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
  office: DocumentReference;
};
