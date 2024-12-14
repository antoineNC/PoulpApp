import { actionOffice } from "@context/officeStore";
import { subscribeAllPartnership } from "@fb/service/partnership.service";
import { useEffect } from "react";

export function useSubPartnership() {
  useEffect(() => {
    const unsub = subscribeAllPartnership((partnerList) =>
      actionOffice.setAllPartnership(partnerList)
    );
    return () => unsub();
  }, []);
}
