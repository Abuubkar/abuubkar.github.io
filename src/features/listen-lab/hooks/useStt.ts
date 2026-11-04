"use client";

import { useSyncExternalStore } from "react";
import { getInitialState, getState, subscribe } from "../engine";

/** Pure glue: subscribes a component to the Listen Lab engine's state. */
export function useStt() {
  return useSyncExternalStore(subscribe, getState, getInitialState);
}
