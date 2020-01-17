// Constants and Vars
const KELVIN = 273;
const weatherkey = "3b4cd95a1216d611c0362d7c9a949388";
const googlekey = "AIzaSyBP1QHmFQma8LErOOPfa9rZy0f-gvFhoEA";

// Select Elements
const currNotificationElement = document.querySelector(".curr-notification");
const currIconElement = document.querySelector(".curr-weather-icon");
const currDescElement = document.querySelector(".curr-temperature-description p");
const currTempElement = document.querySelector(".curr-temperature-value p");

const nextNotificationElement = document.querySelector(".next-notification");
const nextIconElement = document.querySelector(".next-weather-icon");
const nextDescElement = document.querySelector(".next-temperature-description p");
const nextTempElement = document.querySelector(".next-temperature-value p");

const twoDayNotificationElement = document.querySelector(".twoDay-notification");
const twoDayIconElement = document.querySelector(".twoDay-weather-icon");
const twoDayDescElement = document.querySelector(".twoDay-temperature-description p");
const twoDayTempElement = document.querySelector(".twoDay-temperature-value p");

const titleElement = document.querySelector(".title-bar");

// Default Weather Data (forecast[0] represents the current day, forecast[1] represents tomorrow, etc...)
var forecast = [];
forecast.push({
    temperature : {
        value: 50,
        feelsLike: 50, 
        unit: "fahrenheit"
    },
    description: "Default",
    iconID: "01d",
    city: "Default",
    state: "Default"
}, 
// This section represents tomorrow 
{
    temperature : {
        value: 50,
        unit: "fahrenheit"
    },
    description: "Default",
    iconID: "01d"
}, 
// This section represents 2 days later
{
    temperature : {
        value: 50,
        unit: "fahrenheit"
    },
    description: "Default",
    iconID: "01d"
});


// Location Data
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    currNotificationElement.style.display = "block";
    currNotificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p";

    nextNotificationElement.style.display = "block";
    nextNotificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p";

    twoDayNotificationElement.style.display = "block";
    twoDayNotificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p";
}

// Function to convert to title case found at https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Function to get the city and the state from google geocoding API
function getLocation(latitude, longitude){
    let api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googlekey}`;

    // Parse the data from the API
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        forecast[0].city = data.results[5].address_components[0].long_name;
        forecast[0].state = data.results[5].address_components[2].short_name;

        // Update the current location in the title bar 
        titleElement.innerHTML = `3 Day Forecast For ${forecast[0].city}, ${forecast[0].state}`;
    });
}


// Function to get the current weather from the open weather API
function getCurrWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherkey}`;

    // Parse the data from the API
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        forecast[0].description = toTitleCase(data.weather[0].description);
        forecast[0].temperature.value = Math.floor(data.main.temp - KELVIN) * 9/5 + 32;
        forecast[0].iconID = data.weather[0].icon;
    })
    .then(function(){
        displayWeather();
    })
}

// Function to get the next days weather from the open weather API
function getNextWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherkey}`;

    // Parse the data (only use the 12:00:00 time for the next day)
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        forecast[1].description = toTitleCase(data.list[6].weather[0].description);
        forecast[1].temperature.value = Math.floor(data.list[6].main.temp - KELVIN) * 9/5 + 32;
        forecast[1].iconID = data.list[6].weather[0].icon;
    })
    .then(function(){
        displayWeather();
    })
}

// Function to get weather for +2 days
function getTwoDayWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherkey}`;

    // Parse the data (only use the 12:00:00 time for the next day)
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        forecast[2].description = toTitleCase(data.list[14].weather[0].description);
        forecast[2].temperature.value = Math.floor(data.list[14].main.temp - KELVIN) * 9/5 + 32;
        forecast[2].iconID = data.list[14].weather[0].icon;
    })
    .then(function(){
        displayWeather();
    })
}

// Function to display the weather
function displayWeather(){
    currIconElement.innerHTML = `<img src="icons/${forecast[0].iconID}.png"/>`;
    currDescElement.innerHTML = `${forecast[0].description}`;
    currTempElement.innerHTML = `${forecast[0].temperature.value} ˚ <span> F</span>`;

    nextIconElement.innerHTML = `<img src="icons/${forecast[1].iconID}.png"/>`;
    nextDescElement.innerHTML = `${forecast[1].description}`;
    nextTempElement.innerHTML = `${forecast[1].temperature.value} ˚ <span> F</span>`;

    twoDayIconElement.innerHTML = `<img src="icons/${forecast[2].iconID}.png"/>`;
    twoDayDescElement.innerHTML = `${forecast[2].description}`;
    twoDayTempElement.innerHTML = `${forecast[2].temperature.value} ˚ <span> F</span>`;
}

// Function to set the position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getLocation(latitude, longitude);
    getCurrWeather(latitude, longitude);
    getNextWeather(latitude, longitude);
    getTwoDayWeather(latitude, longitude);
}

// Function to display error message to user
function showError(error){
    currNotificationElement.style.display = "block";
    currNotificationElement.innerHTML = `<p> ${error.message} </p>`;

    nextNotificationElement.style.display = "block";
    nextNotificationElement.innerHTML = `<p> ${error.message} </p>`;

    twoDayNotificationElement.style.display = "block";
    twoDayNotificationElement.innerHTML = `<p> ${error.message} </p>`;
}
