import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: number) {
  return moment.duration({ millisecond: time }).humanize();
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export function formatTimestamp(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
}

export function formatDate(date: string) {
  return moment(date).format("ddd, MMMM D YYYY");
}

interface TruncateProps {
  length: number;
  position: "start" | "end" | "middle";
}

export function truncate(text: string, { length, position }: TruncateProps) {
  if (!text) return;
  if (!length) return;
  if (text.length <= length) return text;

  let textStr = "";
  const partLength = Math.ceil((length - 3) / 2);
  let startStr, endStr;

  switch (position) {
    case "start":
      endStr = text.substring(text.length - length + 3);
      textStr = `...${endStr}`;
      break;
    case "middle":
      startStr = text.substring(0, partLength);
      endStr = text.substring(text.length - partLength);
      textStr = `${startStr}...${endStr}`;
      break;
    case "end":
      startStr = text.substring(0, length - 3);
      textStr = `${startStr}...`;
      break;
  }

  return textStr;
}

export function getHumanReadableSize(bytes: number, format: boolean) {
  const kb = Number((bytes / 1024).toFixed(0));
  if (kb < 1024) return `${kb}${format ? " KB" : ""}`;
  const mb = Number((kb / 1024).toFixed(0));
  if (mb < 1024) return `${mb}${format ? " MB" : ""}`;
  const gb = Number((mb / 1024).toFixed(2));
  if (gb < 1024) return `${gb}${format ? " GB" : ""}`;
}

function isChrome() {
  return !!window.chrome && window.chrome.app;
}

function isOpera() {
  return navigator.userAgent.includes(" OPR/");
}

function isFirefox() {
  return !window.chrome && navigator.userAgent.includes("Firefox");
}

function isSafari() {
  return navigator.userAgent.includes(" Safari/");
}

function isEdge() {
  return isChrome() && navigator.userAgent.includes("Edg");
}

function isBlink() {
  return (isChrome() || isOpera()) && !!window.CSS;
}

export function getBrowser() {
  if (isChrome()) return "Chrome";
  if (isOpera()) return "Opera";
  if (isFirefox()) return "Firefox";
  if (isSafari()) return "Safari";
  if (isEdge()) return "Edge";
  if (isBlink()) return "Blink";

  return "Unknown Browser/Device";
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw new Error("Could not parse Hex Color");
  }

  const rHex = Number.parseInt(result[1], 16);
  const gHex = Number.parseInt(result[2], 16);
  const bHex = Number.parseInt(result[3], 16);

  const r = rHex / 255;
  const g = gHex / 255;
  const b = bHex / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    // Achromatic
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
  }
  h /= 6;

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return { h, s, l };
}
