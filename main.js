/**
 * @abstract JavaScript Wrapper for the Forecast.io API using JSONP (without any PHP-based proxies)
 * @link https://github.com/damian-w/forecast.io-javascript-jsonp-api
 * @author Damian Worsdell <damian.w@iinet.net.au>
 * @license GNU GENERAL PUBLIC LICENSE, Version 2, June 1991
 * @copyright Copyright (C) 2015, Damian Worsdell
 */


/* Forecast.io API Variables (Weather Forecasting) */
var FORECAST_URL = 	"https://api.forecast.io/forecast/";
var FORECAST_API = 	"f33d413250b6d07e6fa54b0a0d1bd5fa";	// Your API Key
var latitude     =	"45.5898";	// Your Latitude
var longitude    =	"-122.5951";// Your Longitude
var year         =  "2016"//your year
var month        =	"06"//your month
var day          =	"00"//your day (starts at 0 and increments to 30)
var acOn 		 =  0;
var heaterOn 	 =  0;
var dateArr      =  [];
var acArr 	     =  [];
var heatArr		 = 	[];
var dayCounter	 =	1;


/* Function: Fetch Forecast.io weather forecast */
function fetchWeather() {
	if(dayCounter<= 30){

		//iterate days
		day = incString(day);

		//format of ajax call borrowed from https://github.com/damian-w/forecast.io-javascript-jsonp-api/blob/master/src/main.js
		$.ajax({
			url: FORECAST_URL + FORECAST_API + '/' + latitude + ',' + longitude + "," + year +"-" + month + "-" + day + "T00:00:00" +"?units=auto",
			dataType: "jsonp",
			success: function (data) {

				//check each hour of the day and increment a/c and heater usage, for the 24 hours
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
				acArr.push(acOn);
				heatArr.push(heaterOn);

				//post to html
				document.getElementById("day"+dayCounter.toString()).innerHTML = dateArr[dayCounter-1] +"<br>"+ "A/C: "+acArr[dayCounter-1]+ "<br>"+"Heater: "+heatArr[dayCounter-1];
				dayCounter++;

				//reset ac and heater counters
				acOn = 0;
				heaterOn = 0;
			}

		});
	}
	else{
		alert("There is no more data to display")
	}

	// Fetch the weather every 2 seconds
	if(dayCounter <= 30){
		setTimeout(function() { fetchWeather(); }, 2000);
	}
	console.log("fetchWeather() is done");
}

/*
*helper function to increment string numbers
*this is to help with the missing "0"
*when incememnting numbers
*for the API call to forecast.io
*/
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
