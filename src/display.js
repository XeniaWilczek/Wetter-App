import { formatTemperature } from "./utils.js";

export function displayCurrentWeahterData(currentAttributes, maxMinAttributes) {
  const mainWeatherContainer = document.createElement("div");
  mainWeatherContainer.className = "main-data";
  const weatherDetails = `<p class="main-data__city">${currentAttributes.name}</p>
        <p class="main-data__temperature">${currentAttributes.currentTeperature + " °"}</p>
        <p class="main-data__condition">${currentAttributes.condition}</p>
        <div class="main-data__max-min">
<span id="max"></span>${"H:" + maxMinAttributes.currentDayMaxTemp + "° "}<span id="min">${"T:" + maxMinAttributes.currentDayMinTemp + "°"}</span></div>`;
  mainWeatherContainer.innerHTML = weatherDetails;
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(mainWeatherContainer);
}

export function displayHourlyWeatherData(
  currentAttributes,
  nextTwentyFourHours,
) {
  const hoursContainer = document.createElement("div");
  hoursContainer.className = "hourly-weather";
  //Wetter der aktuellen Uhrzeit anzeigen
  const currentWeatherDetails = `<div class="hourly-weather__text"><span>${"Heute " + currentAttributes.condition + ". "}</span><span>${"Wind bis zu " + currentAttributes.maxWindSpeed + " km/h"}</span></div>
        <div class="hourly-weather__hours">
          <div class="hourly-weather__hour">
            <p class="hourly-weather__time">Jetzt</p>
            <img src="${currentAttributes.icon}" class="hourly-weather__icon"/>
            <p class="hourly-weather__temperature">${currentAttributes.currentTeperature + " °"}</p>
          </div>`;

  //Variable zur Anzeige der Wetterdaten der weiteren Stunden
  let hourlyWeatherDetails = "";

  // forEach-Schleife ab Index 1 (aktuellen Wert auslassen,da bereits vorhanden)
  nextTwentyFourHours.slice(1).forEach((element) => {
    const hourlyDate = new Date(element.time);
    const hourlyTime = hourlyDate.getHours();
    const hourlyIcon = element.condition.icon;
    const hourlyTemperature = formatTemperature(element.temp_c);

    // Anhängen der stündlichen Wetterdaten an aktuelle Wetterdaten
    hourlyWeatherDetails += `
      <div class="hourly-weather__hour">
        <p class="hourly-weather__time">${hourlyTime + ":00"}</p>
        <img src="${hourlyIcon}" class="hourly-weather__icon" alt="Wetter Icon"/>
        <p class="hourly-weather__temperature">${hourlyTemperature}°</p>
      </div>`;
  });

  // beide html-String zusammenfügen und divs erst danach schließen (hourly.weather__hours und hourly-weather)
  hoursContainer.innerHTML =
    currentWeatherDetails + hourlyWeatherDetails + `</div></div>`;

  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(hoursContainer);
}

export function displayThreeDaysWeatherData(forecastElements) {
  const forecastContainer = document.createElement("div");
  forecastContainer.className = "threeDaysForecast";

  const forecastHeading = document.createElement("p");
  forecastHeading.className = "threeDaysForecast__text";
  const forecastHeadingText = document.createTextNode(
    "Vorhersage für die nächsten 3 Tage:",
  );
  forecastHeading.appendChild(forecastHeadingText);
  forecastContainer.appendChild(forecastHeading);

  const daysContainer = document.createElement("div");
  daysContainer.className = "threeDaysForecast__days-container";

  // div für jeden der 3 Tage erstellen
  forecastElements.forEach((dayData) => {
    const dayHTML = `
      <div class="threeDaysForecast__day">
        <span class="threeDaysForecast__weekday">${dayData.weekday}</span>
        <img src="${dayData.icon}" alt="Wetter-Icon" class="threeDaysForecast__icon"> 
        <span>${"H " + dayData.maxTemp + "°"}</span> 
        <span>${"T " + dayData.minTemp + "°"}</span> 
        <span>${"Wind: " + dayData.maxWind + "km/h"}</span>
      </div>`;

    daysContainer.innerHTML += dayHTML;
  });

  //Alle Elemente zusammenfügen
  forecastContainer.appendChild(daysContainer);

  const mainContainer = document.querySelector(".main-container");
  mainContainer.appendChild(forecastContainer);
}

export function displaySpecificInformation(heading, text) {
  const mainContainer = document.querySelector(".main-container");
  let specificInfoContainer = document.querySelector(".specific-information");

  // specificInfoContainer nur erzeugen, wenn er noch nicht exisitert (sonst wird er bei jedem Funktionsaufruf erstellt)
  if (!specificInfoContainer) {
    specificInfoContainer = document.createElement("div");
    specificInfoContainer.className = "specific-information";
    mainContainer.appendChild(specificInfoContainer);
  }

  const cardHTML = `
    <div class="specific-information__card">
      <p class="specific-information__heading">${heading}</p>
      <p class="specific-information__text">${text}</p>
    </div>
  `;

  specificInfoContainer.innerHTML += cardHTML;
}

export function displayCity(
  weatherContainer,
  currentAttributes,
  maxMinAttributes,
) {
  const cardWrapper = document.createElement("div");
  cardWrapper.className = "weather-container__wrapper";
  const deleteButton = document.createElement("button");
  deleteButton.className = "weather-container__delete-button";
  deleteButton.innerHTML = `<svg
      class="weather-container__svg"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>`;

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteCity(currentAttributes.name);
    cardWrapper.remove();
  });

  cardWrapper.innerHTML = `

    <div class="weather-container__card" data-city="${currentAttributes.name}">
      <div class="left-column">
        <h3 class="left-column__heading">${currentAttributes.name}</h3>
        <p class="left-column__text">${currentAttributes.currentCountry}</p>
        <p class="left-column__text lower-text">${currentAttributes.condition}</p>
      </div>
      <div class="right-column">
         <h3 class="right-column__temperature">${currentAttributes.currentTeperature}°</h3>
         <p class="right-column__text">
           <span>H:${maxMinAttributes.currentDayMaxTemp}° </span>
           <span>T:${maxMinAttributes.currentDayMinTemp}°</span>
         </p>
      </div>
    </div>`;
  cardWrapper.prepend(deleteButton);
  weatherContainer.appendChild(cardWrapper);
}

export function deleteCity(cityName) {
  const cityNames = JSON.parse(localStorage.getItem("weatherFavorites")) || [];
  const filteredCityNames = cityNames.filter((city) => city !== cityName);
  localStorage.setItem("weatherFavorites", JSON.stringify(filteredCityNames));
}
