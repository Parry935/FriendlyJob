import { createToast } from "./ToastHelper";

export const errorHandling = (err) => {
  if (err.response !== undefined) {
    if (err.response.status === 403)
      createToast("error", "Brak dostępu do zasobów");
    else if (err.response.status === 401)
      createToast("error", "Użytkownik niezautoryzowanych");
    else {
      if (err.response.data) {
        if (!Array.isArray(err.response.data))
          createToast("error", err.response.data);
        else createToast("error", err.response.data[0]);
      }
    }
  } else console.log(err);
};
