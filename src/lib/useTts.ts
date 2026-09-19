"use client";

import { useSyncExternalStore } from "react";
import { getInitialState, getState, subscribe } from "@/lib/tts";

/** Pure glue: subscribes a component to the VoiceLab engine's state. */
export function useTts() {
  return useSyncExternalStore(subscribe, getState, getInitialState);
}
