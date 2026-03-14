import axios from "axios";

const DESTYL_BASE_URL = process.env.DESTYL_BASE_URL || "";
const DESTYL_INGEST_KEY = process.env.DESTYL_INGEST_KEY || "";
const DESTYL_TIMEOUT_MS = Number(process.env.DESTYL_TIMEOUT_MS || 8000);
const DESTYL_DEBUG = process.env.DESTYL_DEBUG === "true";

export const DESTYL_EVENTS = {
  USER_SIGNUP: "user.signup",
  USER_SIGNUP_FAILED: "user.signup.failed",
  USER_LOGIN: "user.login",
  USER_LOGIN_FAILED: "user.login.failed",
  USER_LOGOUT: "user.logout",
  USER_CREDITS_VIEWED: "user.credits.viewed",
  IMAGE_GENERATE: "image.generate",
  IMAGE_GENERATE_FAILED: "image.generate.failed",
  CREDITS_CONSUME: "credits.consume",
  CREDITS_EXHAUSTED: "credits.exhausted",
  PAYMENT_INITIATED: "payment.initiated",
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed",
  PAYMENT_VERIFICATION_FAILED: "payment.verification.failed"
};

const resolveIngestKey = (ingestKey) => ingestKey || DESTYL_INGEST_KEY || "";

let warnedBaseUrl = false;
let warnedIngestKey = false;

const logMisconfiguration = (reason) => {
  if (reason === "base-url" && !warnedBaseUrl) {
    warnedBaseUrl = true;
    console.warn("[Destyl] telemetry skipped: DESTYL_BASE_URL is missing");
  }
  if (reason === "ingest-key" && !warnedIngestKey) {
    warnedIngestKey = true;
    console.warn("[Destyl] telemetry skipped: DESTYL_INGEST_KEY (or workspace destylIngestKey) is missing");
  }
};

const postToDestyl = async (path, payload, ingestKey) => {
  if (!DESTYL_BASE_URL) {
    logMisconfiguration("base-url");
    return { ok: false, skipped: true, reason: "missing_base_url" };
  }
  const key = resolveIngestKey(ingestKey);
  if (!key) {
    logMisconfiguration("ingest-key");
    return { ok: false, skipped: true, reason: "missing_ingest_key" };
  }

  try {
    const response = await axios.post(
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
    return { ok: true, status: response.status };
  } catch (error) {
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    const message = error?.message || "unknown_error";

    if (DESTYL_DEBUG || status === 401 || status === 403 || status >= 500) {
      console.error("[Destyl] send failed", {
        path,
        status,
        message,
        responseData,
        baseUrl: DESTYL_BASE_URL
      });
    }

    return { ok: false, error, status, message };
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

export const trackUserSignupFailed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_SIGNUP_FAILED });

export const trackUserLogin = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_LOGIN });

export const trackUserLoginFailed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_LOGIN_FAILED });

export const trackUserLogout = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_LOGOUT });

export const trackUserCreditsViewed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.USER_CREDITS_VIEWED });

export const trackImageGenerate = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.IMAGE_GENERATE });

export const trackImageGenerateFailed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.IMAGE_GENERATE_FAILED });

export const trackCreditsConsume = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.CREDITS_CONSUME });

export const trackCreditsExhausted = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.CREDITS_EXHAUSTED });

export const trackPaymentInitiated = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.PAYMENT_INITIATED });

export const trackPaymentSuccess = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.PAYMENT_SUCCESS });

export const trackPaymentFailed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.PAYMENT_FAILED });

export const trackPaymentVerificationFailed = (payload) =>
  trackDestylEvent({ ...payload, event: DESTYL_EVENTS.PAYMENT_VERIFICATION_FAILED });
