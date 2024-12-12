import { actionOffice } from "@context/officeStore";
import { subscribeAllPartnership } from "@fb/service/partnership.service";
import { useEffect } from "react";

export function useSubPartnership() {
  useEffect(() => {
    subscribeAllPartnership((partnerList) =>
      actionOffice.setAllPartnership(partnerList)
    );
    return () => {
      subscribeAllPartnership((partnerList) =>
        actionOffice.setAllPartnership(partnerList)
      );
    };
  }, []);
}
