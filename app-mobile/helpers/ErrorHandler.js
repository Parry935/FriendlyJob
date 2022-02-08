export const errorHandling = (err) => {
  if (err.response !== undefined) {
    if (err.response.status === 403) return "Brak dostępu do zasobów";
    else if (err.response.status === 401)
      return "Użytkownik niezautoryzowanych";
    else {
      if (err.response.data) {
        if (!Array.isArray(err.response.data)) return err.response.data;
        else return err.response.data[0];
      }
    }
  }
};
