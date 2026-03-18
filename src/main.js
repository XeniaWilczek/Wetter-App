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
} from "./fetch.js";
import { formatToMilitaryTime, chooseImagePath } from "./utils.js";

const cityName = "Baden-Baden";
async function init() {
  addLoadingStatus(cityName);
  const currentResult = await fetchCurrentWeahterData(cityName);
  chooseImagePath(currentResult.conditionCode, !currentResult.isDay);
  const maxMinResult = await fetchMaxMinWeatherData(cityName);
  const hourlyResult = await fetchHourlyWeatherData(cityName);
  const forecastResult = await fetchThreeDaysWeatherData(cityName);
  const specificInfoResult = await fetchSpecificInformation(cityName);
  const parentContainer = document.getElementsByClassName("main-container")[0];
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

init();
