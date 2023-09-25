import { useEffect, useState } from "react";
import { baseurl, getRequest } from "../utils/service";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find((id) => {
    return id !== user?._id;
  });

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) {
        return null;
      }
      const response = await getRequest(`${baseurl}/users/find/${recipientId}`);

      if (response.error) {
        return setError(response);
      }

      setRecipientUser(response);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
