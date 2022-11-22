import axios from "axios";
import { useState, useEffect } from "react";

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState("");
  const capital = country.capital[0];
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${apiKey}`)
      .then(response => {
        setWeather(response.data);
      })
  }, []);

  const kelvinToCelsius = (temperature) => Math.round(temperature - 273,15);

  return(
    <div>
      <h1> {country.name.common} </h1>
      <p> capital {capital}</p>
      <p> area {country.area} </p>
      <h2> languages: </h2>
      <ul>
        {Object.keys(country.languages).map(k => <li key={k}> {country.languages[k]} </li>)}
      </ul>      
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`}/>
      <h2> Weather in {capital} </h2>
      <div> {weather !== "" && `Temperature: ${kelvinToCelsius(weather.main.temp)}°C` }</div>
      {weather !== "" && 
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather in ${country.name.common}`}/>} 
      <div> {weather !== "" && `  Wind: ${weather.wind.speed} m/s`} </div>
    </div>
  )
}

export default CountryInfo;