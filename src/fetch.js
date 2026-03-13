import { formatTemperature } from "./utils.js";

//Globale Variablen zum Speichern der Bestandteile der APIs
const apiURL = "https://api.weatherapi.com/v1/";
const apiKey = "90830fb3c1a343c28d9123005261003";
const apiLanguage = "de";

export async function fetchCurrentWeahterData(cityName) {
  //cityName ist der einzige variable Punkt in der FUnktion; fixert Wert "Baden-Baden wird beim Aufruf gesetzt"
  const currentAPI = `${apiURL}/current.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}`;
  const response = await fetch(currentAPI);
  const currentCity = await response.json();
  console.log(currentCity);
  let currentAttributes = {
    name: currentCity.location.name,
    currentTeperature: formatTemperature(currentCity.current.temp_c),
    condition: currentCity.current.condition.text,
    maxWindSpeed: currentCity.current.wind_kph,
    icon: currentCity.current.condition.icon,
  };
  return currentAttributes;
}

export async function fetchForecastWeatherData(cityName) {
  const forecastAPI = `${apiURL}/forecast.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}&days=3`;
  const response = await fetch(forecastAPI);
  const maxMinForecast = await response.json();
  let maxMinAttributes = {
    currentDayMaxTemp: formatTemperature(
      maxMinForecast.forecast.forecastday[0].day.maxtemp_c,
    ),
    currentDayMinTemp: formatTemperature(
      maxMinForecast.forecast.forecastday[0].day.mintemp_c,
    ),
  };
  return maxMinAttributes;
}

export function displayCurrentWeahterData(currentAttributes, maxMinAttributes) {
  const mainWeatherContainer = document.createElement("div");
  mainWeatherContainer.className = "main-data";
  const weatherDetails = `<p class="main-data__city">${currentAttributes.name}</p>
        <p class="main-data__temperature">${currentAttributes.currentTeperature + " °"}</p>
        <p class="main-data__condition">${currentAttributes.condition}</p>
        <div class="main-data__max-min">
<span id="max"></span>${"H:" + maxMinAttributes.currentDayMaxTemp + " "}<span id="min">${"T:" + maxMinAttributes.currentDayMinTemp}</span></div>`;
  mainWeatherContainer.innerHTML = weatherDetails;
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(mainWeatherContainer);
}

export async function addLoadingStatus(cityName) {
  const loadingMessage = document.getElementsByClassName(
    "loading-status__loading-message",
  )[0];
  loadingMessage.innerHTML = `Wetterdaten für ${cityName} werden geladen...`;
}

export function displayHourlyWeatherData(currentAttributes) {
  const hoursContainer = document.createElement("div");
  hoursContainer.className = "hourly-weather";
  const hourlyWeatherDetails = `<div class="hourly-weather__text"><span>${"Heute " + currentAttributes.condition + ". "}</span><span>${"Wind bis zu " + currentAttributes.maxWindSpeed + " km/h"}</span></div>
        <div class="hourly-weather__hours">
          <p "hourly-wather__hour">Jetzt</p>
          <img src="${currentAttributes.icon}" class="hourly-weather__icon"/>
          <p class="hourly-wather__temperature">${currentAttributes.currentTeperature + " °"}</p>
        </div>
        </div>
      </div>`;
  hoursContainer.innerHTML += hourlyWeatherDetails;
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(hoursContainer);
}
