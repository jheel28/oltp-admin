import React, { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  email: null,
  role: null,
  login: () => {},
  logout: () => {},
});
