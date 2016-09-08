/**
 * @abstract JavaScript Wrapper for the Forecast.io API using JSONP (without any PHP-based proxies)
 * @link https://github.com/damian-w/forecast.io-javascript-jsonp-api
 * @author Damian Worsdell <damian.w@iinet.net.au>
 * @license GNU GENERAL PUBLIC LICENSE, Version 2, June 1991
 * @copyright Copyright (C) 2015, Damian Worsdell
 */

var weatherData;

/* Forecast.io API Variables (Weather Forecasting) */
var FORECAST_URL = 	"https://api.forecast.io/forecast/";
var FORECAST_API = 	"f33d413250b6d07e6fa54b0a0d1bd5fa";	// Your API Key
var latitude     =	"45.5898";	// Your Latitude
var longitude    =	"-122.5951";	// Your Longitude
var year         =  "2016"
var month        =	"06"
var day          =	"00"
var acOn 		 =  0;
var heaterOn 	 =  0;
var dateArr      =  [];
var acArr 	     =  [];
var heatArr		 = 	[];

function exeForecast(){
	fetchWeather("fetching", function(){
		displayData();
	});
}

/* Function: Fetch Forecast.io weather forecast */
function fetchWeather(param, callback) {
	for (j = 0; j < 30; j++){//for each day
		if (j>1){
			// setTimeout(, 3000);
		}
		//iterate through day
		day = incString(day);

		//call api to get data for day
		$.ajax({
			url: FORECAST_URL + FORECAST_API + '/' + latitude + ',' + longitude + "," + year +"-" + month + "-" + day + "T00:00:00" +"?units=auto",
			dataType: "jsonp",
			success: function (data) { weatherData = data;	/* Store our newly aquired weather data */

				//check each our fo the day and increment as and heater usage for the 24 hours
				for (i = 0; i < data.hourly.data.length; i++){
					if (data.hourly.data[i].temperature > 75){
						acOn = acOn+1;
					}
					else if (data.hourly.data[i].temperature < 62) {
						heaterOn = heaterOn+1;
					}
				}

				//push all data to arrays for later use
				dateArr.push(year+"-"+month+"-"+day);
				$('#ac').html('and the ac was turned on ' + acOn + " times.");
				console.log("ac "+acOn);
				acArr.push(acOn);
				$('#heater').html('and the heater was turned on ' + heaterOn + " times.");
				console.log("heater "+heaterOn);
				heatArr.push(heaterOn);
				document.getElementById("day"+((j+1).toString())).innerHTML = dateArr[j] +"<br>"+ "A/C: "+acArr[j]+ "<br>"+"Heater: "+heatArr[j];

				//reset ac and heater counters
				acOn = 0;
				heaterOn = 0;
			}

		});
	}

	var stringJson = JSON.stringify(weatherData);
	//console.log("string here "+ stringJson);
	console.log("check for current temp : "+stringJson.current);
	if (callback && typeof(callback) === "function") {
        callback();
    }
	// Fetch the weather every fifteen minutes
	// setTimeout(function() { fetchWeather();  }, 900000);
	console.log("fetchWeather() is done");
}

function displayData(){
	// for(x=1; x <= 30; x++){
	// 	//document.getElementById("day"+x.toString()).innerHTML = x +"<br>"+ "A/C: "+x+ "<br>"+"Heater: "+x;//test
	// 	document.getElementById("day"+x.toString()).innerHTML = dateArr[x-1] +"<br>"+ "A/C: "+acArr[x-1]+ "<br>"+"Heater: "+heatArr[x-1];
	// }
	console.log("displayData() is done");
}

function incString(string){
	var num = Number(string);
	num++;
	var str = num.toString();
	if(str.length < 2){
		return "0"+str;
	}
	else{
		return str;
	}
}
/*
 * Below are some examples on how to use the data collected in weatherData
 * In my project I used the Skycon HTML5 SVG icon set made by Dark Sky themselves as it's tied into the Forecase.io API.
 *
 * Also, I've used Moment.js to handle my times. You might want to go check that out! :)
 */

// Quick Function: Round number to nearest whole number (optional decimal points)
function round(number, points) {
	return number.toFixed(points);
}


/* Current weather conditons
 *
 * This function is a quick example on how you can use the data we've collected in weatherData from fetchWeather().
 * Obvously it's not polished at all, and is totally only a guideline.
 *
 * Example:
 * <weather>
 *   <span class="conditions_current"></span>
 *   <infomation>
 *     <span class="temperature"></span>
 *     <span class="sunrise"></span>
 *     <span class="sunset"></span>
 *     <span class="wind"></span>
 *     <span class="precip_prob"></span>
 *     <span class="humidity"></span>
 *   </infomation>
 * </weather>
 *
 */
function currentWeather() {

	// Animated Skycon for current conditions
	//skycons.set("weatherCurrent", weatherData.currently.icon);    // Skycon Icons by Dark Sky

	// Daily summary
	$('.conditions_current').update(weatherData.hourly.summary);

	// Temperature
	$('.temp_current').update(round(weatherData.currently.temperature, 1) + '&deg;');



	// Daily maximum & minimum temperature
	if (weatherData.flags.units === "us") {
		$('.temperature').update(round(weatherData.daily.data[0].temperatureMax) + '&deg;' + ' / ' + round(weatherData.daily.data[0].temperatureMin) + '&deg;');
	} else {
		$('.temperature').update(round(weatherData.daily.data[0].temperatureMax) + '&deg;' + ' / ' + round(weatherData.daily.data[0].temperatureMin) + '&deg;');
	}

	// Sunrise
	$('.sunrise').update(moment.unix(weatherData.daily.data[0].sunriseTime).format('h.mm a'));

	// Sunset
	$('.sunset').update(moment.unix(weatherData.daily.data[0].sunsetTime).format('h.mm a'));

	// Wind speed + icon (w/ direction rotation)
	$('.wind').update(round(weatherData.currently.windSpeed) + ' kts', 1000);

	// Precip Probability
	$('.precip_prob').update(round(weatherData.daily.data[0].precipProbability) + '%');

	// Humidity
	$('.humidity').update(round(weatherData.daily.data[0].humidity * 100) + '%');
}


/* Forecasted weather conditons
 *
 * This is an example of a loop that we can use, while having a PHP loop setup on the display page
 * to create a weekly forecast. Forecast.io provide data for seven days in advanced.
 *
 * Example:
 * <forecast>
 *   <span class="conditions_future"></span>
 *   <?php
 *     for ($i = 1; $i <= 7; $i++) {
 *       echo "<item>";
 *       echo "	<canvas id='weather$i' class='icon'></canvas>";    // Skycon Icons by Dark Sky
 *       echo "	<span class='day day$i'></span><br />";
 *       echo "	<span class='max max$i'></span>";
 *       echo "	<span class='min min$i'></span>";
 *       echo "</item>";
 *     }
 *   ?>
 * </forecast>
 */
function forecastWeather() {

	// Weekly forcast summary
	$('.conditions_future').update(weatherData.daily.summary);

	// Loop through the next 7 days
	for(var i = 1; i < weatherData.daily.data.length; i++) {
		var obj = weatherData.daily.data[i];
		var day = obj.time;

		// Day title
		var day_day = moment.unix(day).format('dddd');
		$('.day'+i).update(day_day);

		// Maximum
		var day_max = round(obj.temperatureMax);
		$('.max'+i).update(day_max+'&deg;');

		// Minimum
		var day_min = round(obj.temperatureMin);
		$('.min'+i).update('/ ' + day_min+'&deg;');

		// Animated Skycon
		var day_icon = obj.icon;
		skycons.set("weather"+i, day_icon);
	}

}
