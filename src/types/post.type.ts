import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  title: string;
  editorId: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  date?: {
    start: Date;
    end: Date;
  };
};

export type FirestorePost = {
  title: string;
  createdAt: Timestamp;
  editorId: string;
  description?: string;
  imageId?: string;
  tags?: string[];
  date?: {
    start: Timestamp;
    end: Timestamp;
  };
};

export type CreatePostFields = FirestorePost;

export type UpdatePostFields = {
  title?: string;
  editorId?: string;
  description?: string;
  imageId?: string;
  tags?: string[];
  date?: {
    start: Timestamp;
    end: Timestamp;
  };
};

export type PostFormFields = {
  title: string;
  description?: string;
  date?: { start: Date; end: Date };
  tags: string[];
  editor: { value: string; label: string };
  imageFile?: string;
};

export type PostItemProps = {
  post: Post;
  onPressOffice: (officeId: string) => void;
  onPressCalendar: () => void;
  onPressUpdate: () => void;
  onPressDelete: () => void;
};
