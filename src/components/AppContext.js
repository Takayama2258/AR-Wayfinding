import React from "react";

export const AppContext = React.createContext({
    angle: 0,
    settingAngle: () => {},
  });