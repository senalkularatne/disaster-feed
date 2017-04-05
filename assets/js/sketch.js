// **********************
// 	       Notes 
// **********************

// Get token from here https://www.mapbox.com/studio/account/tokens/

// Meaning of the numbers used in loadImage (https://www.mapbox.com/api-documentation/#static)
	// latitude of the center point of the static map
	// longitude of the center point of the static map
	// zoom level (0-22)
	// bearing - rotates the map around its center (0-360 degrees)
	// pitch - tilts the map (0 and  60 degrees)
	// The map will be 600 pixels wide and 600 pixels high.

// lonitude = x values
// latitude = y values

// Range of these x y values are in angles of rotion
// Example: If you Google latitude and longitude of NYC it is 40.7128° N, 74.0059° W
// Refer to the globe image in the Resources folder

// Resources:
// Earthquake Data: https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php

// How latitude and longitude works:
// Example 1. 31.2304° N, 121.4737° E - Shanghai, China
// Example 2. 49.2827° N, 123.1207° W - Vancouvar, Canada. 
// W 123.1207 is changed to -123.1207. Look at the globe image in resources to understand more.

// **********************
// 	     Variables 
// **********************

// Store the loaded image
var mapImage; 

// How data is split in the cvs file: time stamp, latitude, longitude, someother data, magnitude of the eathquake
var earthquakeData_1Hour;
var earthquakeData_1Day;
var earthquakeData_7Days;
var earthquakeData_30Days;

var centerLatitude = 0;
var centerLongitude = 0;

// These measurements are in degrees and must be converted to radians. 
// webMercatorX and webMercatorY functions handles the conversion
var latitude = 49.2827;
var longitude = -123.1207;

var zoom = 1;

// **********************************************
// 	  Load Map Image & earthquake data
// **********************************************

function preload(){
	// Image (from mapbox) is loaded and displayed to the screen using the loadImage function from p5.js
	mapImage = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1Ijoic2VuYWxrdWxhIiwiYSI6ImNqMGltb251ZjAwazMycW1lZ3NvdmF3NzUifQ.IWW29a6TlrwU5Arm-Aym3A');
	
	// A csv file is being loaded. It is a comma seperated value file. 
	earthquakeData_1Hour = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.csv');
	earthquakeData_1Day = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv');
	earthquakeData_7Days = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.csv');
	earthquakeData_30Days = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
}

// **********************
// 	     Formula 
// **********************

// Convert latitude and longitude to that and in degrees to radians
// Apply the formula from here (https://en.wikipedia.org/wiki/Web_Mercator --> Formulas)
// λ = longitude in radians 
// φ = latitude in radians

function webMercatorX(longitude) {
	longitude = radians(longitude);
	// Mapbox uses tiles 512x512 So 512/2 = 256. Change 128 to 256.
	var x =  ((256 / PI) * pow(2, zoom)) * (longitude + PI);
	return x;
}

function webMercatorY(latitude) {
	latitude = radians(latitude);
	var y =  ((256 / PI) * pow(2, zoom)) * (PI - log(tan(PI/4 + latitude/2)));
	return y;
}

// **********************************************
// 	         	         Buttons
// **********************************************

var hourBtn = document.getElementById("btn-hour");
var dayBtn = document.getElementById("btn-1day");
var sevenDaysBtn = document.getElementById("btn-7days");
var thirtyDaysBtn = document.getElementById("btn-30days");
var earthquakeData;

// window.onload = function() {
// 	setup(earthquakeData_1Hour);
// 	console.log("First thing to do!")
// };

hourBtn.onclick = function() {
	setup(earthquakeData_1Hour);
};

dayBtn.onclick = function() {
	setup(earthquakeData_1Day);
};

sevenDaysBtn.onclick = function() {
	setup(earthquakeData_7Days);
};

thirtyDaysBtn.onclick = function() {
	setup(earthquakeData_30Days);
};

// **********************************************
// 	         Setup the earthquake data
// **********************************************

function setup(earthquakeData) {

	// Creates a P5.js canvas and set the dimension (pixels). The number must match the number at mapImage = loadImage('')
	createCanvas (1024, 512);

	// This centers the map image (Refer resources --> Centering)
	translate(width/2, height/2);
	imageMode(CENTER);

	// Draw an image to p5js canvas. Format : image(img,x,y,width,height)
		// img - image to display
		// x - Number: the x-coordinate at which to place the top-left corner of the source image
		// y - Number: the y-coordinate at which to place the top-left corner of the source image
	image(mapImage,0,0);

	if (typeof earthquakeData !== 'undefined') {

		// These are centerlongitude and centerlatidue in radians
		var centerX = webMercatorX(centerLongitude);
		var centerY = webMercatorY(centerLatitude);

		for (var i = 0; i < earthquakeData.length; i++){

			// split() breaks a String into pieces using a character or string as the delimiter. 
			// split(value,delim). 
			// value --> the String to be split
			// delim --> the String used to separate the data
			// We don't use quotes here lik "," instead we use regular expressions /,/
			var data = earthquakeData[i].split(/,/); 
			// var data = earthquakeData_1Day[i].split(/,/); 
			var magnitude = data[4];
			var latitudeData = data[1];
			var longitudeData = data[2];

			// These are longitude and latidue in radians
			// - centerX and and -centerY is doen because x and y values are the difference between the position of the country and the center
			var x = webMercatorX(longitudeData) - centerX;
			var y = webMercatorY(latitudeData) - centerY;

			// *********************
			// 	     Magnitude
			// *********************
			magnitude = pow(10, magnitude);
			magnitude = sqrt(magnitude);

			var  maxMagnitude = sqrt(pow(10,10));	

			var diameter = map(magnitude, 0, maxMagnitude, 0, 1800);

			// Sets color (rgba)
			fill(0, 255, 0, 70); 
			// Draw an oval. x-coordinate, y-coordinate, width and height of ellipse
			ellipse(x, y, diameter, diameter); 
			// Color to put around circle
			stroke(0, 255, 0, 70);	
		}
	}
}
