export type Student = {
  id: string;
  mail: string;
  lastName: string;
  firstName: string;
  adhesion?: string[];
};

export type FirestoreStudent = {
  mail: string;
  lastName: string;
  firstName: string;
  adhesion?: string[];
};

export type CreateStudentArgs = {
  firstName: string;
  lastName: string;
  mail: string;
};
