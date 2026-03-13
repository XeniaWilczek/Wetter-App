import "./index.scss";
import {
  fetchCurrentWeahterData,
  fetchForecastWeatherData,
  addLoadingStatus,
  displayCurrentWeahterData,
  displayHourlyWeatherData,
} from "./fetch.js";
const cityName = "Baden-Baden";
async function init() {
  addLoadingStatus(cityName);
  const currentResult = await fetchCurrentWeahterData(cityName);
  const maxMinResult = await fetchForecastWeatherData(cityName);
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.innerHTML = "";
  displayCurrentWeahterData(currentResult, maxMinResult);
  displayHourlyWeatherData(currentResult);
}

init();
