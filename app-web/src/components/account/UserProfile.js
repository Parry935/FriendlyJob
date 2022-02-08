import React, { useContext, useState, useEffect } from "react";
import "./Account.css";
import { MdUpdate, MdLocalOffer, MdDelete, MdMessage } from "react-icons/md";
import { FaEnvelope } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { createToast } from "../../helpers/ToastHelper";
import { showLoader } from "../../helpers/LoaderHelper";
import Error from "../Error";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import {
  getUser,
  deleteImage,
  updateImage,
  updateUser,
  updatePassword,
  updateLock,
} from "../../services/userService";
import { Role } from "../../helpers/Enumerations/Role";
import { errorHandling } from "../../helpers/ErrorHelper";
import { validUserData } from "../../helpers/ValidatorHelper";
import {
  defaultImageUser,
  baseURLImageUser,
} from "../../helpers/AppConstValues";

function UserProfile() {
  const queryParams = new URLSearchParams(window.location.search);
  const profileId = queryParams.get("id");

  const { user, setUser } = useContext(UserContext);
  const [dataUser, setDataUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ hasError: false, details: null });
  const [newPassword, setNewPassword] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [image, setImage] = useState();

  const chooseImage = (event) => {
    setImage(event.target.files[0]);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUserValues = async () => {
    if (validUserData(dataUser)) {
      await updateUser(profileId, dataUser)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            setDataUser(response.data);
            if (user.role !== Role.Admin) {
              setUser(response.data);
            }
            createToast("success", "Pomyślnie zaktualizowano dane");
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    }
  };

  const changePassword = async () => {
    if (newPassword.password !== newPassword.passwordConfirm)
      createToast("error", "Hasła nie są identyczne");
    else {
      if (
        newPassword.password.length === 0 ||
        newPassword.password.indexOf(" ") >= 0
      ) {
        createToast("error", "Nowe hasło niepoprawne");
      } else {
        await updatePassword(profileId, newPassword.password)
          .then((response) => {
            if (response !== undefined && response.status === 200) {
              setDataUser({
                ...dataUser,
                password: newPassword.password,
              });

              if (user.role !== Role.Admin) {
                setUser({
                  ...user,
                  password: newPassword.password,
                });
              }

              setNewPassword({
                password: "",
                passwordConfirm: "",
              });

              createToast("success", "Pomyślnie zmieniono hasło");
            }
          })
          .catch((err) => {
            errorHandling(err);
          });
      }
    }
  };

  const deleteImageForUser = async () => {
    await deleteImage(profileId)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          setDataUser({
            ...dataUser,
            imageSrc: null,
          });

          if (user.role !== Role.Admin || user.id === dataUser.id) {
            setUser({
              ...user,
              imageSrc: null,
            });
          }
          createToast("success", "Pomyślnie usunięto zdjęcie");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };
  const updateImageForUser = async () => {
    if (image) {
      if (!image.name.match(/.(jpg|jpeg|png)$/i)) {
        createToast("error", "Wybrany plik nie spełnia wymagań");
      } else {
        const fileToSend = new FormData();
        fileToSend.append("file", image);

        await updateImage(profileId, fileToSend)
          .then((response) => {
            if (response.data) {
              setDataUser({
                ...dataUser,
                imageSrc: response.data,
              });

              if (user.role !== Role.Admin || user.id === dataUser.id) {
                setUser({
                  ...user,
                  imageSrc: response.data,
                });
              }
              setImage("");
              createToast("success", "Pomyślnie zaktualizowano zdjęcie");
            }
          })
          .catch((err) => {
            errorHandling(err);
          });
      }
    } else createToast("error", "Nie wybrano pliku");
  };

  const handleChangePassword = (event) => {
    setNewPassword({
      ...newPassword,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeUser = (event) => {
    setDataUser({
      ...dataUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeCompany = (event) => {
    setDataUser({
      ...dataUser,
      company: {
        ...dataUser.company,
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleLockUser = async () => {
    await updateLock(dataUser.id)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          setDataUser({
            ...dataUser,
            lock: !dataUser.lock,
          });
          createToast("success", "Pomyślnie zmieniono dostęp");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  const getUserFromServer = async () => {
    setIsLoading(true);
    if (profileId) {
      await getUser(profileId)
        .then((response) => {
          if (response.data) {
            setDataUser(response.data);
          } else {
            createToast("error", "Nie znaleziono użytkownika");
            setError({
              hasError: true,
              details: 404,
            });
          }
        })
        .catch((err) => {
          errorHandling(err);
          setError({
            hasError: true,
            details: err.response ? err.response.status : null,
          });
        });
    } else {
      setError({
        hasError: true,
        details: 404,
      });
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    getUserFromServer();
    return () => {
      setDataUser(null);
    };
  }, [profileId]);

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="main-wrap-user-account">
      <div className="wrap-top-user-account">
        <h2 className="title-size-change-user">
          {isLoading
            ? "Ładowanie..."
            : dataUser.company
            ? dataUser.company.name
            : `${dataUser.firstName} ${dataUser.lastName}`}
        </h2>
      </div>
      {isLoading ? (
        showLoader()
      ) : (
        <>
          {dataUser.id !== user.id && user.role === Role.Admin ? (
            <>
              <button className="btn-user-account" onClick={updateUserValues}>
                <MdUpdate /> Aktualizuj dane
              </button>
              <br />{" "}
            </>
          ) : (
            ""
          )}
          {dataUser.id !== user.id ? (
            <div className="margin-warp-top-user">
              <Link
                className="btn-link-app"
                to={`/messagesdetails?recipientId=${dataUser.id}`}
              >
                <FaEnvelope /> Wyślij wiadomość
              </Link>
              <Link
                className="btn-link-app"
                to={`useroffers?id=${dataUser.id}`}
              >
                <MdLocalOffer /> Zobacz oferty
              </Link>
              {dataUser.role === Role.Company && user.role !== Role.Company ? (
                <Link
                  className="btn-link-app"
                  to={`companyopinions?id=${dataUser.company.id}`}
                >
                  <MdMessage /> Opinie
                </Link>
              ) : (
                ""
              )}
              {user.role === Role.Admin ? (
                dataUser.lock ? (
                  <button className="btn-unlock-user" onClick={handleLockUser}>
                    Odblokuj
                  </button>
                ) : (
                  <button
                    className="btn-lock-report-user"
                    onClick={handleLockUser}
                  >
                    Zablokuj
                  </button>
                )
              ) : (
                ""
              )}
            </div>
          ) : (
            <button className="btn-user-account" onClick={updateUserValues}>
              <MdUpdate /> Aktualizuj dane
            </button>
          )}
          <div className="card-user-account">
            <div className="data-wrap-user-account">
              <div>
                <div className="labale-user-account">Imię</div>
                <input
                  type="text"
                  name="firstName"
                  className="input-user-account"
                  placeholder="Imię"
                  value={dataUser.firstName}
                  onChange={handleChangeUser}
                  readOnly={dataUser.id !== user.id && user.role !== Role.Admin}
                />
              </div>
              <div>
                <div className="labale-user-account">Nazwisko</div>
                <input
                  type="text"
                  name="lastName"
                  className="input-user-account"
                  placeholder="Nazwisko"
                  value={dataUser.lastName}
                  onChange={handleChangeUser}
                  readOnly={dataUser.id !== user.id && user.role !== Role.Admin}
                />
              </div>
              <div>
                <div className="labale-user-account">Role</div>
                <input
                  type="text"
                  name="role"
                  className="input-user-account"
                  readOnly
                  value={dataUser.role}
                />
              </div>
            </div>
            <div className="data-wrap-user-account">
              <img
                alt=""
                src={
                  dataUser.imageSrc != null
                    ? `${baseURLImageUser}${dataUser.imageSrc}`
                    : defaultImageUser
                }
                className="img-user-account"
              />
            </div>
            {dataUser.id === user.id || user.role === Role.Admin ? (
              <div>
                <div className="image-btn-user-account">
                  <button
                    className="btn-user-small-account"
                    onClick={deleteImageForUser}
                  >
                    <MdDelete /> Usuń aktalne zdjęcie
                  </button>
                </div>
                <div className="image-btn-user-account">
                  <button
                    className="btn-user-small-account"
                    onClick={updateImageForUser}
                  >
                    <MdUpdate /> Aktualizuj zdjęcie
                  </button>
                </div>
                <div className="image-btn-user-account">
                  <label
                    className="btn-user-small-account"
                    htmlFor="updateImage"
                  >
                    <FiUpload /> {image ? image.name : "Załącz nowe zdjęcie"}
                  </label>
                  <input
                    type="file"
                    name="img"
                    id="updateImage"
                    onChange={chooseImage}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="card-user-account">
            <div>
              {dataUser.company ? (
                <>
                  <div>
                    <div className="labale-user-account">Nazwa firmy</div>
                    <input
                      type="text"
                      name="name"
                      className="input-user-account"
                      placeholder="Nazwa firmy"
                      value={dataUser.company.name}
                      onChange={handleChangeCompany}
                      readOnly={
                        dataUser.id !== user.id && user.role !== Role.Admin
                      }
                    />
                  </div>
                  {dataUser.id === user.id || user.role === Role.Admin ? (
                    <div>
                      <div className="labale-user-account">NIP</div>
                      <input
                        type="number"
                        name="nip"
                        className="input-user-account"
                        placeholder="NIP"
                        value={dataUser.company.nip}
                        onChange={handleChangeCompany}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </>
              ) : (
                ""
              )}{" "}
              <div>
                <div className="labale-user-account">Krótki opis</div>
                <textarea
                  placeholder="Brak opisu"
                  className="wrap-description-user"
                  name="description"
                  value={dataUser.description}
                  onChange={handleChangeUser}
                  readOnly={dataUser.id !== user.id && user.role !== Role.Admin}
                ></textarea>
              </div>
            </div>
          </div>

          {dataUser.id === user.id ? (
            <div className="card-user-account">
              <div>
                <div>
                  <div className="labale-user-account">Nowe hasło</div>
                  <input
                    type="password"
                    name="password"
                    className="input-user-account"
                    placeholder="Nowe hasło"
                    value={newPassword.password}
                    onChange={handleChangePassword}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="passwordConfirm"
                    className="input-user-account"
                    placeholder="Powtórz nowe hasło"
                    value={newPassword.passwordConfirm}
                    onChange={handleChangePassword}
                  />
                </div>
                <div>
                  <button
                    className="btn-user-small-account"
                    onClick={changePassword}
                  >
                    <MdUpdate /> Aktualizuj hasło
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}

export default UserProfile;
