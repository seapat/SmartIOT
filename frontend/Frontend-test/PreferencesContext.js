import React from "react";

export const PreferencesContext = React.createContext({
  isThemeDark: false,
  setIsThemeDark: () => {},
  operationMode: "Normal",
  setOperationMode: () => {},
});