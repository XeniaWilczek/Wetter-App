import "./index.scss";
import {
  fetchCurrentWeahterData,
  fetchMaxMinData,
  addLoadingStatus,
  displayCurrentWeahterData,
} from "./fetch.js";
const cityName = "Baden-Baden";
async function init() {
  addLoadingStatus(cityName);
  const currentResult = await fetchCurrentWeahterData(cityName);
  const maxMinResult = await fetchMaxMinData(cityName);
  displayCurrentWeahterData(currentResult, maxMinResult);
}

init();
