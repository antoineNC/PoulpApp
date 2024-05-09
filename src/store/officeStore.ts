import { createEvent, createStore } from "effector";

const actionOffice = {
  setAllOffice: createEvent<Office[]>("SET_ALL_OFFICE"),
  setAllClub: createEvent<Club[]>("SET_ALL_CLUB"),
  setAllPartnership: createEvent<Partnership[]>("SET_ALL_PARTNER"),
  logout: createEvent("LOGOUT"),
};

const defaultOfficeList: {
  officeList: Office[];
  clubList: Club[];
  partnershipList: Partnership[];
} = {
  officeList: [],
  clubList: [],
  partnershipList: [],
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
  .reset(actionOffice.logout);

export { actionOffice, $officeStore };
