import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="home-elem-1">
        <div className="hidden-elem-home-1">
          <div className="text-wrap-home">
            Zaloguj się lub zarejestruj jako "Firma". Wyszukaj swojego idelanego
            kandydata za pomocą zawansowanego filtru i złóż mu propozycję w
            prywatnej wiadomości. Dodaj swoją ofertę pracy i przeglądaj
            aplikacje programistów.
          </div>
        </div>
      </div>
      <div className="home-elem-2">
        <div className="hidden-elem-home-2">
          <div className="text-wrap-home">
            Zaloguj się lub zarejestruj jako "Programista". Wyszukaj idealną
            ofertę pracy za pomocą zaawansowanego filtru i złóż swoja aplikacje.
            Dodaj własną ofertę jako programista dla firm. Przeglądaj i dodawaj
            opinie o firmach.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
