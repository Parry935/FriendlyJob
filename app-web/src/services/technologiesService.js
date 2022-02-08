import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";

export const getTechnologies = async (count, mostPopular, value) => {
  return await axios.get("technologies", {
    params: {
      count: count,
      mostPopular: mostPopular,
      phrase: value,
    },
    headers: authHeader(),
  });
};

export const createTechnology = async (name) => {
  return await axios.post(
    "technologies",
    {
      name: name,
    },
    {
      headers: authHeader(),
    }
  );
};

export const editTechnology = async (id, name) => {
  return await axios.put(
    `technologies/${id}`,
    {
      name: name,
    },
    {
      headers: authHeader(),
    }
  );
};

export const deleteTechnology = async (id) => {
  return await axios.delete(`technologies/${id}`, {
    headers: authHeader(),
  });
};
