import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Склейка классов — та же, что `cn` внутри кита (наружу кит её не экспортирует). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
