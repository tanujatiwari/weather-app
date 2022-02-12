const form = document.querySelector('form')
let weatherData;

window.onload = async function getCurLoc() {
    weatherData = await findWeather(28.7041, 77.1025)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

async function getPosition(position) {
    weatherData = await findWeather(position.coords.latitude, position.coords.longitude)
}

const findWeather = async (lat, lon) => {
    try {
        const res = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a683f22f62fa79f3a8516d7d7b2d423b`)
        return res.data
    }
    catch (e) {
        console.log('Something went wrong in findWeather')
    }
}

const findCor = async (city) => {
    try {
        const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a683f22f62fa79f3a8516d7d7b2d423b`)
        return res.data[0]
    } catch (e) {
        console.log('Something went wrong in findCor')
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const searchCity = form.elements.city.value
    const cityData = await findCor(searchCity.toLowerCase());
    weatherData = await findWeather(cityData.lat, cityData.lon);
})