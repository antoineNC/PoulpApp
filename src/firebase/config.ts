import Constants from "expo-constants";
import { initializeServerApp, initializeApp } from "firebase/app";
import { onMessage, getMessaging, getToken } from "firebase/messaging";
import admin from "firebase-admin";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const messaging = getMessaging();
// const unsubscribe = onMessage(messaging, (message) => {
//   message.data;
// });
// const token = await getToken(getMessaging());

// admin.messaging().subscribeToTopic(token, "BDE");
// admin.messaging().send({ topic: "la" });

// expo for handling notif

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebase.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebase.authDomain,
  projectId: Constants.expoConfig?.extra?.firebase.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebase.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebase.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebase.appId,
  measurementId: Constants.expoConfig?.extra?.firebase.measurementId,
};

const app = initializeApp(firebaseConfig);
admin.initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
