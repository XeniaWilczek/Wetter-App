import { formatTemperature } from "./utils.js";

//Globale Variablen zum Speichern der Bestandteile der APIs
const apiURL = "https://api.weatherapi.com/v1/";
const apiKey = "90830fb3c1a343c28d9123005261003";
const apiLanguage = "de";

export async function addLoadingStatus(cityName) {
  const parentContainer = document.querySelector(".main-container");

  let loadingMessage;
  if (cityName) {
    loadingMessage = `Wetterdaten für ${cityName} werden geladen...`;
  } else {
    loadingMessage = "Laden...";
  }

  parentContainer.innerHTML = `
    <div class="loading-status">
      <div class="loading-status__loading-message">${loadingMessage}</div>
      <div class="loading-status__lds-ring">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  `;
}

export async function fetchCurrentWeahterData(cityName) {
  //cityName ist der einzige variable Punkt in der FUnktion; fixert Wert "Baden-Baden wird beim Aufruf gesetzt"
  const currentAPI = `${apiURL}/current.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}`;
  const response = await fetch(currentAPI);
  const currentCity = await response.json();
  console.log(currentCity);
  let currentAttributes = {
    name: currentCity.location.name,
    currentCountry: currentCity.location.country,
    currentTeperature: formatTemperature(currentCity.current.temp_c),
    condition: currentCity.current.condition.text,
    maxWindSpeed: currentCity.current.wind_kph,
    icon: currentCity.current.condition.icon,
    conditionCode: currentCity.current.condition.code,
    isDay: currentCity.current.is_day === 1,
  };
  return currentAttributes;
}

export async function fetchMaxMinWeatherData(cityName) {
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
<span id="max"></span>${"H:" + maxMinAttributes.currentDayMaxTemp + "° "}<span id="min">${"T:" + maxMinAttributes.currentDayMinTemp + "°"}</span></div>`;
  mainWeatherContainer.innerHTML = weatherDetails;
  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(mainWeatherContainer);
}

export async function fetchHourlyWeatherData(cityName) {
  const forecastAPI = `${apiURL}/forecast.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}&days=2`;
  const response = await fetch(forecastAPI);
  const data = await response.json();
  //beide Listen zusammenfügen
  const currentDayData = data.forecast.forecastday[0].hour;
  const nextDayData = data.forecast.forecastday[1].hour;
  const allHoursData = currentDayData.concat(nextDayData);

  // Aktuelle Stunde ermitteln
  const currentHour = new Date().getHours();

  //Index des Elements finden, das der aktuellen Stunde entspricht
  const startIndex = allHoursData.findIndex((hour) => {
    const hourDate = new Date(hour.time);
    return hourDate.getHours() === currentHour;
  });

  // Falls der Index nicht gefunden wird, die aktuelle Stunde wählen
  const finalStartIndex = startIndex !== -1 ? startIndex : currentHour;

  // Ausschnitt immer ab der aktuellen Stunde für die nächsten 24 Stunden
  const nextTwentyFourHours = allHoursData.slice(
    finalStartIndex,
    finalStartIndex + 24,
  );

  return nextTwentyFourHours;
}

export function displayHourlyWeatherData(
  currentAttributes,
  nextTwentyFourHours,
) {
  const hoursContainer = document.createElement("div");
  hoursContainer.className = "hourly-weather";

  // html-String für currentWeatherDetails
  const currentWeatherDetails = `<div class="hourly-weather__text"><span>${"Heute " + currentAttributes.condition + ". "}</span><span>${"Wind bis zu " + currentAttributes.maxWindSpeed + " km/h"}</span></div>
        <div class="hourly-weather__hours">
          <div class="hourly-weather__hour">
            <p class="hourly-weather__time">Jetzt</p>
            <img src="${currentAttributes.icon}" class="hourly-weather__icon"/>
            <p class="hourly-weather__temperature">${currentAttributes.currentTeperature + " °"}</p>
          </div>`;

  //Variable zur Anzeige der Wetterdaten der weiteren Stunden
  let hourlyWeatherDetails = "";

  // forEach-Schleife ab Index 1 (aktuellen Wert auslassen)
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

  // beide html-String zusammenfügen und divs erst dann schließen (hourly.weather__hours und hourly-weather)
  hoursContainer.innerHTML =
    currentWeatherDetails + hourlyWeatherDetails + `</div></div>`;

  const parentContainer = document.getElementsByClassName("main-container")[0];
  parentContainer.appendChild(hoursContainer);
}

export async function fetchThreeDaysWeatherData(cityName) {
  const forecastAPI = `${apiURL}/forecast.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}&days=3`;
  const response = await fetch(forecastAPI);
  const weatherData = await response.json();

  // leeres Array für drei Tag-Objekte
  let forecastElements = [];
  const threeDaysData = weatherData.forecast.forecastday;

  threeDaysData.forEach((object, i) => {
    const dateObject = new Date(object.date);
    let dayName = dateObject.toLocaleDateString("de-DE", { weekday: "short" });

    if (i === 0) {
      dayName = "Heute";
    }
    // Tag-Objekt mit erwünschten Eigenschaften aufbauen
    const dayData = {
      date: object.date,
      weekday: dayName,
      maxTemp: formatTemperature(object.day.maxtemp_c),
      minTemp: formatTemperature(object.day.mintemp_c),
      maxWind: object.day.maxwind_kph,
      icon: object.day.condition.icon,
    };

    // Tag-Objekte zum Array hinzufügen
    forecastElements.push(dayData);
  });

  return forecastElements;
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

export async function fetchSpecificInformation(cityName) {
  const forecastAPI = `${apiURL}/forecast.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}&days=1`;
  const response = await fetch(forecastAPI);
  const specificInformation = await response.json();

  return {
    humidity: specificInformation.current.humidity,
    feelslike: specificInformation.current.feelslike_c,
    uvIndex: specificInformation.current.uv,
    precipitation: specificInformation.current.precip_mm,
    sunrise: specificInformation.forecast.forecastday[0].astro.sunrise,
    sunset: specificInformation.forecast.forecastday[0].astro.sunset,
  };
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

//Funktionen für Haupt-Menü
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
