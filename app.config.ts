import "dotenv/config";

export default {
  expo: {
    name: "PoulpApp",
    slug: "PoulpApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#52234E",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.ensc.poulpapp",
      googleServicesFile: process.env.GOOGLE_SERVICES_FILE,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-secure-store"],
    newArchEnabled: true,
    extra: {
      eas: {
        projectId: "4151ca97-98bb-4039-8a5e-6538018cd0ab",
      },
      firebase: {
        apiKey: process.env.FB_API_KEY,
        authDomain: process.env.FB_AUTH_DOMAIN,
        projectId: process.env.FB_PROJECT_ID,
        storageBucket: process.env.FB_STORAGE_BUCKET,
        messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
        appId: process.env.FB_APP_ID,
        measurementId: process.env.FB_MEASUREMENT_ID,
        storageUrl: process.env.FB_STORAGE_URL,
      },
      codeENSC: process.env.CODE_ENSC,
    },
    owner: "aneyracontr",
  },
};
