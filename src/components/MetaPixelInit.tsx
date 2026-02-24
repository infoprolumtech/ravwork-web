import { useEffect, useRef } from "react";
import { useAppSelector } from "../rtk/store";
import type { RootState } from "../rtk/store";
import type { User } from "../types";
import { decryptAES } from "../utils/helper";

const PIXEL_ID = import.meta.env.VITE_APP_META_PIXEL_ID as string | undefined;

/** Build Meta Pixel advanced matching object (em, ph, external_id). Only includes non-empty values. */
function buildAdvancedMatching(user: User | null): Record<string, string> | undefined {
  if (!user) return undefined;

  const emRaw = user.email ? decryptAES(user.email).trim().toLowerCase() : "";
  const em = emRaw || undefined;

  const phRaw = `${user.countryCode ?? ""}${user.phoneNumber ?? ""}`.replace(/\D/g, "");
  const ph = phRaw || undefined;

  const external_id = user.id?.trim() || undefined;

  if (!em && !ph && !external_id) return undefined;

  const obj: Record<string, string> = {};
  if (em) obj.em = em;
  if (ph) obj.ph = ph;
  if (external_id) obj.external_id = external_id;
  return obj;
}

/**
 * Initializes Meta Pixel once with optional advanced matching when a user is logged in.
 * Call fbq('init', PIXEL_ID, userData) only here; do not add advanced matching to track calls.
 */
export default function MetaPixelInit() {
  const hasInitialized = useRef(false);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const rehydrated = useAppSelector(
    (state: RootState) => (state.auth as { _persist?: { rehydrated?: boolean } })._persist?.rehydrated
  );

  useEffect(() => {
    if (hasInitialized.current || !PIXEL_ID || typeof window === "undefined" || typeof window.fbq !== "function") {
      return;
    }
    if (rehydrated === false) return;

    const advancedMatching = buildAdvancedMatching(user);
    window.fbq!("init", PIXEL_ID, advancedMatching ?? undefined);
    window.fbq!("track", "PageView");
    hasInitialized.current = true;
  }, [rehydrated, user]);

  return null;
}
