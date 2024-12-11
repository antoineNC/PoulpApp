import { actionPoint } from "@context/pointStore";
import { subscribeAllPoint } from "@fb/service/point.service";
import { useEffect } from "react";

export function useSubPoint() {
  useEffect(() => {
    subscribeAllPoint((pointList) => actionPoint.setPoint(pointList));
    return () => {
      subscribeAllPoint((pointList) => actionPoint.setPoint(pointList));
    };
  }, []);
}
