'use strict';
const apiKey = "718938e8a3e4822470de1037fd72347a";
const unit = "metric"; //Celsius
// Elements Selectors
const dateElement = document.querySelector("#date-panel");
const cityElement = document.querySelector("#city-panel");
const formElement = document.querySelector("#input-form");
const ceusiusLink = document.querySelector("#degree-celsius");
const temperature = document.querySelector("#temperature");
const maxTemperatureElement = document.querySelector("#max-temperature");
const minTemperatureElement = document.querySelector("#min-temperature");
const pressureElement = document.querySelector("#pressure-data");
const humidityElement = document.querySelector("#humidity-data");
const weatherDescription = document.querySelector("#weather-description");
const visibilityElement = document.querySelector("#visibility-data");
const feelsLikeElement = document.querySelector("#feels-like");
const searchBtn = document.querySelector("#button-addon2");
const currentBtn = document.querySelector("#button-addon3");

// Functions
function displayWeatherConditions(response) {

    const responsePath = response.data;
    // Addind the timezone according to each city
    const utcTime = new Date();
    const localTime = new Date(utcTime.getTime() + responsePath.timezone * 1000);
    dateElement.innerHTML = formatDate(localTime);

    const mainPath = responsePath.main;
    const currentTemperature = Math.round(mainPath.temp);
    temperature.innerHTML = currentTemperature;
    const maxTemperature = Math.round(mainPath.temp_max);
    const minTemperature = Math.round(mainPath.temp_min);
    maxTemperatureElement.innerHTML = `Day ${maxTemperature}°<i class="fas fa-arrow-up"></i>`;
    minTemperatureElement.innerHTML = `Night ${minTemperature}°<i class="fas fa-arrow-down"></i>`;
    const pressure = mainPath.pressure;
    pressureElement.innerHTML = `Pressure: ${pressure}hPa`;
    const humidity = mainPath.humidity;
    humidityElement.innerHTML = `Humidity: ${humidity}%`;
    const feelsLike = Math.round(mainPath.feels_like);
    feelsLikeElement.innerHTML = `Feels like ${feelsLike}°`;
    const visibility = `Visibility: ${responsePath.visibility / 1000}km`;
    visibilityElement.innerHTML = visibility;
    const description = responsePath.weather[0].description;
    weatherDescription.innerHTML = description;

    const currentCity = responsePath.name;
    const currentCountry = responsePath.sys.country;
    cityElement.innerHTML = `${currentCity}, ${currentCountry}`;
}

function updateCity(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&appid=${apiKey}&units=${unit}`;
    axios.get(url).then(displayWeatherConditions);
}

function handleSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#input-form-control").value.trim();

    updateCity(searchInput);
}

function formatDate(date) {
    let hours = date.getUTCHours();
    if (hours < 10) {
        hours = `0${hours}`
    }
    let minutes = date.getUTCMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let currentDate = date.getUTCDate();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let currentDay = days[date.getUTCDay()];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let currentMonth = months[date.getUTCMonth()];
    return `${currentDay}, ${currentDate} ${currentMonth} ⏰ ${hours}:${minutes}`;
}

function handlePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayWeatherConditions);
}

function getCurrentPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(handlePosition);
}

// Events Listeners
formElement.addEventListener("submit", handleSubmit);
searchBtn.addEventListener("click", handleSubmit);
currentBtn.addEventListener("click", getCurrentPosition)

updateCity('london');
getCurrentPosition();
