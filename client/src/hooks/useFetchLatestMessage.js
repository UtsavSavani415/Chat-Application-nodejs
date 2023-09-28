import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseurl, getRequest } from "../utils/service";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setlatestMessage] = useState(null);

  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseurl}/messages/${chat?._id}`);

      if (response.error) {
        return console.log("error getting messages...", response.error);
      }

      const lastMessage = response[response?.length - 1];
      setlatestMessage(lastMessage);
    };
    getMessage();
  }, [newMessage, notifications]);

  return { latestMessage };
};
