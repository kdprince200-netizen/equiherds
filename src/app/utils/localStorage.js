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
    return decoded || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
