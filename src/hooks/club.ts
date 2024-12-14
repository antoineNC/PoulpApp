import { actionOffice } from "@context/officeStore";
import { subscribeAllClub } from "@fb/service/club.service";
import { useEffect } from "react";

export function useSubClub() {
  useEffect(() => {
    const unsub = subscribeAllClub((clubList) =>
      actionOffice.setAllClub(clubList)
    );
    return () => unsub();
  }, []);
}
