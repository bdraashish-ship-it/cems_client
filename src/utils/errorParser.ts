/**
 * Ultimate Error Parser for CEMS
 * Specifically designed to catch and render any string sent by the backend.
 */
export const parseError = (err: any): string => {
  const defaultMsg = "An unexpected error occurred. Please try again.";

  if (!err) return defaultMsg;

  // 1. If it's a simple string, return it immediately
  if (typeof err === "string") return err;

  // 2. Identify the core data object (RTK Query wraps errors in a .data property)
  const errorData = err?.data || err;

  // 3. PRIORITY 1: Look for explicit message fields
  // This covers: { message: "..." } or { msg: "..." } or { error: "..." }
  const messageKeys = ["message", "msg", "error", "err", "reason"];
  for (const key of messageKeys) {
    if (errorData[key] && typeof errorData[key] === "string") {
      return errorData[key];
    }
  }

  // 4. PRIORITY 2: Handle FastAPI / Pydantic validation details
  // This covers: { detail: "..." } or { detail: [{ msg: "...", ... }] }
  if (errorData.detail) {
    if (typeof errorData.detail === "string") return errorData.detail;
    
    if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
      const firstError = errorData.detail[0];
      // If the error has a 'msg' property (standard FastAPI)
      if (firstError?.msg) return firstError.msg;
      // If it has a 'message' property
      if (firstError?.message) return firstError.message;
      // Fallback to stringifying the first entry
      if (typeof firstError === "string") return firstError;
    }
  }

  // 5. PRIORITY 3: Handle HTTP Status Text
  if (err.status) {
    if (err.status === "FETCH_ERROR") return "Network error: Unable to connect to server.";
    if (err.status === "PARSING_ERROR") return "Data error: Server sent an invalid response.";
  }

  // 6. LAST RESORT: Stringify whatever we found so the user sees SOMETHING technical
  if (err.message && typeof err.message === "string") return err.message;
  
  try {
    if (typeof errorData === "object" && Object.keys(errorData).length > 0) {
      return JSON.stringify(errorData);
    }
  } catch {
    // Keep default
  }

  return defaultMsg;
};
