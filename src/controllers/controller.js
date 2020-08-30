// this controller function is to handle all the logic
// m is the model in MVC which defines the rules, that means in this app example, the user is not allowed to enter an empty string
// the v is the view which i see on the screen
// the c is the controller where we put our logic and where we interact with the view as well as the data model
const request = require('request');
const axios = require('axios');
const cities = require('all-the-cities');
const yourhandle = require('countrycitystatejson');
const _ = require('lodash');
var allCountries = require("i18n-iso-countries");
const Weather = require("../model/Weather");
const dotenv = require('dotenv'); // this packet is needed to config the .env file
dotenv.config();
const APP_ID = process.env.APP_KEY;


const {
  countries,
  localCities,
  getCitiesByCountryCode,
} = require("country-city-location");



var currentYear = new Date().getFullYear(); // render the current year in the footer

exports.renderHomePage = (req,res) => {
  res.render("index", {
    year: currentYear,
    openImg: "assets/img/greeting.gif"
  });
}


exports.getWeather = (req, res) => {
  var cityName = req.body.city;
  var countryName = req.body.country;
  countryName = _.startCase(countryName);

  cityName = _.startCase(cityName); // make sure the format is Upper first lower rest format, esp: Chigaco, New Chicago
  // console.log(cityName);
  const newArray = cities.filter(city => city.name.match(cityName));

  if (newArray.length > 0) { // this means we have some matches, then we need to narrow it down to the exact match
    var changeToExactCityName = false;
    for (cityInfo of newArray) {
      if (cityInfo.name === cityName) {
        // console.log("cityInfo", cityInfo.name);
        // console.log("cityName", cityName);
        cityName = cityInfo.name;
        changeToExactCityName = true;
      }
    }

    if (changeToExactCityName == false) { // if can't find an exact match, return the first one in the array as the city name
      cityName = newArray[0].name;
    }

  }

  // need to check if the country name is legit
  var addCountryCode = false;
  const countryCode = allCountries.getAlpha2Code(countryName, "en");




  var URL;
  if (typeof countryCode === "undefined") {
    addCountryCode = false;
  } else {
    const allCities = getCitiesByCountryCode(countryCode);

    for (item of allCities) {
      // console.log(item.name);
      if (cityName === item.name) {
        addCountryCode = true;
      }
    }
  }







  if (addCountryCode == true) {
    URL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${APP_ID}`;
  } else {
    URL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APP_ID}`;
  }


  const weather = new Weather(cityName);
  const errorArray = weather.validateUserInput();
  // console.log(errorArray);
  if (errorArray.length > 0) {
    res.render("index", {
      error: errorArray.toString()
    });
  } else {
    axios.get(URL).then((response)=>{
      // console.log(response.data);
      const icon = response.data.weather[0].icon;
      const description = response.data.weather[0].description;
      const id = response.data.weather[0].id;
      var firstDigitInString = (""+id)[0];
      var gif = "";
      switch(firstDigitInString){
        case "2":
          // console.log("thunderstorm");
          gif = "assets/img/thunderstorm.gif"
          break;
        case "3":
          // console.log("drizzle");
          gif = "assets/img/drizzling.gif"
          break;
        case "5":
          // console.log("rainy");
          gif = "assets/img/rainning.gif"
          break;
        case "6":
          // console.log("snowy");
          gif = "assets/img/snowy.gif"
          break;
        case "7":
          // console.log("complicated");
          gif = "assets/img/interesting.gif"
          break;
        case "8":
          var thirdDigitInString = (""+id)[2];
          if (thirdDigitInString === "0") {
            // console.log("Clear Sky");
            gif = "assets/img/clearSky.gif"
          } else {
            // console.log("Cloudy");
            gif = "assets/img/cloudy.gif"
          }
          break;
        default:
          // console.log("test");
          gif = "assets/img/interesting.gif"
      }



      const IMG_URL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const celsius = Math.ceil(response.data.main.temp - 273.15);
      const {humidity, temp}  = response.data.main; // deconstruct the object
      res.render("index",{
        city: cityName,
        degree: celsius,
        img:IMG_URL,
        info: `${celsius}°C, ${description}, the humidity is ${humidity}%`,
        showGif: gif
      });
    }).catch((error) =>{
      console.log(error);
    });
  }




}

exports.renderAboutPage = (req,res) => {
  res.render("about");
}
