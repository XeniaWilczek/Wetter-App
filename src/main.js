import "./index.scss";
import {
  fetchCurrentWeahterData,
  fetchMaxMinData,
  displayCurrentWeahterData,
  removeSpinner,
} from "./fetch.js";

async function init() {
  const currentResult = await fetchCurrentWeahterData();
  const maxMinResult = await fetchMaxMinData();
  removeSpinner();
  displayCurrentWeahterData(currentResult, maxMinResult);
}

init();
