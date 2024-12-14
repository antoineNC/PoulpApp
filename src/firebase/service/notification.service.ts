/* eslint-disable @typescript-eslint/no-unused-vars */
import { getMessaging, getToken } from "firebase/messaging";
import * as Notifications from "expo-notifications";

export async function sendNotification(
  topics: string[],
  title: string,
  body: string
) {
  const condition = topics.reduce((acc, topic) => {
    if (acc !== "") {
      acc += ` || \'${topic}\' in topics`;
    } else {
      acc += `\'${topic}\' in topics`;
    }
    return acc;
  }, "");

  const message = {
    condition,
    notification: { title, body },
    android: { priority: "high" },
    apns: {
      headers: {
        "apns-priority": "10",
      },
    },
  };
  try {
  } catch (e) {
    throw new Error(`[send notification] ${e}`);
  }
}

export async function subscribeToTopic(topic: string) {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
  } catch (e) {
    throw new Error(`[subscribe topic] ${e}`);
  }
}

export function subscribeNotificationReceived() {
  return Notifications.addNotificationReceivedListener((notification) => {
    // console.log("Notification: ", JSON.stringify(notification));
  });
}
export function subscribeNotificationInteracted() {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    // console.log("Response: ", JSON.stringify(response));
  });
}

export function unsubscribeNotification(
  subscription: Notifications.Subscription
) {
  return Notifications.removeNotificationSubscription(subscription);
}
