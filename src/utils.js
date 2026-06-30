import { getConditionImagePath } from "./conditions.js";

export async function addLoadingStatus(cityName) {
  const parentContainer = document.querySelector(".main-container");
  if (!parentContainer) return;

  const loadingMessage = cityName
    ? `Wetterdaten für ${cityName} werden geladen...`
    : "Laden...";

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
  const isAM = time.toUpperCase().includes("AM");
  const timeWithoutSuffix = time.split(" ")[0];
  let [hour, minutes] = timeWithoutSuffix.split(":");

  let numHour = Number(hour);

  if (isAM) {
    if (numHour === 12) numHour = 0;
  } else {
    if (numHour !== 12) numHour += 12;
  }

  const formattedHour = String(numHour).padStart(2, "0");
  return formattedHour + ":" + minutes;
}

export function chooseImagePath(conditionCode, isNight = false) {
  const mainContainer = document.querySelector(".main-container");
  if (!mainContainer) return;

  const imagePath = getConditionImagePath(conditionCode, isNight);

  if (imagePath) {
    mainContainer.style.backgroundImage = `url('${imagePath}')`;

    const lightImages = ["ice_pellets", "lighting_day", "rain_day", "snow_day"];
    const isLight = lightImages.some((img) => imagePath.includes(img));

    mainContainer.classList.toggle("theme--light", isLight);
  }
}

export function choseMainMenuImage(
  cardElement,
  conditionCode,
  isNight = false,
) {
  if (!cardElement) return;

  const imagePath = getConditionImagePath(conditionCode, isNight);

  if (imagePath) {
    cardElement.style.backgroundImage = `url('${imagePath}')`;
  }

  // Entfernt das helle Theme, wenn wir uns im Hauptmenü befinden
  const mainContainer = document.querySelector(".main-container");
  if (mainContainer) {
    mainContainer.classList.remove("theme--light");
  }
}
