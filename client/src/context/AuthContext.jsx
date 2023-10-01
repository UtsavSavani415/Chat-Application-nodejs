/* eslint-disable react/prop-types */
import { createContext, useCallback, useState, useEffect } from "react";
import { baseurl, postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [registerinfo, setRegisterinfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  // console.log("userr", user);
  // console.log("login Info", loginInfo);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterinfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseurl}/users/register`,
        JSON.stringify(registerinfo)
      );
      setIsRegisterLoading(false);
      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerinfo]
  );
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  //   User login function

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseurl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(null);
      if (response.error) {
        return setLoginError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
    setLoginInfo(null);
    setRegisterinfo(null);
  });
  return (
    <AuthContext.Provider
      value={{
        user,
        registerinfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginError,
        updateLoginInfo,
        loginInfo,
        loginUser,
        isLoginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
