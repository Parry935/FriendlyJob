import React, { useState, useEffect, useContext } from "react";
import "./AdminComponents.css";
import "../account/User.css";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import {
  createTechnology,
  deleteTechnology,
  editTechnology,
  getTechnologies,
} from "../../services/technologiesService";
import { Switch } from "@material-ui/core";
import Technology from "./Technology";
import { createToast } from "../../helpers/ToastHelper";
import { UserContext } from "../../contexts/UserContext";
import { Role } from "../../helpers/Enumerations/Role";
import { showLoader } from "../../helpers/LoaderHelper";
import { errorHandling } from "../../helpers/ErrorHelper";

function Technologies() {
  const [isLoading, setIsLoading] = useState(true);
  const [phrase, setPhrase] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [mostPopularSearch, setMostPopularSearch] = useState(true);
  const { user } = useContext(UserContext);

  const handleMostPopularSearch = (event) => {
    setMostPopularSearch(event.target.checked);
  };

  const getDataTechnologies = async () => {
    await getTechnologies(0, mostPopularSearch, phrase)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0) {
            setTechnologies(response.data);
          } else {
            setTechnologies([]);
          }
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  const handlePhrase = (e) => {
    setPhrase(e.target.value);
  };

  const handleNewTechnology = (e) => {
    setNewTechnology(e.target.value);
  };

  const handleAddTechnology = async () => {
    if (newTechnology.length > 0 && newTechnology.trim()) {
      await createTechnology(newTechnology)
        .then((response) => {
          if (
            response !== undefined &&
            response.status === 200 &&
            response.data
          ) {
            setTechnologies((technologies) => [response.data, ...technologies]);
            setNewTechnology("");
            createToast("success", "Dodano technologię");
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else createToast("error", "Nazwa nie może być pusta");
  };

  const handleEditTechnology = async (id, newName) => {
    await editTechnology(id, newName)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          const technologiesToEdit = [...technologies];

          technologiesToEdit[
            technologiesToEdit.findIndex((item) => item.id === id)
          ].name = newName.trim();
          setTechnologies(technologiesToEdit);
          createToast("success", "Dokonano edycji");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  const handleDeteleTechnology = async (id) => {
    await deleteTechnology(id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          const technologiesToFilter = [...technologies];
          var newTechnologies = technologiesToFilter.filter(
            (item) => item.id !== id
          );
          setTechnologies(newTechnologies);
          createToast("success", "Usunięto technologię");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  useEffect(() => {
    getDataTechnologies();
    return () => {
      setTechnologies([]);
    };
  }, [mostPopularSearch, phrase]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return (
    <div className="main-wrap-user">
      <div className="wrap-top-user-account">
        <h2 className="title-size-change-user">Technologie</h2>
      </div>
      {isLoading ? (
        showLoader()
      ) : (
        <>
          <div className="center-space-around-app">
            {user.role === Role.Admin ? (
              <div className="item-margin-admin">
                <IoMdAddCircle
                  className="icon-users-green-admin"
                  onClick={handleAddTechnology}
                />
                <input
                  className="input-user-accounts-admin"
                  type="text"
                  placeholder="Dodaj nową technologie"
                  value={newTechnology}
                  onChange={handleNewTechnology}
                />
              </div>
            ) : (
              ""
            )}
            <div className="item-margin-admin">
              {" "}
              <AiOutlineSearch className="icon-users-admin" />
              <input
                className="input-user-accounts-admin"
                type="text"
                placeholder="Szukaj po frazie..."
                value={phrase}
                onChange={handlePhrase}
              />
            </div>
            <div className="item-margin-admin">
              <Switch
                color="secondary"
                checked={mostPopularSearch}
                name="mostPopularSearch"
                onChange={handleMostPopularSearch}
              />
              <b className="blue-user-admin">Sortuj po najczęściej używanych</b>
            </div>
          </div>

          <div>
            {technologies.map((item) => (
              <div className="item-wrap-user" key={item.id}>
                <Technology
                  technology={item}
                  update={handleEditTechnology}
                  delete={handleDeteleTechnology}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Technologies;
