/* eslint-disable react/prop-types */
import { createContext, useCallback, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerinfo, setRegisterinfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  console.log("register value", registerinfo);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterinfo(info);
  }, []);

  return (
    <AuthContext.Provider value={{ user, registerinfo, updateRegisterInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
