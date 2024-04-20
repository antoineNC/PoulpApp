import { DocumentReference, Timestamp } from "firebase/firestore";

export type fb_Post = {
  title: string;
  description: string;
  editor: DocumentReference;
  image: string;
  tags: Array<string>;
  timeStamp: Timestamp;
  visibleCal: boolean;
  date: {
    startDay?: string;
    startHour?: string;
    endDay?: string;
    endHour?: string;
  };
};
