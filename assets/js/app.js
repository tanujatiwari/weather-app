const form = document.querySelector('form')
let defaultLoc = 'Agra'

const renderCityImg = (data) => {
    let background = document.querySelector('#city-bg')
    let cityImg = data.results[0].urls.raw
    background.setAttribute("style", "background-image: url(" + cityImg + ");background-position: center; background-size:cover;background-repeat:no-repeat")
}

function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let time = month + ' ' + date + ', ' + year;
    return time;
}

const renderWeatherDetails = (data) => {
    let date = document.querySelector('.basic-weather-details h2 span')
    let weatherIcon = document.querySelector('.weather-desc .icon')
    weatherIcon.setAttribute("style", "background-image: url(http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png)")
    document.querySelector('.basic-weather-details h3 span.cur-temp').innerText = data.main.temp
    document.querySelector('.cur-weather-desc').innerText = data.weather[0].main
    document.querySelector('.weather-desc p').innerText = data.weather[0].description
    document.querySelector('#pressure p').innerText = data.main.pressure
    document.querySelector('#humidity p').innerText = data.main.humidity
    document.querySelector('#visibility p').innerText = data.visibility
    document.querySelector('#wind-speed p').innerText = data.wind.speed
    document.querySelector('.temp-max h3 span').innerText = data.main.temp_max
    document.querySelector('.temp-min h3 span').innerText = data.main.temp_min
    date.innerText = timeConverter(data.dt)
    form.elements.city.value = form.elements.city.value
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