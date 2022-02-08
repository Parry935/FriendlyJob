import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";

export const createMessage = async (content, recipientId, senderId) => {
  return await axios.post(
    "messages",
    { content: content, recipientId: recipientId, senderId: senderId },
    {
      headers: authHeader(),
    }
  );
};

export const getMesages = async (recipientId, senderId) => {
  return await axios.get("messages", {
    params: {
      sender: senderId,
      recipient: recipientId,
    },
    headers: authHeader(),
  });
};

export const getConversations = async (page) => {
  return await axios.get("messages/conversations", {
    params: {
      page: page,
    },
    headers: authHeader(),
  });
};

export const deleteMessage = async (id) => {
  return await axios.delete(`messages/${id}`, {
    headers: authHeader(),
  });
};
