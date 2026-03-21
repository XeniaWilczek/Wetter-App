import { formatTemperature } from "./utils.js";

const apiURL = "https://api.weatherapi.com/v1/";
const apiKey = "90830fb3c1a343c28d9123005261003";
const apiLanguage = "de";

export async function fetchCurrentWeahterData(cityName) {
  //cityName ist der einzige variable Punkt in der FUnktion; Wert für Stadt wird beim Aufruf gesetzt
  const currentAPI = `${apiURL}/current.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}`;
  const response = await fetch(currentAPI);
  const currentCity = await response.json();
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
  let finalStartIndex;

  if (startIndex !== -1) {
    finalStartIndex = startIndex;
  } else {
    finalStartIndex = currentHour;
  }

  // Ausschnitt immer ab der aktuellen Stunde für die nächsten 24 Stunden
  const nextTwentyFourHours = allHoursData.slice(
    finalStartIndex,
    finalStartIndex + 24,
  );

  return nextTwentyFourHours;
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
