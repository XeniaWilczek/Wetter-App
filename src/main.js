import "./index.scss";
import {
  fetchCurrentWeahterData,
  fetchMaxMinWeatherData,
  fetchHourlyWeatherData,
  addLoadingStatus,
  displayCurrentWeahterData,
  displayHourlyWeatherData,
} from "./fetch.js";
const cityName = "Baden-Baden";
async function init() {
  addLoadingStatus(cityName);
  const currentResult = await fetchCurrentWeahterData(cityName);
  const maxMinResult = await fetchMaxMinWeatherData(cityName);
  const hourlyResult = await fetchHourlyWeatherData(cityName);
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.innerHTML = "";
  displayCurrentWeahterData(currentResult, maxMinResult);
  displayHourlyWeatherData(currentResult, hourlyResult);
}

init();
