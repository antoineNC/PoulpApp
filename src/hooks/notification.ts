import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import {
  subscribeNotificationInteracted,
  subscribeNotificationReceived,
  unsubscribeNotification,
} from "@fb/service/notification.service";

export function useReceiveNotification() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  useEffect(() => {
    notificationListener.current = subscribeNotificationReceived();
    responseListener.current = subscribeNotificationInteracted();

    return () => {
      notificationListener.current &&
        unsubscribeNotification(notificationListener.current);
      responseListener.current &&
        unsubscribeNotification(responseListener.current);
    };
  }, []);
}
