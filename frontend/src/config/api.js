export const LOCAL_BACKEND_ORIGIN = "http://localhost:8000";
const PRODUCTION_BACKEND_ORIGIN =
  "https://uni-share-6t19jmwt2-rasikaprabath8694-1789s-projects.vercel.app";

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const resolvedApiBase =
  process.env.REACT_APP_API_URL ||
  (isLocalHost ? LOCAL_BACKEND_ORIGIN : PRODUCTION_BACKEND_ORIGIN);

const API_BASE_URL = resolvedApiBase.replace(/\/+$/, "");

export default API_BASE_URL;
