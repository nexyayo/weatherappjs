const listElement = document.querySelector(".list");
const debugResponse = document.getElementById("debug-response");
const responseDiv = document.querySelector(".response");
 
// https://api.openweathermap.org/data/2.5/weather?q=warszawa&appid=943f9ce8428efbed394e81e1fbb8217f&units=metric
 
const successAlert = document.getElementById("success-alert");
const deleteAlert = document.getElementById("success-alert-delete");
const successCityName = document.getElementById("success-city-name");
const errorAlert = document.getElementById("error-alert");


async function getWeatherForNextThreeDays(city) {
    const apiKey = "943f9ce8428efbed394e81e1fbb8217f";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const weatherList = data.list;
        

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

        const todayWeather = findWeatherForDate(today, weatherList);
        const tomorrowWeather = findWeatherForDate(tomorrow, weatherList);
        const dayAfterTomorrowWeather = findWeatherForDate(dayAfterTomorrow, weatherList);

        updateCalendar(today, todayWeather, tomorrow, tomorrowWeather, dayAfterTomorrow, dayAfterTomorrowWeather);
    } catch (error) {
        console.error(error);
    }
}

function updateCalendar(today, todayWeather, tomorrow, tomorrowWeather, dayAfterTomorrow, dayAfterTomorrowWeather) {
    const dayElements = document.querySelectorAll(".day");

    function updateDayElement(dayElement, date, weather) {
        const dayTitle = dayElement.querySelector(".day-title");
        const dayDate = dayElement.querySelector(".day-date");
        const dayTemperature = dayElement.querySelector(".day-temperature");

        dayTitle.textContent = getDayName(date);
        dayDate.textContent = formatDate(date);
        dayTemperature.textContent = `${weather.main.temp} ℃`;
    }

    if (todayWeather) {
        updateDayElement(dayElements[0], today, todayWeather);
    }

    if (tomorrowWeather) {
        updateDayElement(dayElements[1], tomorrow, tomorrowWeather);
    }

    if (dayAfterTomorrowWeather) {
        updateDayElement(dayElements[2], dayAfterTomorrow, dayAfterTomorrowWeather);
    }
}

function getDayName(date) {
    const daysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    return daysOfWeek[date.getDay()];
}


function findWeatherForDate(date, weatherList) {
    for (const weather of weatherList) {
        const weatherDate = new Date(weather.dt * 1000);
        if (weatherDate.getDate() === date.getDate()) {
            return weather;
        }
    }
    return null;
}

async function getData() {
    const userInput = document.getElementById("input-city").value;
    const cityName = document.getElementById("response-title");
    const cityName2 = document.getElementById("response-title2");
    const temperature = document.getElementById("response-temperature");
    const weather = document.getElementById("response-weather");
    const humidity = document.getElementById("response-wilgotnosc");
    const wind = document.getElementById("response-wind");
    const visibility = document.getElementById("response-see");
    const responseDiv = document.querySelector(".response");
    const country = document.getElementById("response-country");
    const weatherDescription = document.getElementById("response-temperature-desc");
    responseDiv.style.display = 'block';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=943f9ce8428efbed394e81e1fbb8217f&units=metric`);
        const data = await response.json();
        
        
        console.log(data)

        //${getWeatherIcon(data.weather[0].icon)}
        cityName.textContent = data.name;
        cityName2.textContent = data.name;
        weather.textContent = `${getWeatherIcon(data.weather[0].icon)}`
        temperature.textContent = `${data.main.temp} ℃`;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} m/s`;
        visibility.textContent = `${data.visibility} m`;
        country.textContent = translateCountryCode(data.sys.country);

        weatherDescription.textContent = `( ${data.weather[0].description} )`;

        // SUKCESY NOTI
        successCityName.textContent = data.name;
        successAlert.style.display = 'block';
        errorAlert.style.display = 'none';

        getWeatherForNextThreeDays(data.name);
    } catch (error) {
        console.error(error);
        cityName.textContent = "⚠️";

        // BŁEDY NOTI
        successAlert.style.display = 'none';
        errorAlert.style.display = 'block';
        weather.textContent = `Błąd`
        temperature.textContent = `Wpisz poprawnie nazwę miasta!`;
        humidity.textContent = `Błąd`;
        wind.textContent = `Błąd`;
        visibility.textContent = `Błąd`;
        country.textContent = `Błąd`;
    }
}


function deleteNoti() {
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    deleteAlert.style.display = 'none';
}

async function deleteResponse() {
    console.log("Deleted");
    const responseDiv = document.querySelector(".response");
    responseDiv.style.display = 'none';

    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    deleteAlert.style.display = 'block';
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}


// KODY DO POGODY
function getWeatherIcon(iconCode) {
    return {
        "01d": "☀️",
        "01n": "🌙",
        "02d": "🌤️",
        "02n": "☁️🌙",
        "03d": "☁️",
        "03n": "☁️🌙",
        "04d": "☁️",
        "04n": "☁️🌙",
        "09d": "🌧️",
        "09n": "🌧️🌙",
        "10d": "🌦️",
        "10n": "🌦️🌙",
        "11d": "🌩️",
        "11n": "🌩️🌙",
        "13d": "❄️",
        "13n": "❄️🌙",
        "50d": "🌫️",
        "50n": "🌫️🌙"
    }[iconCode];
}

// KODY NA PELNE NAZWY
const countryDictionary = {
    "AD": "Andora",
    "AE": "Zjednoczone Emiraty Arabskie",
    "AF": "Afganistan",
    "AG": "Antigua i Barbuda",
    "AI": "Anguilla",
    "AL": "Albania",
    "AM": "Armenia",
    "AO": "Angola",
    "AQ": "Antarktyda",
    "AR": "Argentyna",
    "AS": "Samoa Amerykańskie",
    "AT": "Austria",
    "AU": "Australia",
    "AW": "Aruba",
    "AX": "Wyspy Alandzkie",
    "AZ": "Azerbejdżan",
    "BA": "Bośnia i Hercegowina",
    "BB": "Barbados",
    "BD": "Bangladesz",
    "BE": "Belgia",
    "BF": "Burkina Faso",
    "BG": "Bułgaria",
    "BH": "Bahrajn",
    "BI": "Burundi",
    "BJ": "Benin",
    "BM": "Bermudy",
    "BN": "Brunei",
    "BO": "Boliwia",
    "BQ": "Bonaire, Sint Eustatius i Saba",
    "BR": "Brazylia",
    "BS": "Bahamy",
    "BT": "Bhutan",
    "BV": "Wyspa Bouveta",
    "BW": "Botswana",
    "BY": "Białoruś",
    "BZ": "Belize",
    "CA": "Kanada",
    "CC": "Wyspy Kokosowe",
    "CD": "Demokratyczna Republika Konga",
    "CF": "Republika Środkowoafrykańska",
    "CG": "Kongo",
    "CH": "Szwajcaria",
    "CI": "Wybrzeże Kości Słoniowej",
    "CK": "Wyspy Cooka",
    "CL": "Chile",
    "CM": "Kamerun",
    "CN": "Chiny",
    "CO": "Kolumbia",
    "CR": "Kostaryka",
    "CU": "Kuba",
    "CV": "Republika Zielonego Przylądka",
    "CW": "Curaçao",
    "CX": "Wyspa Bożego Narodzenia",
    "CY": "Cypr",
    "CZ": "Republika Czeska",
    "DE": "Niemcy",
    "DJ": "Dżibuti",
    "DK": "Dania",
    "DM": "Dominika",
    "DO": "Dominikana",
    "DZ": "Algieria",
    "EC": "Ekwador",
    "EE": "Estonia",
    "EG": "Egipt",
    "EH": "Sahara Zachodnia",
    "ER": "Erytrea",
    "ES": "Hiszpania",
    "ET": "Etiopia",
    "FI": "Finlandia",
    "FJ": "Fidżi",
    "FK": "Falklandy (Malwiny)",
    "FM": "Mikronezja",
    "FO": "Wyspy Owcze",
    "FR": "Francja",
    "GA": "Gabon",
    "GB": "Wielka Brytania",
    "GD": "Grenada",
    "GE": "Gruzja",
    "GF": "Gujana Francuska",
    "GG": "Guernsey",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GL": "Grenlandia",
    "GM": "Gambia",
    "GN": "Gwinea",
    "GP": "Gwadelupa",
    "GQ": "Gwinea Równikowa",
    "GR": "Grecja",
    "GS": "Georgia Południowa i Sandwich Południowy",
    "GT": "Gwatemala",
    "GU": "Guam",
    "GW": "Gwinea-Bissau",
    "GY": "Gujana",
    "HK": "Hongkong",
    "HM": "Wyspy Heard i McDonalda",
    "HN": "Honduras",
    "HR": "Chorwacja",
    "HT": "Haiti",
    "HU": "Węgry",
    "ID": "Indonezja",
    "IE": "Irlandia",
    "IL": "Izrael",
    "IM": "Wyspa Man",
    "IN": "Indie",
    "IO": "Brytyjskie Terytorium Oceanu Indyjskiego",
    "IQ": "Irak",
    "IR": "Iran",
    "IS": "Islandia",
    "IT": "Włochy",
    "JE": "Jersey",
    "JM": "Jamajka",
    "JO": "Jordania",
    "JP": "Japonia",
    "KE": "Kenia",
    "KG": "Kirgistan",
    "KH": "Kambodża",
    "KI": "Kiribati",
    "KM": "Komory",
    "KN": "Saint Kitts i Nevis",
    "KP": "Korea Północna",
    "KR": "Korea Południowa",
    "KW": "Kuwejt",
    "KY": "Kajmany",
    "KZ": "Kazachstan",
    "LA": "Laos",
    "LB": "Liban",
    "LC": "Saint Lucia",
    "LI": "Liechtenstein",
    "LK": "Sri Lanka",
    "LR": "Liberia",
    "LS": "Lesotho",
    "LT": "Litwa",
    "LU": "Luksemburg",
    "LV": "Łotwa",
    "LY": "Libia",
    "MA": "Maroko",
    "MC": "Monako",
    "MD": "Mołdawia",
    "ME": "Czarnogóra",
    "MF": "Saint-Martin",
    "MG": "Madagaskar",
    "MH": "Wyspy Marshalla",
    "MK": "Macedonia Północna",
    "ML": "Mali",
    "MM": "Mjanma (Birma)",
    "MN": "Mongolia",
    "MO": "Makau",
    "MP": "Mariany Północne",
    "MQ": "Martynika",
    "MR": "Mauretania",
    "MS": "Montserrat",
    "MT": "Malta",
    "MU": "Mauritius",
    "MV": "Malediwy",
    "MW": "Malawi",
    "MX": "Meksyk",
    "MY": "Malezja",
    "MZ": "Mozambik",
    "NA": "Namibia",
    "NC": "Nowa Kaledonia",
    "NE": "Niger",
    "NF": "Wyspa Norfolk",
    "NG": "Nigeria",
    "NI": "Nikaragua",
    "NL": "Holandia",
    "NO": "Norwegia",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "NZ": "Nowa Zelandia",
    "OM": "Oman",
    "PA": "Panama",
    "PE": "Peru",
    "PF": "Polinezja Francuska",
    "PG": "Papua-Nowa Gwinea",
    "PH": "Filipiny",
    "PK": "Pakistan",
    "PL": "Polska",
    "PM": "Saint-Pierre i Miquelon",
    "PN": "Pitcairn",
    "PR": "Puerto Rico",
    "PS": "Terytoria Palestyńskie",
    "PT": "Portugalia",
    "PW": "Palau",
    "PY": "Paragwaj",
    "QA": "Katar",
    "RE": "Reunion",
    "RO": "Rumunia",
    "RS": "Serbia",
    "RU": "Rosja",
    "RW": "Rwanda",
    "SA": "Arabia Saudyjska",
    "SB": "Wyspy Salomona",
    "SC": "Seszele",
    "SD": "Sudan",
    "SE": "Szwecja",
    "SG": "Singapur",
    "SH": "Wyspa Świętej Heleny",
    "SI": "Słowenia",
    "SJ": "Svalbard i Jan Mayen",
    "SK": "Słowacja",
    "SL": "Sierra Leone",
    "SM": "San Marino",
    "SN": "Senegal",
    "SO": "Somalia",
    "SR": "Surinam",
    "SS": "Sudan Południowy",
    "ST": "Wyspy Świętego Tomasza i Książęca",
    "SV": "Salwador",
    "SX": "Sint Maarten",
    "SY": "Syria",
    "SZ": "Suazi",
    "TC": "Turks i Caicos",
    "TD": "Czad",
    "TF": "Francuskie Terytoria Południowe i Antarktyczne",
    "TG": "Togo",
    "TH": "Tajlandia",
    "TJ": "Tadżykistan",
    "TK": "Tokelau",
    "TL": "Timor Wschodni",
    "TM": "Turkmenistan",
    "TN": "Tunezja",
    "TO": "Tonga",
    "TR": "Turcja",
    "TT": "Trynidad i Tobago",
    "TV": "Tuvalu",
    "TW": "Tajwan",
    "TZ": "Tanzania",
    "UA": "Ukraina",
    "UG": "Uganda",
    "UM": "Wyspy Dalekiej Polinezji Stanów Zjednoczonych",
    "US": "Stany Zjednoczone",
    "UY": "Urugwaj",
    "UZ": "Uzbekistan",
    "VA": "Watykan",
    "VC": "Saint Vincent i Grenadyny",
    "VE": "Wenezuela",
    "VG": "Brytyjskie Wyspy Dziewicze",
    "VI": "Wyspy Dziewicze Stanów Zjednoczonych",
    "VN": "Wietnam",
    "VU": "Vanuatu",
    "WF": "Wallis i Futuna",
    "WS": "Samoa",
    "YE": "Jemen",
    "YT": "Majotta",
    "ZA": "Republika Południowej Afryki",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
    "PL" : "Polska"
  };
  
  // TLUMACZENIE KODU KRAJU
  function translateCountryCode(code) {
    if (countryDictionary[code]) {
      return countryDictionary[code];
    } else {
      return "Brak tłumaczenia";
    }
  }

    // SWIATLO MYSZKI
    const mouseLight = document.createElement("div");
    mouseLight.id = "mouse-light";
    document.body.appendChild(mouseLight);

    // PODAZANIE ZA MYSZKA
    document.addEventListener("mousemove", (event) => {
        mouseLight.style.left = event.clientX + "px";
        mouseLight.style.top = event.clientY + "px";
    });


    // RAIN
    const canvas = document.getElementById("rainCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const drops = [];
    
    function createDrops() {
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const speed = 2 + Math.random() * 3;
    
            drops.push({ x, y, speed });
        }
    }
    
    function drawRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        ctx.fillStyle = "#00f"; // Blue color for raindrops
    
        for (let i = 0; i < drops.length; i++) {
            ctx.beginPath();
            ctx.moveTo(drops[i].x, drops[i].y);
            ctx.lineTo(drops[i].x, drops[i].y + 10);
            ctx.stroke();
            drops[i].y += drops[i].speed;
    
            if (drops[i].y > canvas.height) {
                drops[i].y = 0;
            }
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        drawRain();
    }
    
    createDrops();
    animate();