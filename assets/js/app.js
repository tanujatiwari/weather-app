const form = document.querySelector('form')
let weatherData;

// window.onload = async function getCurLoc() {
//     weatherData = await findCor('Delhi')
//     const locImg = await findImg('Delhi')
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(getPosition);
//     } else {
//         console.log("Geolocation is not supported by this browser.")
//     }
// }

const findImg = async (city) => {
    const res = await axios.get(`https://api.unsplash.com/search/photos?client_id=${env.secret_key}&query=${city}&page=1&per_page=1`)
    return res.data
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
    const locImg = await findImg(searchCity)
})