import axios from "axios";
import { getAuthHeader } from "../helpers/AuthHeader";

export const createMessage = async (content, recipientId, senderId) => {
  const authHeader = await getAuthHeader();
  return await axios.post(
    "messages",
    { content: content, recipientId: recipientId, senderId: senderId },
    {
      headers: authHeader,
    }
  );
};
