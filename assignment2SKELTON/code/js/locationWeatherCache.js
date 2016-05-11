
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
// Set global variables
var nextIDToIssue; 
var locationCacheInstance = new LocationWeatherCache();

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "weatherApp";


function LocationWeatherCache()
{
    // Private attributes:

    var locations = [];
    var callbacks = {};

    // Public methods:
    
    // Returns the number of locations stored in the cache.
    // Done!!!
    this.length = function() 
    {
        return locations.length;
    };
    
    // Returns the location object for a given index.
    // Indexes begin at zero.
    // Done!!! ( not 100% sure though)
    this.locationAtIndex = function(index) 
    {
        // Assuming index is a number, returns whole object for a location
        return locations[index];
    };

    // Given a latitude, longitude and nickname, this method saves a 
    // new location into the cache (LOCATIONS ARRAY?).  It will have an empty 'forecasts'
    // property.  Returns the index of the added location(why?).
    //
    this.addLocation = function(latitude, longitude, nickname)
    {
        console.log("entered addLocation");

                if (localStorage.getItem(APP_PREFIX + "idWell"))
                {
                    // Use existing number well value
                    nextIDToIssue = Number(localStorage.getItem(APP_PREFIX + "idWell"));
                }
                else
                {
                    // Create new number well
                    localStorage.setItem(APP_PREFIX + "idWell", "1");
                    nextIDToIssue = 1;
                }
        
                var locationToBeSet = {
                        nickname: nickname, 
                        latitude: latitude, 
                        longitude: longitude,
                        forecasts: {}
                        };

                var locationToBeSetString = JSON.stringify(locationToBeSet);
        
                    // Store the location
                    localStorage.setItem(APP_PREFIX + nextIDToIssue, locationToBeSetString);

                    nextIDToIssue++;
                

                // Update the number well.
                localStorage.setItem(APP_PREFIX + "idWell", nextIDToIssue);
        
    /*
        WHY IS THIS NEEDED?
        // Return index
        return locationCacheInstance.length;
        
    */  
        
    };

    
    
    // Removes the saved location at the given index.
    // 
    this.removeLocationAtIndex = function(index)
    {
        // WONT NEED SOON
        localStorage.removeItem(APP_PREFIX + index);
        
        // Say locations = [A, B, C, D, E], we want to remove index=2 (location C)
        
        // Locations are shifted down in the array one by one
        for (var i = index; i < locationCacheInstance.length; i++)
            {
                // A given location at index 'i' is replaced by the next location in array 
                locationCacheInstance.locationAtIndex(i) = locationCacheInstance.locationAtIndex(i + 1);
            }
        // Remove the last element of the locations array
        locations.pop();
        
    };

    // This method is used by JSON.stringify() to serialise this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() {
    };

    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version.
    //
    this.initialiseFromPDO = function(locationWeatherCachePDO) {
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
    // 
    this.getWeatherAtIndexForDate = function(index, date, callback) {
    };
    
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    this.weatherResponse = function(response) {
    };

    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function indexForLocation(latitude, longitude)
    {
    };
}

    
    
// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
}

// Save the singleton locationWeatherCache to Local Storage.
//
function saveLocations()
{
}

