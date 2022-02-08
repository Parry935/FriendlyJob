import axios from "axios";
import { getAuthHeader } from "../helpers/AuthHeader";

export const createJobApplication = async (
  description,
  file,
  offerId,
  userId
) => {
  const authHeader = await getAuthHeader();
  return await axios
    .post(
      "jobapplications",
      {
        description: description,
        offerId: offerId,
        userId: userId,
      },
      {
        headers: authHeader,
      }
    )
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        addFileToJobApplication(file, response.data);
      }
    });
};

const addFileToJobApplication = async (file, id) => {
  const authHeader = await getAuthHeader();
  await axios.post(`jobapplications/file/${id}`, file, {
    headers: authHeader,
    "content-type": "multipart/form-data",
  });
};
