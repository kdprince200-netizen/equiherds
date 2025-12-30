import { jwtDecode } from "jwt-decode";

// Store only the token (guard against server-side)
export const updateLocalStorageData = (data) => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("token", data.token);
    window.dispatchEvent(new Event("localStorageDataUpdate"));
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
