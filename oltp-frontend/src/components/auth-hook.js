import { useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  // Tracks whether the initial localStorage check has completed.
  const [initialized, setInitialized] = useState(false);

  const login = useCallback((userId, token, email, role) => {
    setUserId(userId);
    setToken(token);
    setEmail(email);
    setRole(role);

    const decoded = jwtDecode(token);
    const expiration = new Date(decoded.exp * 1000);
    setTokenExpirationDate(expiration);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        token,
        email,
        role,
        expiration: expiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole(null);
    setEmail(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remaining = tokenExpirationDate.getTime() - new Date().getTime();
      if (remaining <= 0) {
        logout();
        return;
      }
      logoutTimer = setTimeout(logout, remaining);
    } else {
      clearTimeout(logoutTimer);
    }
    return () => clearTimeout(logoutTimer);
  }, [token, logout, tokenExpirationDate]);

  // Runs once on mount to rehydrate from localStorage.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.userId &&
      storedData.token &&
      storedData.email &&
      storedData.role &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, storedData.email, storedData.role);
    }
    // Signal that the initialisation check is done regardless of outcome.
    setInitialized(true);
  }, [login]);

  return { login, logout, userId, token, email, role, initialized };
};