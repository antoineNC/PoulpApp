import { actionPoint } from "@context/pointStore";
import { subscribeAllPoint } from "@fb/service/point.service";
import { useEffect } from "react";

export function useSubPoint() {
  useEffect(() => {
    const unsub = subscribeAllPoint((pointList) =>
      actionPoint.setPoint(pointList)
    );
    return () => unsub();
  }, []);
}
