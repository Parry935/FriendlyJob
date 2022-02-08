import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";
import { errorHandling } from "../helpers/ErrorHelper";

export const postLike = async (id, update) => {
  await axios
    .post(`ratings/like/${id}`, null, {
      headers: authHeader(),
    })
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        update(id, response.data);
      }
    })
    .catch((err) => {
      errorHandling(err);
    });
};

export const deleteLike = async (id, update) => {
  await axios
    .delete(`ratings/like/${id}`, {
      headers: authHeader(),
    })
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        update(id, response.data);
      }
    })
    .catch((err) => {
      errorHandling(err);
    });
};

export const postDislike = async (id, update) => {
  await axios
    .post(`ratings/dislike/${id}`, null, {
      headers: authHeader(),
    })
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        update(id, response.data);
      }
    })
    .catch((err) => {
      errorHandling(err);
    });
};

export const deleteDislike = async (id, update) => {
  await axios
    .delete(`ratings/dislike/${id}`, {
      headers: authHeader(),
    })
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        update(id, response.data);
      }
    })
    .catch((err) => {
      errorHandling(err);
    });
};
