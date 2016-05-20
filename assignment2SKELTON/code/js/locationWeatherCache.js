/*
* Purpose: This file is designed to load, save and access locations and their properties 
*          in Local Storage
* Organization/Team: 301
* Author: Bray Morrow
* Last Modified: 20 May 2016
* Version: 3.0.4
*/

// Returns a date in the format "YYYY-MM-DD".
Date.prototype.simpleDateString = function() {
    function pad(value)
    {
        return ("0" + value).slice(-2);
    }

    var dateString = this.getFullYear() + "-" + 
            pad(this.getMonth() + 1, 2) + '-' + 
            pad(this.getDate(), 2);
    
    return dateString;
}

// Date format required by forecast.io API.
// We always represent a date with a time of midday,
// so our choice of day isn't susceptible to time zone errors.
Date.prototype.forecastDateString = function() {
    return this.simpleDateString() + "T12:00:00";
}



// Code for LocationWeatherCache class and other shared code.
// Set global variable to access the Cashe.
var locationCacheInstance = new LocationWeatherCache();

// Prefix to use for Local Storage.
var APP_PREFIX = "weatherApp";


function LocationWeatherCache()
{
    // Private attributes:

    var locations = [];
    var callbacks = {};

    // Public methods:
    
    
    // Returns the number of locations stored in the cache.
    //
    this.length = function() 
    {
        return locations.length;
    };
    
    // Returns the location object for a given index.
    // Indexes begin at zero.
    //
    this.locationAtIndex = function(index) 
    {
        // Returns whole object for a location.
        return locations[index];
    };

    // Given a latitude, longitude and nickname, this method saves a 
    // new location into the cache (locations array).  It will have an empty 'forecasts'
    // property.  Returns the index of the added location.
    //
    this.addLocation = function(latitude, longitude, nickname)
    {
                // Objectifys the location.
                var locationToBeSet = {
                        nickname: nickname, 
                        latitude: latitude, 
                        longitude: longitude,
                        forecasts: {}
                        };

                // Store place (as object) at the end of the locations array.
                locations.push(locationToBeSet);
    
                // Return index of added location.
                return locations.length - 1; 
     };

    
    // Removes the saved location at the given index.
    // 
    this.removeLocationAtIndex = function(index)
    {
        loadLocations();
        var indexAsNumber = Number(index);
        
        // Locations are shifted down in the array one by one starting from the location to be removed.
        for (var i = indexAsNumber; i < locationCacheInstance.length; i++)
        {
            // A given location at index 'i' is replaced by the next location in array.
            locations[i] = locations[i + 1];
        }
        
        // Remove the last element of the locations array after all locations have moved one.
        locations.pop();
        
        // Update the locations array saved in local storage.
        saveLocations(null, null, null, "removingLocation");
        
    };

    // This method is used by JSON.stringify() to serialise (convert to String) this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() 
    {
        var locationsPDO = locations;
        
        return locationsPDO;
     
    };
    
    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version. Source: 1003 snippets - Saving and restoring class instances.
    // 
    this.initialiseFromPDO = function(locationWeatherCachePDO) 
    {
        // This fills the current instance with the local storage version of the locations array.
        // Note: locationWeatherCachePDO is an array.
        locations = JSON.parse(locationWeatherCachePDO); 
        
        return locations;
    };

    // Request weather for the location at the given index for the
    // specified date.  'date' should be JavaScript Date instance.
    //
    // This method doesn't return anything, but rather calls the 
    // callback function when the weather object is available. This
    // might be immediately or after some indeterminate amount of time.
    // The callback function should have two parameters.  The first
    // will be the index of the location and the second will be the 
    // weather object for that location.
    
    // Two ways it is called: 1) From the main page to get today's weather summary 
    // 2) From the view location page to get current weather and the 29 previous day's weather too.
    //
    this.getWeatherAtIndexForDate = function(index, date, callback) 
    {
        loadLocations();
        // Converts forecast date to simple date.
        var simpleDate = date.substring(0,10);
        
        // A 'Key' for a forecast at a location for a date.
        var forecastAtLocationForDate = locations[index].forecasts["\"" + locations[index].latitude + "," + locations[index].longitude + "," + simpleDate + "\""];
        
        // Checks local storage for a stored forecast for that location at a date (using the 'Key'),
        // if not available, get that forecast from the forecast API.
        if (forecastAtLocationForDate !== null && forecastAtLocationForDate !== undefined)
        {
            // Send the locally stored response to the weatherResponse method.
            locationCacheInstance.weatherResponse(forecastAtLocationForDate);
        }
        else 
        {
            // The call to the forecast API. Source: 'Prac 9 Flights Response'
            var URL = "https://api.forecast.io/forecast/988329b972a83f6343eb72db35594fe6/";
            var script = document.createElement('script');
            script.src = URL + locations[index].latitude + "," + locations[index].longitude + "," + date + "?callback="+callback;
            document.body.appendChild(script);
        }
    
    };
    
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    this.weatherResponse = function(response) 
    {
        var MILES_TO_KM = 1.60934;
        var DECIMAL_TO_PERCENTAGE = 100;
        
        // Get index of the location.
        var index = indexForLocation(response.latitude, response.longitude);
        
        // 1) Main Page use: To get Weather Summary and Icon.
        if (document.getElementById("headerBarTitleMain") !== null)
        {
            //Accesses the weather temperature min and max values.
            var temperatureMin = response.daily.data[0].temperatureMin;
            var temperatureMax = response.daily.data[0].temperatureMax;
            // Converts Fahrenheit to Celsius
            var temperatureMinInCelsius = ((temperatureMin - 32)*5)/9;
            var temperatureMaxInCelsius = ((temperatureMax - 32)*5)/9;
            
            // Updates the 'Summary' on Index page.
            document.getElementById("weather"+index).innerHTML = "Min: " + temperatureMinInCelsius.toFixed(2) + " °C, Max: " + temperatureMaxInCelsius.toFixed(2) + " °C";
            
            // Updates the 'icon' on Index page.
            var icon = response.daily.data[0].icon;
            document.getElementById("icon"+index).setAttribute("src", "images/"+icon+".png")
            
         }
        // 2) View Location Page use: To get specific Weather details.
        else if (document.getElementById("weatherheading") !== null)
        {
            //Accesses the weather summary and updates the view location page.
            var summary = response.daily.data[0].summary
            document.getElementById("summary").innerHTML = "Summary: " + summary;
            
            //Accesses the minimum temperature, converts to celsius and updates the view location page.
            var temperatureMin = response.daily.data[0].temperatureMin
            var temperatureMinInCelsius = ((temperatureMin - 32)*5)/9;
            document.getElementById("minimumTemperature").innerHTML = "Minimum Temperature: " + temperatureMinInCelsius.toFixed(2) + " °C";
            
            //Accesses the maximum temperature, converts to celsius and updates the view location page.
            var temperatureMax = response.daily.data[0].temperatureMax
            var temperatureMaxInCelsius = ((temperatureMax - 32)*5)/9;
            document.getElementById("maximumTemperature").innerHTML = "Maximum Temperature: " + temperatureMaxInCelsius.toFixed(2) + " °C";
            
            //Accesses the humidity, converts to percentage and updates the view location page.
            var humidity = response.daily.data[0].humidity
            var humidityAsPercent = humidity*DECIMAL_TO_PERCENTAGE;
            document.getElementById("humidity").innerHTML = "Humidity: " + humidityAsPercent.toFixed(1) + " %";
            
            //Accesses the wind speed, converts to km/h and updates the view location page.
            var windSpeed = response.daily.data[0].windSpeed 
            var windSpeedInKmperh = windSpeed*MILES_TO_KM;
            document.getElementById("windSpeed").innerHTML = "Wind Speed is: " + windSpeedInKmperh.toFixed(1) + " km/h";
            
            
            // Retrieve the simple date stored in local storage for location currently being viewed.
            var date = localStorage.getItem(APP_PREFIX + "-selectedDate");
            
            // Store this data into the locations array.
            var key = "\"" + locations[index].latitude + "," + locations[index].longitude + "," + date + "\"";
            locations[index].forecasts[key] = response;
           
            // Updates locations array stored in local storage.
            saveLocations(null, null, null, "updatingForecastOnly");
         }
     
     };

    
    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function indexForLocation(latitude, longitude)
    {
        // Checks latitude and longitude passed to this function against each location in the array. 
        for (var i = 0; i < locations.length; i++)  
            {
               if (locations[i].latitude === latitude && locations[i].longitude === longitude)
               { 
                   return i;
               }
            };
            
        return -1;    
    };
}

    
    
// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
    var locationsJSON = localStorage.getItem(APP_PREFIX);
    // If there is no locations array stored, create an array
    if (locationsJSON === undefined || locationsJSON === null || locationsJSON === "0")
    {
        return [];
    };
    
    // Give this new instance (that will be used when entering the website this time) values from 
    // the Local Storage.
    return locationCacheInstance.initialiseFromPDO(locationsJSON);       
}

// Save the singleton locationWeatherCache to Local Storage.
// This function is called each time to "update" the locations array saved in Local Storage. 
// 
function saveLocations(latitude, longitude, nickname, condition)
{
    // If a new location is being saved it must be added to the end of the locations array.
    if (condition === "saveNewLocation")
    { 
        // Get access to the locations array.
        loadLocations();
        var locationIndex = locationCacheInstance.addLocation(latitude, longitude, nickname);
    };
    
    // Save the locations array to local Storage.
    var arrayToBeSavedToLocalStorageString = JSON.stringify(locationCacheInstance);
    localStorage.setItem(APP_PREFIX, arrayToBeSavedToLocalStorageString);
    
    //if the slider is moved we want to REMAIN on the View Location Page.
    if (condition === "saveNewLocation" || condition === "removingLocation")
    { 
          window.location = "index.html";
    };
}
