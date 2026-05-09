export const LOCAL_BACKEND_ORIGIN = "http://localhost:8000";
const PRODUCTION_BACKEND_ORIGIN =
  "https://uni-share-6t19jmwt2-rasikaprabath8694-1789s-projects.vercel.app";

// Use local backend for development, or set REACT_APP_API_URL environment variable for production
const resolvedApiBase =
  process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? LOCAL_BACKEND_ORIGIN : PRODUCTION_BACKEND_ORIGIN);

const API_BASE_URL = resolvedApiBase.replace(/\/+$/, "");

export default API_BASE_URL;
