import admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import { getMessaging, getToken } from "firebase/messaging";
import * as Notifications from "expo-notifications";

export async function sendNotification(
  topics: string[],
  title: string,
  body: string
) {
  //   let title = "Nouveau post publié";
  //   switch (topic) {
  //     case "BDE":
  //       title += " par le BDE !";
  //       break;
  //     case "BDS":
  //       title += " par le BDS !";
  //       break;
  //     case "BDA":
  //       title += " par le BDA !";
  //       break;
  //     case "I2C":
  //       title += " par I2C !";
  //       break;
  //     default:
  //       break;
  //   }
  const condition = topics.reduce((acc, topic) => {
    if (acc !== "") {
      acc += ` || \'${topic}\' in topics`;
    } else {
      acc += `\'${topic}\' in topics`;
    }
    return acc;
  }, "");

  const message: Message = {
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
    await admin.messaging().send(message);
  } catch (e) {
    throw new Error(`[send notification] ${e}`);
  }
}

export async function subscribeToTopic(topic: string) {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
    await admin.messaging().subscribeToTopic(token, topic);
  } catch (e) {
    throw new Error(`[subscribe topic] ${e}`);
  }
}

export function subscribeNotificationReceived() {
  return Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification: ", JSON.stringify(notification));
  });
}
export function subscribeNotificationInteracted() {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Response: ", JSON.stringify(response));
  });
}

export function unsubscribeNotification(
  subscription: Notifications.Subscription
) {
  return Notifications.removeNotificationSubscription(subscription);
}
