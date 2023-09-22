import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";

function Chat(props) {
  const { user } = useContext(AuthContext);
  const { userChats, userChatsError, isUserChatsLoading } =
    useContext(ChatContext);

  console.log("userchat data", userChats, user);
  return (
    <>
      <Container>
        {userChats?.length < 1 ? null : (
          <Stack direction="horizontal" gap={4} className="align-items-center">
            <Stack className="message-box flex-grow-0 pe-3" gap={3}>
              {isUserChatsLoading && <p> Loading Chats</p>}
              {userChats?.map((chat, index) => {
                return (
                  <div key={index}>
                    <UserChat chat={chat} user={user} />
                  </div>
                );
              })}
            </Stack>
            <p>Chat Box</p>
          </Stack>
        )}
      </Container>
    </>
  );
}

export default Chat;
