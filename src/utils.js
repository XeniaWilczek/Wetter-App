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
  const isAM = time.includes("AM");
  const timeWithoutSuffix = time.split(" ")[0];
  let [hour, minutes] = timeWithoutSuffix.split(":");

  let numHour = Number(hour);

  if (isAM) {
    // 12 AM ist 00:00 Uhr nachts
    if (numHour === 12) numHour = 0;
  } else {
    // 12 PM bleibt 12:00 Uhr mittags, alle anderen PM-Stunden bekommen +12
    if (numHour !== 12) numHour += 12;
  }

  // Sorgt dafür, dass Stunden unter 10 eine führende Null haben (z.B. "05:30")
  const formattedHour = String(numHour).padStart(2, "0");
  return formattedHour + ":" + minutes;
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
