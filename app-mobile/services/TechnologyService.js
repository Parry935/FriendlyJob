import axios from "axios";
import { getAuthHeader } from "../helpers/AuthHeader";

export const getTechnologies = async (count, mostPopular, value) => {
  const authHeader = await getAuthHeader();
  return await axios.get("technologies", {
    params: {
      count: count,
      mostPopular: mostPopular,
      phrase: value,
    },
    headers: authHeader,
  });
};
