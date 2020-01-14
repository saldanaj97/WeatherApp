// Constants and Vars
const KELVIN = 273;
const weatherkey = "3b4cd95a1216d611c0362d7c9a949388";
const googlekey = "AIzaSyBP1QHmFQma8LErOOPfa9rZy0f-gvFhoEA";

// Select Elements
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const descElement = document.querySelector(".temperature-description p");
const tempElement = document.querySelector(".temperature-value p");
const tempfeelslikeElement = document.querySelector(".temperature-feels-like p");
const locationElement = document.querySelector(".location p");

// Default Weather Data
const weather = {
    temperature : {
        value: 50,
        feelsLike: 50, 
        unit: "fahrenheit"
    },
    description: "Few Clouds",
    iconID: "01d",
    city: "Dallas",
    state: "TX"
};

// Location Data
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p";
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
        weather.city = data.results[0].address_components[2].long_name;
        weather.state = data.results[0].address_components[4].short_name;
    });
}


// Function to get the weather from the open weather API
function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherkey}`;

    // Parse the data from the API
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.description = toTitleCase(data.weather[0].description);
        weather.temperature.value = Math.floor(data.main.temp - KELVIN) * 9/5 + 32;
        weather.temperature.feelsLike = Math.floor(data.main.feels_like - KELVIN) * 9/5 + 32;
        weather.iconID = data.weather[0].icon;
    })
    .then(function(){
        displayWeather();
    });
}

// Function to display the weather
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
    descElement.innerHTML = `${weather.description}`;
    tempElement.innerHTML = `${weather.temperature.value} ˚ <span> F</span>`;
    tempfeelslikeElement.innerHTML = `Feels Like: ${weather.temperature.feelsLike} ˚ <span> F</span>`;
    locationElement.innerHTML = `${weather.city}, ${weather.state}`;
}

// If user clicks the temperature, change the units
tempElement.addEventListener("click", function(){
    // Unit not defined
    if(weather.temperature.unit === undefined){
        return;
    }

    // Temperature is in fahrenheit (Fahrenheit -> Celsius)
    if(weather.temperature.unit == "fahrenheit"){
        // Actual temperature
        var celsius = fahrenheitToCelsius(weather.temperature.value);
        celsius = Math.floor(celsius);
        tempElement.innerHTML = `${celsius}˚<span> C</span>`;

        // Feels like temperature
        var celsius = fahrenheitToCelsius(weather.temperature.feelsLike);
        celsius - Math.floor(celsius);
        tempfeelslikeElement.innerHTML = `Feels Like: ${celsius}˚<span> C</span>`;

        weather.temperature.unit = "celsius";
    }
    else{
        // Temperature is in celsius (Celsius -> Farenheit)
        tempElement.innerHTML = `${weather.temperature.value}˚<span> F</span>`;
        tempfeelslikeElement.innerHTML = `Feels Like: ${weather.temperature.feelsLike}˚<span> F</span>`;
        weather.temperature.unit = "fahrenheit"
    }
});

// Function to set the position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getLocation(latitude, longitude);
    getWeather(latitude, longitude);

}

// Function to display error message to user
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Temp Conversions
function fahrenheitToCelsius(temperature){
    return (temperature - 32) * 5/9;
}
