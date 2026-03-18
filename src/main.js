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
  cardEvents,
} from "./fetch.js";
import { formatToMilitaryTime, chooseImagePath } from "./utils.js";

const cityName = "Baden-Baden";

//Funktion für das Haupt-Menü

async function initMainMenu(cityName) {
  const parentContainer = document.querySelector(".main-container");
  parentContainer.innerHTML = "";
  addLoadingStatus(cityName);
  const currentAttributes = await fetchCurrentWeahterData(cityName);
  const maxMinAttributes = await fetchMaxMinWeatherData(cityName);
  parentContainer.innerHTML = "";
  displayCity(currentAttributes, maxMinAttributes);
  const weatherContainer = document.querySelector(".weather-container");

  // Event-Listener: weatherContainer, Stadtname und  init-Funktion (wegen kreisförmiger Abhängigkeit)
  cardEvents(weatherContainer, cityName, init);
}

//Funktion für die Detailansicht einer Stadt

async function init(cityName) {
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

initMainMenu(cityName);
