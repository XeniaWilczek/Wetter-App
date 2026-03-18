import { getConditionImagePath } from "./conditions.js";

export function formatTemperature(temperature) {
  return Math.round(temperature);
}

export function formatToMilitaryTime(time) {
  //Überprüfung, ob Uhrzeit am Morgen ist
  const isAM = time.includes("AM");
  //Anzeige ohne "AM" pder "PM"
  const timeWithoutSuffix = time.split(" ")[0];
  if (isAM) {
    return timeWithoutSuffix;
  }
  //Anzeige für Uhrzeit nach 12 Uhr mittags
  const [hour, minutes] = timeWithoutSuffix.split(":");
  const newHour = Number(hour) + 12;
  return newHour + ":" + minutes;
}

export function chooseImagePath(conditionCode, isNight = false) {
  const imagePath = getConditionImagePath(conditionCode, isNight);

  if (imagePath) {
    const mainContainer = document.querySelector(".main-container");
    mainContainer.style.backgroundImage = `url(${imagePath})`;
  }
}
