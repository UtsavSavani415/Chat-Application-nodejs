/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { baseurl, getRequest, postRequest } from "../utils/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  console.log("notifdication", notifications);

  // initial socket (setup)

  useEffect(() => {
    if (!user) {
      return;
    }
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // add online users

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send message to socket

  useEffect(() => {
    if (socket === null) {
      return;
    }
    const recipientId = currentChat?.members?.find((id) => {
      return id !== user?._id;
    });

    console.log("recipient id", recipientId, user);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // receive message and notifications

  useEffect(() => {
    if (socket === null) {
      return;
    }

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) {
        return;
      }

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

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
      setAllUsers(response);
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
        `${baseurl}/messages/${currentChat?._id}`
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

  const markAllNotificationsAsRead = useCallback(() => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback((n, userChats, user) => {
    console.log("mark as read nti", n);
    // find chat to open

    const desiredChat = userChats.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });

      return isDesiredChat;
    });

    // mark notification as read

    const mNotifications = notifications.map((el) => {
      if (n.senderId === el.senderId) {
        return { ...n, isRead: true };
      } else {
        return el;
      }
    });

    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);
  }, []);

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications) => {
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        allUsers,
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
        onlineUsers,
        notifications,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
