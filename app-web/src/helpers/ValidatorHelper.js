import { createToast } from "./ToastHelper";

export const validJobOffer = (jobOfferData) => {
  if (jobOfferData.title.length === 0 || !jobOfferData.title.trim().length) {
    createToast("error", "Tytył nie wypełniony lub zawiera same puste znaki");
    return false;
  } else if (
    jobOfferData.localization.length === 0 ||
    !jobOfferData.localization.trim().length
  ) {
    createToast(
      "error",
      "Lokalizacja nie wypełniona lub zawiera same puste znaki"
    );
    return false;
  } else if (jobOfferData.salary && jobOfferData.salary <= 0) {
    createToast("error", "Wynagrodzenie musi być większe od zera");
    return false;
  } else if (jobOfferData.technologyMain.length <= 0) {
    createToast("error", "Ofeta wymaga przynajmniej jednej gównej technologii");
    return false;
  }

  return true;
};

export const validProgrammerOffer = (programmerOfferData) => {
  if (
    programmerOfferData.title.length === 0 ||
    !programmerOfferData.title.trim().length
  ) {
    createToast("error", "Tytył nie wypełniony lub zawiera same puste znaki");
    return false;
  } else if (
    programmerOfferData.localization.length === 0 ||
    !programmerOfferData.localization.trim().length
  ) {
    createToast(
      "error",
      "Lokalizacja nie wypełniona lub zawiera same puste znaki"
    );
    return false;
  } else if (programmerOfferData.technologyMain.length <= 0) {
    createToast("error", "Ofeta wymaga przynajmniej jednej gównej technologii");
    return false;
  }

  return true;
};

export const validRegisterData = (registerData, isCompany) => {
  let notValidValues = [];

  if (isCompany) {
    if (
      registerData.companyName.length === 0 ||
      !registerData.companyName.trim().length
    )
      notValidValues.push("Nazwa firmy");

    if (registerData.nip.length === 0 || registerData.nip.indexOf(" ") >= 0)
      notValidValues.push("NIP");
    else if (registerData.nip.length !== 9) {
      createToast("error", "Nip musi zawierać 9 znaków");
      return false;
    } else if (!/^\d+$/.test(registerData.nip)) {
      createToast("error", "Nip musi zawireć tylko cyfry");
      return false;
    }
  }

  if (registerData.email.length === 0 || registerData.email.indexOf(" ") >= 0)
    notValidValues.push("Email");

  if (
    registerData.firstName.length === 0 ||
    registerData.firstName.indexOf(" ") >= 0
  )
    notValidValues.push("Imię");

  if (
    registerData.lastName.length === 0 ||
    registerData.lastName.indexOf(" ") >= 0
  )
    notValidValues.push("Nazwisko");

  if (
    registerData.password.length === 0 ||
    registerData.password.indexOf(" ") >= 0
  )
    notValidValues.push("Hasło");

  if (registerData.password.length < 5) {
    createToast("error", "Hasło musi zawierać przynajmniej 5 znaków");
    return false;
  }

  if (
    registerData.passwordRepeat.length === 0 ||
    registerData.passwordRepeat.indexOf(" ") >= 0
  )
    notValidValues.push("Powtórz hasło");

  if (notValidValues.length === 0) return true;

  createToast(
    "error",
    "Nie wypełniono lub zawierają puste znaki: " +
      notValidValues.join(", ").toString()
  );

  return false;
};

export const validUserData = (dataUser) => {
  let notValidValues = [];

  if (dataUser.company) {
    if (
      dataUser.company.name.length === 0 ||
      !dataUser.company.name.trim().length
    )
      notValidValues.push("Nazwa firmy");

    if (
      dataUser.company.nip.length === 0 ||
      dataUser.company.nip.indexOf(" ") >= 0
    )
      notValidValues.push("NIP");
    else if (dataUser.company.nip.length !== 9) {
      createToast("error", "Nip musi zawierać 9 znaków");
      return false;
    } else if (!/^\d+$/.test(dataUser.company.nip)) {
      createToast("error", "Nip musi zawireć tylko cyfry");
      return false;
    }
  }

  if (dataUser.firstName.length === 0 || dataUser.firstName.indexOf(" ") >= 0)
    notValidValues.push("Imię");

  if (dataUser.lastName.length === 0 || dataUser.lastName.indexOf(" ") >= 0)
    notValidValues.push("Nazwisko");

  if (notValidValues.length === 0) return true;

  createToast(
    "error",
    "Nie wypełniono lub zawierają puste znaki: " +
      notValidValues.join(", ").toString()
  );

  return false;
};
