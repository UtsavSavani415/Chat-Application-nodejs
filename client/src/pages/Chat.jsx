import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

function Chat(props) {
  const { userChats, userChatsError, isUserChatsLoading } =
    useContext(ChatContext);

  console.log("userchat data", userChats);
  return (
    <>
      <h1>CHat app</h1>
    </>
  );
}

export default Chat;
