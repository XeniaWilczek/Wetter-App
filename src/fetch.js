import { formatTemperature } from "./utils.js";

const apiURL = "https://api.weatherapi.com/v1";
const apiKey = "90830fb3c1a343c28d9123005261003";
const apiLanguage = "de";

// Holt alle benötigten Wetterdaten mit nur einer API-Anfrage
export async function fetchAllWeatherData(cityName) {
  // cityName ist der einzige variable Punkt; Wert für Stadt wird beim Aufruf gesetzt
  // direkt 3 Tage anfragen für stündliche Daten des aktauellen Tages, für Max-/Min-Werte und für 3-Tage-Vorhersage
  const forecastAPI = `${apiURL}/forecast.json?key=${apiKey}&lang=${apiLanguage}&q=${cityName}&days=3`;

  const response = await fetch(forecastAPI);
  const data = await response.json();

  // 1. Aktuelle Wetterdaten
  const currentAttributes = {
    name: data.location.name,
    currentCountry: data.location.country,
    currentTeperature: formatTemperature(data.current.temp_c),
    condition: data.current.condition.text,
    maxWindSpeed: data.current.wind_kph,
    icon: data.current.condition.icon,
    conditionCode: data.current.condition.code,
    isDay: data.current.is_day === 1,
  };

  // 2. Max/Min-Attribute
  const maxMinAttributes = {
    currentDayMaxTemp: formatTemperature(
      data.forecast.forecastday[0].day.maxtemp_c,
    ),
    currentDayMinTemp: formatTemperature(
      data.forecast.forecastday[0].day.mintemp_c,
    ),
  };

  // 3. Stündliche Wetterdaten (Ausschnitt der nächsten 24 Stunden)
  const currentDayData = data.forecast.forecastday[0].hour;
  const nextDayData = data.forecast.forecastday[1].hour;
  const allHoursData = currentDayData.concat(nextDayData); // beide Listen zusammenfügen

  const currentHour = new Date().getHours(); // Aktuelle Stunde ermitteln

  // Index des Elements finden, das der aktuellen Stunde entspricht
  const startIndex = allHoursData.findIndex((hour) => {
    const hourDate = new Date(hour.time);
    return hourDate.getHours() === currentHour;
  });

  let finalStartIndex = startIndex !== -1 ? startIndex : currentHour;

  // Ausschnitt immer ab der aktuellen Stunde für die nächsten 24 Stunden
  const nextTwentyFourHours = allHoursData.slice(
    finalStartIndex,
    finalStartIndex + 24,
  );

  // 4. Drei-Tage-Vorhersage
  let forecastElements = []; // leeres Array für drei Tag-Objekte
  const threeDaysData = data.forecast.forecastday;

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

    forecastElements.push(dayData); // Tag-Objekte zum Array hinzufügen
  });

  // 5. Spezifische Zusatzinformationen extrahieren
  const specificInformation = {
    humidity: data.current.humidity,
    feelslike: data.current.feelslike_c,
    uvIndex: data.current.uv,
    precipitation: data.current.precip_mm,
    sunrise: data.forecast.forecastday[0].astro.sunrise,
    sunset: data.forecast.forecastday[0].astro.sunset,
  };

  // alle Datenstrukturen zurückgeben
  return {
    currentAttributes,
    maxMinAttributes,
    nextTwentyFourHours,
    forecastElements,
    specificInformation,
  };
}
