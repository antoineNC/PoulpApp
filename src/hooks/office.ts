import { useEffect } from "react";
import { actionOffice } from "@context/officeStore";
import {
  subscribeAllOffice,
  subscribeAllRole,
} from "@fb/service/office.service";

export function useSubOffice() {
  useEffect(() => {
    subscribeAllOffice((officeList) => actionOffice.setAllOffice(officeList));
    return () => {
      subscribeAllOffice((officeList) => actionOffice.setAllOffice(officeList));
    };
  }, []);
}

export function useSubRoleOffice() {
  useEffect(() => {
    subscribeAllRole((officeList) => actionOffice.setAllRole(officeList));
    return () => {
      subscribeAllRole((officeList) => actionOffice.setAllRole(officeList));
    };
  }, []);
}
