import "./index.scss";
import {
  fetchCurrentWeahterData,
  fetchMaxMinWeatherData,
  fetchHourlyWeatherData,
  addLoadingStatus,
  displayCurrentWeahterData,
  displayHourlyWeatherData,
  fetchThreeDaysWeatherData,
  displayThreeDaysWeatherData,
  fetchSpecificInformation,
  displaySpecificInformation,
  displayCity,
} from "./fetch.js";
import {
  formatToMilitaryTime,
  chooseImagePath,
  choseMainMenuImage,
} from "./utils.js";

const cityNames = ["Baden-Baden", "Sevilla"];

//Funktion für das Haupt-Menü
async function initMainMenu() {
  const mainContainer = document.querySelector(".main-container");
  //Hintergrundbild von Detailansicht wieder entfernen nach Klicken des back-buttons
  mainContainer.style.backgroundImage = "";

  // Grundgerüst erstellen
  mainContainer.innerHTML = `
    <div class="heading-container">
      <h2 class="heading-container__heading">Wetter</h2>
      <button class="heading-container__button">Bearbeiten</button>
    </div>
    <div class="search-container" >
    <input type="text" class="search-container__input" placeholder="Nach Stadt suchen...">
    <button class="search-container__save-button">Speichern</button>
    </div>
    <div class="weather-container"></div>
  `;

  const weatherContainer = mainContainer.querySelector(".weather-container");

  // Event-Listener für Klicks (Event Delegation)
  weatherContainer.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".weather-container__card");
    if (clickedCard) {
      const cityName = clickedCard.dataset.city;
      init(cityName);
    }
  });

  for (const city of cityNames) {
    const currentAttributes = await fetchCurrentWeahterData(city);
    const maxMinAttributes = await fetchMaxMinWeatherData(city);

    displayCity(weatherContainer, currentAttributes, maxMinAttributes);

    const allCards = weatherContainer.querySelectorAll(
      ".weather-container__card",
    );
    const lastCard = allCards[allCards.length - 1];

    choseMainMenuImage(
      lastCard,
      currentAttributes.conditionCode,
      !currentAttributes.isDay,
    );
  }
}

//Funktion für die Detailansicht einer Stadt
async function init(cityName) {
  const mainContainer = document.querySelector(".main-container");
  const parentContainer = document.querySelector(".main-container");
  parentContainer.innerHTML = "";
  addLoadingStatus(cityName);
  const currentResult = await fetchCurrentWeahterData(cityName);
  const maxMinResult = await fetchMaxMinWeatherData(cityName);
  const hourlyResult = await fetchHourlyWeatherData(cityName);
  const forecastResult = await fetchThreeDaysWeatherData(cityName);
  const specificInfoResult = await fetchSpecificInformation(cityName);
  chooseImagePath(currentResult.conditionCode, !currentResult.isDay);
  parentContainer.innerHTML = "";
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.innerHTML = `
  <button class="button-container__back-button">
    <svg class="button-container__svg"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  </button>`;
  mainContainer.appendChild(buttonContainer);
  const backButton = document.querySelector(".button-container__back-button");
  backButton.addEventListener("click", () => {
    initMainMenu(cityNames);
  });
  displayCurrentWeahterData(currentResult, maxMinResult);
  displayHourlyWeatherData(currentResult, hourlyResult);
  displayThreeDaysWeatherData(forecastResult);
  displaySpecificInformation("Feuchtigkeit", specificInfoResult.humidity + "%");
  displaySpecificInformation("Gefühlt", specificInfoResult.feelslike + "°");
  displaySpecificInformation(
    "Niederschlag",
    specificInfoResult.precipitation + "mm",
  );
  displaySpecificInformation("UV-Index", specificInfoResult.uvIndex);
  displaySpecificInformation(
    "Sonnenaufgang",
    formatToMilitaryTime(specificInfoResult.sunrise) + " Uhr",
  );
  displaySpecificInformation(
    "Sonnenuntergang",
    formatToMilitaryTime(specificInfoResult.sunset) + " Uhr",
  );
}

initMainMenu(cityNames);
