import { createEvent, createStore } from "effector";
import { Club } from "types/club.type";
import { Office, RoleOffice } from "types/office.type";
import { Partnership } from "types/partnership.type";

const actionOffice = {
  setAllOffice: createEvent<Office[]>("SET_ALL_OFFICE"),
  setAllClub: createEvent<Club[]>("SET_ALL_CLUB"),
  setAllPartnership: createEvent<Partnership[]>("SET_ALL_PARTNER"),
  setAllRole: createEvent<RoleOffice[]>("SET_ALL_ROLE"),
  logout: createEvent("LOGOUT"),
};

const defaultOfficeList: {
  officeList: Office[];
  clubList: Club[];
  partnershipList: Partnership[];
  roleList: RoleOffice[];
} = {
  officeList: [],
  clubList: [],
  partnershipList: [],
  roleList: [],
};

const $officeStore = createStore(defaultOfficeList)
  .on(actionOffice.setAllOffice, (state, officeList) => ({
    ...state,
    officeList,
  }))
  .on(actionOffice.setAllClub, (state, clubList) => ({
    ...state,
    clubList,
  }))
  .on(actionOffice.setAllPartnership, (state, partnershipList) => ({
    ...state,
    partnershipList,
  }))
  .on(actionOffice.setAllRole, (state, roleList) => ({
    ...state,
    roleList,
  }))
  .reset(actionOffice.logout);

export { actionOffice, $officeStore };
