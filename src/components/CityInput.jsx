import { useContext, useRef, useState, useEffect } from "react";
import AppContext from "../provider/appContext";
import { getCityName, getAllCities } from "../services/weatherService";
import geoCoords from "../utils/geoCoords";

function CityInput() {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const input = useRef();
  const {
    app: { isDark },
    dispatchApp,
  } = useContext(AppContext);

  useEffect(() => {
    const fetchCities = async () => {
      const cities = await getAllCities();
      const cityNames = cities.map((item) => item.city);
      setOptions(cityNames);
    };
    fetchCities();
  }, []);

  let time;

  const handleInput = (e) => {
    const value = e.target.value;
    clearTimeout(time);
    time = setTimeout(() => {
      dispatchApp({ type: "CITY", payload: value });

      // Filter options based on input value and limit to 10 results
      const filtered = options
        .filter((cityName) =>
          cityName.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10);

      setFilteredOptions(filtered);
    }, 500);
  };

  return (
    <div className="input-group">
      <span
        onClick={async () => {
          const coords = await geoCoords();
          dispatchApp({
            type: "GEO_COORDS",
            payload: { lon: coords.longitude, lat: coords.latitude },
          });
          const { country, name } = await getCityName(
            coords.longitude,
            coords.latitude
          );
          dispatchApp({ type: "COUNTRY", payload: country });
          dispatchApp({ type: "CITY", payload: name });
          input.current.value = "";
        }}
        style={isDark ? { background: "#37435a" } : null}
      >
        <i
          className="fa-solid fa-location-crosshairs location-icon"
          style={isDark ? { color: "#FFFFFF" } : null}
        ></i>
      </span>
      <i className="fa-solid fa-magnifying-glass search-icon"></i>
      <input
        type="text"
        ref={input}
        style={isDark ? { background: "#232b39", color: "#fff" } : null}
        placeholder="Search for places ..."
        onInput={handleInput}
        list="options"
      />
      <datalist id="options">
        {filteredOptions.map((cityName, index) => (
          <option key={index} value={cityName} />
        ))}
      </datalist>
    </div>
  );
}

export default CityInput;
