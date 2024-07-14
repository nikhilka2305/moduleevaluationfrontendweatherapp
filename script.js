import { SECRET_API_KEY } from "./SECRET.js";

const API_KEY = SECRET_API_KEY;

// Utility Variable Arrays
const defaultPlaces = ["Kochi", "Kozhikode", "Bengaluru"];
const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

// Form elements
const locationInput = document.querySelector("#locationInput");
const formElement = document.querySelector("#locationSearchForm");
const searchModal = document.querySelector("#locationSearchModal");
const formError = document.querySelector("#errorInputDisplay");
const searchButton = document.querySelector("#searchButton");
// Display Elements for Current Weather
const locationDisplay = document.querySelector("#locationDisplay");
const mainTempDisplay = document.querySelector("#mainTempDisplay");
const feelsLikeTempDisplay = document.querySelector("#feelsLikeTempDisplay");
const weatherDescDisplay = document.querySelector("#weatherDescDisplay");
const minTempDisplay = document.querySelector("#minTempDisplay");
const maxTempDisplay = document.querySelector("#maxTempDisplay");
const pressureDisplay = document.querySelector("#pressureDisplay");
const humidityDisplay = document.querySelector("#humidityDisplay");
const windSpeedDisplay = document.querySelector("#windspeedDisplay");
const windgustDisplay = document.querySelector("#windgustDisplay");
const weatherImageDisplay = document.querySelector("#weatherImageDisplay");
const warningMsg = document.querySelector("#invalidPlaceWarningDisplay");
const currentDateDisplay = document.querySelector("#currentDateDisplay");
const sunriseDisplay = document.querySelector("#sunriseDisplay");
const sunsetDisplay = document.querySelector("#sunsetDisplay");

// Display Elements for Weather Forecast
const day1 = document.querySelector("#day1TempDisplay");
const day2 = document.querySelector("#day2TempDisplay");
const day3 = document.querySelector("#day3TempDisplay");
const day4 = document.querySelector("#day4TempDisplay");
const day1date = document.querySelector("#day1DateDisplay");
const day2date = document.querySelector("#day2DateDisplay");
const day3date = document.querySelector("#day3DateDisplay");
const day4date = document.querySelector("#day4DateDisplay");
const day1weather = document.querySelector("#day1WeatherDisplay");
const day2weather = document.querySelector("#day2WeatherDisplay");
const day3weather = document.querySelector("#day3WeatherDisplay");
const day4weather = document.querySelector("#day4WeatherDisplay");

// Event Listener for Form Submission
formElement.addEventListener("submit", function (evt) {
	evt.preventDefault();

	validateInput();
	// grabWeatherData(locationInput.value);
});

searchButton.addEventListener("click", function () {
	searchModal.classList.add("show");
	searchModal.setAttribute("aria-hidden", "false");
	searchModal.setAttribute("style", "display: block");

	// Add a modal backdrop
	const backdrop = document.createElement("div");
	backdrop.className = "modal-backdrop show";
	document.body.appendChild(backdrop);
});

function validateInput() {
	if (locationInput.value.length > 0) {
		closeModal();
		grabWeatherData(locationInput.value);
		locationInput.value = "";
		formError.style.display = "none";
	} else formError.style.display = "block";
}

// Utility Functions
// Make text title case
function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);
}
// Convert unix time stamp to readable format
function readTimeStamp(unixTimestamp, timezoneOffset) {
	const clientOffset = new Date().getTimezoneOffset();

	const offsetTimestamp = unixTimestamp + clientOffset * 60 + timezoneOffset;

	var date = new Date(offsetTimestamp * 1000);

	return date.toLocaleTimeString("en-US");
}
// Date Formatter
function dateConstructor(date) {
	const correctDate = `${days[new Date(date * 1000).getDay()]},  ${new Date(
		date * 1000
	).getDate()} ${months[new Date(date * 1000).getMonth()]}`;
	return correctDate;
}

function closeModal() {
	// change state like in hidden modal
	searchModal.classList.remove("show");
	searchModal.setAttribute("aria-hidden", "true");
	searchModal.setAttribute("style", "display: none");

	const modalBackdrops = document.getElementsByClassName("modal-backdrop");

	// remove opened modal backdrop
	while (modalBackdrops.length > 0) {
		document.body.removeChild(modalBackdrops[0]);
	}
	formError.style.display = "none";
	// document.body.removeChild(modalBackdrops[0]);
}

// Current Weather

// Load weather details of one of the default locations on loading
window.onload = () => {
	const randomNum = Math.floor(Math.random() * defaultPlaces.length);
	const location = defaultPlaces[randomNum];
	grabWeatherData(location);
};

// Icon Change based on weather condition

function checkWeather(weatherIcon) {
	const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

	return iconUrl;
}

// Display weather details to DOM

function displayWeatherDetails(data, icon) {
	warningMsg.style.display = "none";
	weatherImageDisplay.src = icon;
	locationDisplay.innerHTML = data.name.toUpperCase();
	mainTempDisplay.innerHTML = data.main.temp + "°";
	weatherDescDisplay.innerHTML = toTitleCase(data.weather[0].description);
	feelsLikeTempDisplay.innerHTML = data.main.feels_like + "°";

	currentDateDisplay.innerHTML = dateConstructor(data.dt);
	const sunriseTime = readTimeStamp(data.sys.sunrise, data.timezone);
	const sunsetTime = readTimeStamp(data.sys.sunset, data.timezone);
	sunriseDisplay.innerHTML = sunriseTime;
	sunsetDisplay.innerHTML = sunsetTime;

	minTempDisplay.innerHTML = data.main.temp_min + "°";

	maxTempDisplay.innerHTML = data.main.temp_max + "°";
	pressureDisplay.innerHTML = data.main.pressure;
	humidityDisplay.innerHTML = data.main.humidity;
	windSpeedDisplay.innerHTML = data.wind.speed + " m/s";
	windgustDisplay.innerHTML = data.wind.gust
		? data.wind.gust + " m/s"
		: "Unknown";
}

// Fetch Weather data from OpenWeather API Asynchronously using Fetch & Async Await

async function grabWeatherData(locationName) {
	const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${API_KEY}&units=metric`;
	try {
		const response = await fetch(apiURL, { method: "GET" });
		if (!response.ok) {
			throw new Error("Error fetching data");
		}

		const data = await response.json();

		let weatherIconCode = data.weather[0].icon;

		displayWeatherDetails(data, checkWeather(weatherIconCode));
		const lat = data.coord.lat;
		const lon = data.coord.lon;
		forecastWeather(lat, lon);
	} catch (err) {
		console.log(err);
		warningMsg.style.display = "block";
	}
}

// Weather Forecast

async function forecastWeather(latitude, longitude) {
	const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
	try {
		const response = await fetch(apiURL, { method: "GET" });
		if (!response.ok) {
			throw new Error("Error fetching data");
		}

		const data = await response.json();

		const fourDayData = [
			data.list[8],
			data.list[16],
			data.list[24],
			data.list[32],
		];
		displayForeCastWeatherData(fourDayData);
	} catch (err) {
		console.log(err);
	}
}

function displayForeCastWeatherData(data) {
	day1.innerHTML = data[0].main.temp + "°";
	day2.innerHTML = data[1].main.temp + "°";
	day3.innerHTML = data[2].main.temp + "°";
	day4.innerHTML = data[3].main.temp + "°";

	day1date.innerHTML = dateConstructor(data[0].dt);
	day2date.innerHTML = dateConstructor(data[1].dt);
	day3date.innerHTML = dateConstructor(data[2].dt);
	day4date.innerHTML = dateConstructor(data[3].dt);

	day1weather.innerHTML = toTitleCase(data[0].weather[0].description);
	day2weather.innerHTML = toTitleCase(data[1].weather[0].description);
	day3weather.innerHTML = toTitleCase(data[2].weather[0].description);
	day4weather.innerHTML = toTitleCase(data[3].weather[0].description);
}
