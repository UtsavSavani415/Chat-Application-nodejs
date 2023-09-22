import React from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.png";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);

  console.log("recipientUser", recipientUser);
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-center"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="avatar" height={"70px"}/>
        </div>
        <div className="text-content pt-2">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">Text message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">12/12/2023</div>
        <div className="this-user-notifications">2</div>
        <span className="user-online"></span>
      </div>
    </Stack>
  );
};

export default UserChat;
