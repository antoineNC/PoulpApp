import { actionOffice } from "@context/officeStore";

export const setOffices = async () => {
  try {
    await actionOffice.setOffices();
  } catch (e: any) {
    throw Error("Erreur lors de l'importation des bureaux", e);
  }
};

export const unloadOffices = () => {
  try {
    actionOffice.logout();
  } catch (e: any) {
    throw Error(e);
  }
};
