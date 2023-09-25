/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { baseurl, getRequest, postRequest } from "../utils/service";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  console.log("messages", messages);
  // useEffect to get users
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseurl}/users`);

      if (response.error) {
        return console.log("error fetching users", response);
      }
      console.log("userchats", userChats);
      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) {
          return false;
        }

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };

    getUsers();
  }, [userChats]);

  // use Effect for getting user chats
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

  //get message use effect
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseurl}/messages/${currentChat._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return console.log("you must type something...");
      }

      const response = await postRequest(
        `${baseurl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      console.log("error while sending message", response.error);
      if (response.error) {
        console.log("error while sending message", response.error);
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseurl}/chats/`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("error while creating chat");
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
