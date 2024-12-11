export type Partnership = {
  id: string;
  name: string;
  officeId: string;
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: string[];
  logoUrl?: string;
};

export type FirestorePartnership = {
  name: string;
  officeId: string;
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: string[];
  logoId?: string;
};

export type CreatePartnershipFields = FirestorePartnership;

export type UpdatePartnershipFields = {
  name?: string;
  officeId?: string;
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: string[];
  logoId?: string;
};

export type PartnershipFormFields = {
  name: string;
  office: { value: string; label: string };
  description?: string;
  address?: string;
  addressMap?: string;
  benefits?: { value: string }[];
  logoFile?: string;
};
