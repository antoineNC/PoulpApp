import { useEffect } from "react";

import { actionOffice } from "@context/officeStore";
import {
  subscribeAllOffice,
  subscribeAllRole,
} from "@fb/service/office.service";

export function useSubOffice() {
  useEffect(() => {
    const unsub = subscribeAllOffice((officeList) =>
      actionOffice.setAllOffice(officeList)
    );
    return () => unsub();
  }, []);
}

export function useSubRoleOffice() {
  useEffect(() => {
    const unsub = subscribeAllRole((officeList) =>
      actionOffice.setAllRole(officeList)
    );
    return () => unsub();
  }, []);
}
