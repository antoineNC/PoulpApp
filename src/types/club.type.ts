export type Club = {
  id: string;
  name: string;
  officeId: string;
  description?: string;
  contact?: string;
  logoUrl?: string;
};

export type FirestoreClub = {
  name: string;
  officeId: string;
  description?: string;
  contact?: string;
  logoId?: string;
};

export type CreateClubFields = FirestoreClub;

export type UpdateClubFields = {
  name?: string;
  officeId?: string;
  description?: string;
  contact?: string;
  logoId?: string;
};

export type ClubFormFields = {
  name: string;
  office: { value: string; label: string };
  description?: string;
  contact?: string;
  logoFile?: string;
};
