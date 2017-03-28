
// **************** Notes ****************

// Get token from here https://www.mapbox.com/studio/account/tokens/

// Meaning of the numbers used in the documenation example (https://www.mapbox.com/api-documentation/#static)
// Retrieve a map at -122.4241 longitude, 37.78 latitude.
// Zoom 14.24, bearing 0, and pitch 60. 
// The map will be 600 pixels wide and 600 pixels high.

// Things changed from the example
// streets-v8 --> dark-v9 This will change the map into dark mode
// Change the pitch from 60 to 0 to flatten the map from the angle
// The default view is somewhere in San Francisco so to obtain the world map change the longitude and latitude. I changed it to 0,0
// Change the zoom level to 1
// Since we want a wider view of the world map change 600x600 to 1024x512

// lonitude = x values
// latitude = y values

// Range of these x y values are in angles of ration
// Example: If you Google latitude and longitude of NYC it is 40.7128° N, 74.0059° W
// Refer to the globe image in the Resources folder

// **************** End Notes ****************

// **************** Variables ****************

var mapImage; // Store the loaded image

// How data is split in the cvs file: time stamp, latitude, longitude, someother data, magnitude of the eathquake
var earthquakeData_1Hour;
var earthquakeData_1Day;
var earthquakeData_7Days;
var earthquakeData_30Days;

var centerLatitude = 0;
var centerLongitude = 0;

// 31.2304° N, 121.4737° E - Shanghai, China
// 49.2827° N, 123.1207° W - Vancouvar, Canada. In this example since it is W 123.1207 is changed to -123.1207. Look at the globe image in resources to understand more.

// These measurements are in degrees and must be converted to radians. webMercatorX and webMercatorY takes values in radians.
var latitude = 49.2827;
var longitude = -123.1207;

var zoom = 1;

// **************** End Variables ****************

function preload(){
	// Image (from mapbox) is loaded and displayed to the screen using the loadImage function from p5.js
	mapImage = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1Ijoic2VuYWxrdWxhIiwiYSI6ImNqMGltb251ZjAwazMycW1lZ3NvdmF3NzUifQ.IWW29a6TlrwU5Arm-Aym3A');
	// earthquakeData_1Day = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv'); // A csc file is being loaded. It is a comma seperated value file. 
	earthquakeData_30Days = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
}

// **************** Formula ****************

// Convert latitude and longitude to x y values
// Apply the formula here (https://en.wikipedia.org/wiki/Web_Mercator --> Formulas)
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
// **************** End Formula ****************

function setup() {
	// p5.js - Creates a canvas element in the document, and sets the dimensions of it in pixels.
	createCanvas (1024, 512);

	// We do this so we can work from the center
	// This moves the origin from top to center
	// This will make things easier as the values we get are relative to the center
	translate(width/2, height/2);
	imageMode(CENTER);

	// Draw an image to the main canvas of the p5js sketch
	// Format : image(img,x,y,width,height)
	// img - image to display
	// x - Number: the x-coordinate at which to place the top-left corner of the source image
	// y - Number: the y-coordinate at which to place the top-left corner of the source image
	image(mapImage,0,0);

	var centerX = webMercatorX(centerLongitude);
	var centerY = webMercatorY(centerLatitude);

	for (var i =0; i< earthquakeData_30Days.length; i++){
		// split() breaks a String into pieces using a character or string as the delimiter. 
		// split(value,delim). 
		// value --> the String to be split
		// delim --> the String used to separate the data
		// We don't use quotes here lik "," instead we use regular expressions /,/
		var data = earthquakeData_30Days[i].split(/,/); 
		// var data = earthquakeData_1Day[i].split(/,/); 
		var magnitude = data[4];
		var latitudeData = data[1];
		var longitudeData = data[2];

		// - centerX and and -centerY is doen because x and y values are the difference between the position of the country and the center
		var x = webMercatorX(longitudeData) - centerX;
		var y = webMercatorY(latitudeData) - centerY;

		magnitude = pow(10, magnitude);
		magnitude = sqrt(magnitude);

		var maxMagnitude = sqrt(pow(10,10));

		// Make a circle (ellipse)
		fill(0,255,0, 70); // Sets the color used to fill shapes in the format rgba
		ellipse(x, y, 8, 8); // Draw an oval. x-coordinate, y-coordinate, width and height of ellipse
	}

	// - centerX and and -centerY is doen because x and y values are the difference between the position of the country and the center
	var x = webMercatorX(longitude) - centerX;
	var y = webMercatorY(latitude) - centerY;

	var diameter = map(magnitude, 0 , 10, 0, 60);
	stroke(0,255,0, 70);
	// Make a circle (ellipse)
	fill(0,255,0, 70); // Sets the color used to fill shapes in the format rgba
	ellipse(x, y, diameter, diameter); // Draw an oval. x-coordinate, y-coordinate, width and height of ellipse

}

function draw() {

}