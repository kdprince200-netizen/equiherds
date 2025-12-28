import { jwtDecode } from "jwt-decode";

// Store only the token (guard against server-side)
export const updateLocalStorageData = (data) => {
  if (typeof window === "undefined" || !window.localStorage) {
    console.warn("localStorage is not available (server-side rendering)");
    return false;
  }
  
  try {
    if (!data || !data.token) {
      console.error("Invalid token data provided");
      return false;
    }
    
    localStorage.setItem("token", data.token);
    
    // Dispatch custom event to sync across components
    window.dispatchEvent(new Event("localStorageDataUpdate"));
    
    // Verify the token was saved
    const savedToken = localStorage.getItem("token");
    if (savedToken !== data.token) {
      console.error("Token was not saved correctly to localStorage");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
    // Handle quota exceeded or other storage errors
    if (error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
    }
    return false;
  }
};

// Decode token and return the user data (guard against server-side)
export const getUserData = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("Token has expired");
      // Don't clear token here - let the API handle expired tokens
      // The token will be cleared on explicit logout or when API returns 401
      return null;
    }
    
    return decoded || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    // Don't clear token on decode errors - it might be a temporary issue
    // Only return null, but keep the token in localStorage
    return null;
  }
};

// Clear token explicitly (only call this on logout)
export const clearToken = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("localStorageDataUpdate"));
      return true;
    } catch (error) {
      console.error("Error clearing token:", error);
      return false;
    }
  }
  return false;
};
