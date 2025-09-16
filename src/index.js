const iconMap = {
  "clear-sky-day": "01d",
  "clear-sky-night": "01n",
  "few-clouds-day": "02d",
  "few-clouds-night": "02n",
  "scattered-clouds-day": "03d",
  "scattered-clouds-night": "03n",
  "broken-clouds-day": "04d",
  "broken-clouds-night": "04n",
  "shower-rain-day": "09d",
  "shower-rain-night": "09n",
  "rain-day": "10d",
  "rain-night": "10n",
  "thunderstorm-day": "11d",
  "thunderstorm-night": "11n",
  "snow-day": "13d",
  "snow-night": "13n",
  "mist-day": "50d",
  "mist-night": "50n",
};

function updateWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let temperature = response.data.temperature.current;
  let city = response.data.city;
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");
  let openWeatherIcon = iconMap[response.data.condition.icon];
  iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${openWeatherIcon}@2x.png" class="weather-app-icon" />`;

  cityElement.innerHTML = city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  let windSpeed = Math.round(response.data.wind.speed * 3.6);
  windSpeedElement.innerHTML = `${windSpeed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  console.log(response.data.condition.description);
  console.log(response.data);

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "ta22c25ab23c6669019e2c2b2ocf4595";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "ta22c25ab23c6669019e2c2b2ocf4595";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data);
  let forecastHTML = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(day.time)}</div>
            <img src="https://openweathermap.org/img/wn/${
              iconMap[day.condition.icon]
            }@2x.png" 
     class="weather-forecast-icon" />

            
            <div class="weather-forecast-temperatures">
              <div class="weather-forecast-temperature">
                <strong>${Math.round(day.temperature.maximum)}°</strong>
              </div>
              <div class="weather-forecast-temperature">${Math.round(
                day.temperature.minimum
              )} °</div>
            </div>
          </div>
         `;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHTML;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Tokyo");
