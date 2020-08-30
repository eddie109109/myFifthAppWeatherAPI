// it is a convention to start the model file name with a Capital letter

const cities = require('all-the-cities');
const _ = require('lodash');

const Weather = function(data) {
  this.isValidCity = true;
  data = _.startCase(data);
  this.data = data;
  this.error = [] // set up an empty array to start with
  const newArray = cities.filter(city => city.name.match(data));

  if (newArray.length == 0) {
    this.isValidCity = false;
  }

}

Weather.prototype.validateUserInput = function() {
  if (this.data === "") {
    const errorMsg = "Please enter a city name.";
    this.error.push(errorMsg);
  } else if (!this.isValidCity) {
    const errorMsg = "Please enter a valid city name.";
    this.error.push(errorMsg);
  }

  return this.error;
}



module.exports = Weather;
