import "./index.scss";
import { fetchAllWeatherData } from "./fetch.js"; // Nutzt die optimierte Funktion

import {
  displayCurrentWeahterData,
  displayHourlyWeatherData,
  displayThreeDaysWeatherData,
  displaySpecificInformation,
  displayCity,
} from "./display.js";

import {
  formatToMilitaryTime,
  chooseImagePath,
  choseMainMenuImage,
  addLoadingStatus,
} from "./utils.js";

let cityNames = [];

// Funktionen für das Haupt-Menü
async function initMainMenu() {
  cityNames = JSON.parse(localStorage.getItem("weatherFavorites")) || [];

  const mainContainer = document.querySelector(".main-container");
  mainContainer.style.backgroundImage = "";

  mainContainer.innerHTML = `
    <div class="heading-container">
      <h2 class="heading-container__heading">Wetter</h2>
      <button class="heading-container__button">Bearbeiten</button>
    </div>
    <input type="search" id="city-input" placeholder="Nach Stadt suchen...">
    <div class="weather-container"></div>
  `;

  const weatherContainer = mainContainer.querySelector(".weather-container");

  const inputContent = document.getElementById("city-input");
  inputContent.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && inputContent.value !== "") {
      init(inputContent.value.trim());
    }
  });

  weatherContainer.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".weather-container__card");
    if (clickedCard) {
      const cityName = clickedCard.dataset.city;
      init(cityName);
    }
  });

  for (const city of cityNames) {
    // Lädt alle Daten für die Menükarte mit nur einem Aufruf
    const weather = await fetchAllWeatherData(city);

    displayCity(
      weatherContainer,
      weather.currentAttributes,
      weather.maxMinAttributes,
    );

    const allCards = weatherContainer.querySelectorAll(
      ".weather-container__card",
    );
    const lastCard = allCards[allCards.length - 1];

    choseMainMenuImage(
      lastCard,
      weather.currentAttributes.conditionCode,
      !weather.currentAttributes.isDay,
    );
  }

  // Funktionalität für Bearbeiten-Button festlegen, nachdem delete-button gebaut wurde
  const editButton = document.querySelector(".heading-container__button");

  editButton.addEventListener("click", () => {
    // Sucht die Buttons erst im Moment des Klicks, wenn sie sicher im DOM existieren
    const deleteButtons = document.querySelectorAll(
      ".weather-container__delete-button",
    );

    if (editButton.textContent === "Bearbeiten") {
      deleteButtons.forEach((button) => (button.style.display = "block"));
      editButton.textContent = "Fertig";
    } else {
      deleteButtons.forEach((button) => (button.style.display = "none"));
      editButton.textContent = "Bearbeiten";
    }
  });
}

// Funktionen für die Detailansicht einer Stadt
async function init(cityName) {
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";

  addLoadingStatus(cityName);

  // Holt das gesamte Datenpaket mit einem einzigen API-Aufruf
  const weather = await fetchAllWeatherData(cityName);

  chooseImagePath(
    weather.currentAttributes.conditionCode,
    !weather.currentAttributes.isDay,
  );
  mainContainer.innerHTML = "";

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  // SVG-Namensräume repariert, damit Icons auf GitHub Pages sichtbar sind
  buttonContainer.innerHTML = `
    <button class="button-container__back-button">
      <svg class="button-container__back-svg" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>
    <button class="button-container__favorite-button">
      <svg class="button-container__favorite-svg" xmlns="http://w3.org" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    </button>`;

  mainContainer.appendChild(buttonContainer);

  const favoriteButton = document.querySelector(
    ".button-container__favorite-button",
  );
  const backButton = document.querySelector(".button-container__back-button");

  let favorites = JSON.parse(localStorage.getItem("weatherFavorites")) || [];
  if (favorites.includes(weather.currentAttributes.name)) {
    favoriteButton.style.display = "none";
  }

  backButton.addEventListener("click", () => {
    initMainMenu();
  });

  favoriteButton.addEventListener("click", () => {
    let currentFavorites =
      JSON.parse(localStorage.getItem("weatherFavorites")) || [];

    if (!currentFavorites.includes(weather.currentAttributes.name)) {
      currentFavorites.push(weather.currentAttributes.name);
      localStorage.setItem(
        "weatherFavorites",
        JSON.stringify(currentFavorites),
      );
      // Button nach erneutem Anklicken der Stadt-Card nicht mehr anzeigen
      favoriteButton.style.display = "none";
    }
  });

  displayCurrentWeahterData(
    weather.currentAttributes,
    weather.maxMinAttributes,
  );
  displayHourlyWeatherData(
    weather.currentAttributes,
    weather.nextTwentyFourHours,
  );
  displayThreeDaysWeatherData(weather.forecastElements);

  displaySpecificInformation(
    "Feuchtigkeit",
    weather.specificInformation.humidity + "%",
  );
  displaySpecificInformation(
    "Gefühlt",
    weather.specificInformation.feelslike + "°",
  );
  displaySpecificInformation(
    "Niederschlag",
    weather.specificInformation.precipitation + "mm",
  );
  displaySpecificInformation("UV-Index", weather.specificInformation.uvIndex);
  displaySpecificInformation(
    "Sonnenaufgang",
    formatToMilitaryTime(weather.specificInformation.sunrise) + " Uhr",
  );
  displaySpecificInformation(
    "Sonnenuntergang",
    formatToMilitaryTime(weather.specificInformation.sunset) + " Uhr",
  );
}

initMainMenu();
