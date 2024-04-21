import { DocumentReference, Timestamp } from "firebase/firestore";

export type fb_Post = {
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
