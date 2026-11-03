import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ru.irbis.mart",
  appName: "Ирбис Март",
  webDir: "www",
  server: {
    url: "https://irbis-mart.vercel.app",
    androidScheme: "https",
    errorPath: "index.html",
    allowNavigation: [
      "irbis-mart.vercel.app",
      "yookassa.ru",
      "yandex.ru",
      "yandex.com",
      "vk.com",
      "t.me",
    ],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: "#99B415",
      androidSplashResourceName: "splash",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FFFFFF",
      overlaysWebView: false,
    },
  },
};

export default config;
