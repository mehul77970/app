import Notifications, { notify } from "notiwind";
import type { App } from "vue";
import { defineNuxtPlugin } from "#app";

type NotificationOptions = {
  group?: string;
  title: string;
  text: string;
  type?: "info" | "success" | "warn" | "error";
};

// core method, use with $toast("foo")
function notifyFlexible(
  info: string | NotificationOptions,
  displayFor?: number,
  type?: "info" | "success" | "warn" | "error",
) {
  if (typeof info === "string") {
    notify({ title: info, type }, displayFor);
  } else {
    notify(info, displayFor);
  }
}

export default defineNuxtPlugin((nuxtApp: { vueApp: App }) => {
  nuxtApp.vueApp.use(Notifications);
  return {
    provide: {
      toast: notifyFlexible,
    },
  };
});
