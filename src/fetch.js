//Globale Variablen zum Speichern der Bestandteile der APIs
const apiURL = "https://api.weatherapi.com/v1/";
const apiKey = "90830fb3c1a343c28d9123005261003";
const apiLanguage = "de";
const apiCity = "Baden-Baden";
//Variablen für APIs müssen nicht expoertiert werden, da sie nur in den fetch-Funktionen gebraucht werden
const currentAPI = `${apiURL}/current.json?key=${apiKey}&lang=${apiLanguage}&q=${apiCity}`;
const forecastAPI = `${apiURL}/forecast.json?key=${apiKey}&lang=${apiLanguage}&q=${apiCity}`;

export async function fetchCurrentWeahterData() {
  const response = await fetch(currentAPI);
  const currentCity = await response.json();
  let currentAttributes = {
    name: currentCity.location.name,
    currentTeperature: currentCity.current.temp_c,
    condition: currentCity.current.condition.text,
  };
  return currentAttributes;
}

export async function fetchMaxMinData() {
  const response = await fetch(forecastAPI);
  const maxMinForecast = await response.json();
  let maxMinAttributes = {
    currentDayMaxTemp: maxMinForecast.forecast.forecastday[0].day.maxtemp_c,
    currentDayMinTemp: maxMinForecast.forecast.forecastday[0].day.mintemp_c,
  };
  return maxMinAttributes;
}

export function displayCurrentWeahterData(currentAttributes, maxMinAttributes) {
  const mainWeatherData = document.getElementsByClassName("main-data")[0];
  const mainWeatherContainer = document.createElement("div");
  mainWeatherContainer.className = "main-data";
  const weatherDetails = `<p class="main-data__city">${currentAttributes.name}</p>
        <p class="main-data__temperature">${currentAttributes.currentTeperature + " °"}</p>
        <p class="main-data__condition">${currentAttributes.condition}</p>
        <div class="main-data__max-min">
          <span id="max">${maxMinAttributes.currentDayMaxTemp}</span>${maxMinAttributes.currentDayMinTemp}<span id="min"></span>`;
  mainWeatherContainer.innerHTML = weatherDetails;
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(mainWeatherContainer);
}

export async function removeSpinner() {
  const currentFetchResult = await fetchCurrentWeahterData();
  const maxMinFetchResult = await fetchMaxMinData();
  const loadingContainer = document.getElementsByClassName("loading-div")[0];
  const mainContainer = document.getElementsByClassName("main-container")[0];
  if (currentFetchResult && maxMinFetchResult) {
    mainContainer.classList.remove("loading-status");
    loadingContainer.classList.remove("spinning");
  }
}
