import axios from "axios";
import config from "../config/config";

async function getCityCoords(city) {
  const response = await axios.get(`${config.WEATHER_API_ENDPOINT}q=${city}`);
  const {
    coord,
    sys: { country },
  } = response.data;
  return { ...coord, country };
}

async function getCityName(lon, lat) {
  const response = await axios.get(
    `${config.WEATHER_API_ENDPOINT}lon=${lon}&lat=${lat}`
  );
  const {
    name,
    sys: { country },
  } = response.data;
  return { name, country };
}

async function getWeather(lon, lat) {
  const response = await axios.get(
    `${config.WEATHER_DATA_ENDPOINT}lon=${lon}&lat=${lat}`
  );
  return response.data;
}

async function getAllCities() {
  const response = await axios.get(config.CITIES_API_ENDPOINT);
  return response.data.data;
}

export { getCityCoords, getCityName, getAllCities };
export default getWeather;
