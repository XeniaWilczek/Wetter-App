import { getConditionImagePath } from "./conditions.js";

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

export function choseMainMenuImage(
  cardElement,
  conditionCode,
  isNight = false,
) {
  const imagePath = getConditionImagePath(conditionCode, isNight);

  if (imagePath && cardElement) {
    cardElement.style.backgroundImage = `url(${imagePath})`;
  }
}
