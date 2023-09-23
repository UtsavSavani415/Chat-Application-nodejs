/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { baseurl, getRequest, postRequest } from "../utils/service";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseurl}/users`);

      if (response.error) {
        return console.log("error fetching users", response);
      }

      const pChats = response.find((u) => {
        let isChatCreated = false;
        if (user._id === u._id) {
          return false;
        }

        if (userChats) {
        }
      });
    };

    getUsers();
  }, []);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseurl}/chats/${user._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ userChats, userChatsError, isUserChatsLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
