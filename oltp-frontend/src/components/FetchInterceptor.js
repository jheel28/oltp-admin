import { useContext } from "react";
import { AuthContext } from "./Auth-context";

const originalFetch = window.fetch;

const tokenRef = { current: null };

window.fetch = (url, options = {}) => {
  const token = tokenRef.current;
  if (token) {
    const headers = new Headers(options.headers || {});
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    options = { ...options, headers };
  }
  return originalFetch(url, options);
};

const FetchInterceptor = ({ children }) => {
  const auth = useContext(AuthContext);
  tokenRef.current = auth.token;

  return children;
};

export default FetchInterceptor;
