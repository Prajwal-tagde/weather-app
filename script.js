const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");

const cityInput = document.querySelector(".city-input");
const weatherCardDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");

const API_KEY = "5a04db1d894633b7ef4c3de187f5b852"

const createWeatherCard = (cityName ,weatherItem, index) => {

    // console.log("weather item: ", weatherItem);
    // console.log("weather item");
    // console.log(weatherItem);

    // return `<h1>${weatherItem.dt_txt.split(" ")[0]}</h1>`;
    if(index === 0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>

                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }
    else{
        return `<li class="card">
                    <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }


   
}

const getWeatherDetails =  (cityName, lat, lon) => {
    // const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5a04db1d894633b7ef4c3de187f5b852`;

     fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // console.log(data);

        const uniqueForecastDays = [];

        const fiveDaysForecast = data.list.filter((forecast) => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            // console.log("date"+forecastDate);

            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        })

        console.log(fiveDaysForecast);

        // clearing previous weather data
        cityInput.value = "";
        weatherCardDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            // createWeatherCard(weatherItem);
            // weatherCardDiv.insertAdjacentElement("beforeend",  createWeatherCard(weatherItem));   //this is not working
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName ,weatherItem, index));
            }
            else{
                weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName ,weatherItem, index));
            }
        })

    })
    .catch((err) => {
        alert("An error occured while fetching the weather forecast!");
    })
}

const getCityCoordinates =  () => {
    var cityName = cityInput.value.trim()  //get user entered city name and remove extra space

    if(!cityName) return;

    const GEOCOGIN_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

     fetch(GEOCOGIN_API_URL).then((res) => res.json()).then(data => {
        console.log(data);
        if(!data.length) return alert(`No coordinates found for ${cityName}`);

        const { name, lat, lon } = data[0];

        getWeatherDetails(name, lat, lon);

        
    })
    .catch((err) => {
        alert("An error occured while fetching the coordinates!");
    })
}

// getCurrent Position
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
           const { latitude, longitude } = position.coords;
           const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
           fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            if(!data.length) return alert(`No coordinates found for ${cityName}`)
            
            console.log(data);

            const { name } = data[0];
            getWeatherDetails(name, latitude, longitude);
           })

        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset location persmission to grant access again.")
            }
        }
    )
}

searchButton.addEventListener("click", getCityCoordinates);

locationButton.addEventListener("click", getUserCoordinates);

cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());