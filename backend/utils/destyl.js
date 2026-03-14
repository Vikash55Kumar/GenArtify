import axios from "axios";

const DESTYL_BASE_URL = process.env.DESTYL_BASE_URL || "";
const DESTYL_INGEST_KEY = process.env.DESTYL_INGEST_KEY || "";
const DESTYL_TIMEOUT_MS = Number(process.env.DESTYL_TIMEOUT_MS || 2000);
const DESTYL_DEBUG = process.env.DESTYL_DEBUG === "true";

export const DESTYL_EVENTS = {
  USER_SIGNUP: "user.signup",
  USER_LOGIN: "user.login",
  IMAGE_GENERATE: "image.generate",
  CREDITS_CONSUME: "credits.consume",
  CREDITS_EXHAUSTED: "credits.exhausted",
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed"
};

const isConfigured = () => Boolean(DESTYL_BASE_URL && DESTYL_INGEST_KEY);

const resolveIngestKey = (ingestKey) => ingestKey || DESTYL_INGEST_KEY || "";

const postToDestyl = async (path, payload, ingestKey) => {
  if (!DESTYL_BASE_URL) return { ok: false, skipped: true };
  const key = resolveIngestKey(ingestKey);
  if (!key) return { ok: false, skipped: true };

  try {
    await axios.post(
      `${DESTYL_BASE_URL.replace(/\/$/, "")}${path}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-guard-ingest-key": key
        },
        timeout: DESTYL_TIMEOUT_MS
      }
    );
    return { ok: true };
  } catch (error) {
    if (DESTYL_DEBUG) {
      console.error("[Destyl] send failed", path, error?.message || error);
    }
    return { ok: false, error };
  }
};

export const trackDestylEvent = async ({
  userId,
  accountId,
  event,
  properties = {},
  anonymousId,
  ingestKey,
  source = "genartify"
}) => {
  if (!DESTYL_BASE_URL) return { ok: false, skipped: true };
  if (!event) return { ok: false, skipped: true };
  if (!userId && !anonymousId) return { ok: false, skipped: true };

  return postToDestyl(
    "/api/v2/guard/ingest/events",
    {
      userId: userId || undefined,
      anonymousId: anonymousId || undefined,
      accountId: accountId || undefined,
      event,
      properties,
      source
    },
    ingestKey
  );
};

export const identifyDestylUser = async ({
  userId,
  accountId,
  traits = {},
  anonymousId,
  ingestKey,
  source = "genartify"
}) => {
  if (!userId && !anonymousId) return { ok: false, skipped: true };
  return postToDestyl(
    "/api/v2/guard/ingest/identify",
    {
      userId: userId || undefined,
      anonymousId: anonymousId || undefined,
      accountId: accountId || undefined,
      traits,
      source
    },
    ingestKey
  );
};

export const identifyDestylGroup = async ({
  accountId,
  traits = {},
  ingestKey,
  source = "genartify"
}) => {
  if (!accountId) return { ok: false, skipped: true };
  return postToDestyl(
    "/api/v2/guard/ingest/group",
    {
      accountId,
      traits,
      source
    },
    ingestKey
  );
};

export const trackUserSignup = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_SIGNUP });

export const trackUserLogin = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_LOGIN });

export const trackImageGenerate = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.IMAGE_GENERATE });

export const trackCreditsConsume = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.CREDITS_CONSUME });

export const trackCreditsExhausted = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.CREDITS_EXHAUSTED });

export const trackPaymentSuccess = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.PAYMENT_SUCCESS });

export const trackPaymentFailed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.PAYMENT_FAILED });
