const form = document.querySelector('form')
let defaultLoc = 'Agra'

const renderCityImg = (data) => {
    let background = document.querySelector('#city-bg')
    let cityImg = data.results[0].urls.raw
    background.setAttribute("style", "background-image: url(" + cityImg + ");background-position: center; background-size:cover;background-repeat:no-repeat")
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date + ', ' + year;
    return time;
}

const renderWeatherDetails = (data) => {
    let date = document.querySelector('.basic-weather-details h2 span')
    let temp = document.querySelector('.basic-weather-details h3 span')
    let country = document.querySelector('#country')
    let weatherIcon = document.querySelector('.weather-desc .icon')
    let weatherDesc = document.querySelector('.weather-desc p')
    let pressure = document.querySelector('#pressure p')
    let humidity = document.querySelector('#humidity p')
    let visibility = document.querySelector('#visibility p')
    let windSpeed = document.querySelector('#wind-speed p')
    let tempMax = document.querySelector('.temp-max h3 span')
    let tempMin = document.querySelector('.temp-min h3 span')
    temp.innerText = data.main.temp
    date.innerText = timeConverter(data.dt)
    tempMax.innerText = data.main.temp_max
    tempMin.innerText = data.main.temp_min
    pressure.innerText = data.main.pressure
    humidity.innerText = data.main.humidity
    visibility.innerText = data.visibility
    windSpeed.innerText = data.wind.speed
    country.innerText = data.sys.country
    weatherDesc.innerText = data.weather[0].description
    weatherIcon.setAttribute("style", "background-image: url(http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png)")
}

window.onload = async function getCurLoc() {
    let cityData = await findCor(defaultLoc)
    let weatherData = await findWeather(cityData.lat, cityData.lon);
    let locImg = await findImg(defaultLoc)
    renderCityImg(locImg)
    renderWeatherDetails(weatherData)
    form.elements.city.value = defaultLoc
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        console.log("Geolocation is not supported by this browser.")
    }
}

async function getPosition(position) {
    let weatherData = await findWeather(position.coords.latitude, position.coords.longitude)
    const res = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${env.WEATHER_API_KEY}`)
    const locImg = await findImg(res.data.name)
    form.elements.city.value = res.data.name
    renderWeatherDetails(weatherData)
    renderCityImg(locImg)
}

const findImg = async (city) => {
    try {
        const res = await axios.get(`https://api.unsplash.com/search/photos?client_id=${env.UNSPLASH_KEY}&query=${city}&page=1&per_page=1`)
        return res.data
    }
    catch (e) {
        console.log('Something went wrong in findImg')
    }
}

const findWeather = async (lat, lon) => {
    try {
        const res = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env.WEATHER_API_KEY}`)
        return res.data
    }
    catch (e) {
        console.log('Something went wrong in findWeather')
    }
}

const findCor = async (city) => {
    try {
        const res = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${env.WEATHER_API_KEY}`)
        return res.data[0]
    } catch (e) {
        console.log('Something went wrong in findCor')
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const searchCity = form.elements.city.value
    try {
        const cityData = await findCor(searchCity.toLowerCase());
        let weatherData = await findWeather(cityData.lat, cityData.lon);
        const locImg = await findImg(searchCity)
        renderCityImg(locImg)
        renderWeatherDetails(weatherData)
    }
    catch (e) {
        console.log("Something went wrong in search")
    }
})