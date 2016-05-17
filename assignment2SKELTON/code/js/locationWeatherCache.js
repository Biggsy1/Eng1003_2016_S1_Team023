
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
    // new location into the cache (locations array).  It will have an empty 'forecasts'
    // property.  Returns the index of the added location.
    //
    this.addLocation = function(latitude, longitude, nickname)
    {
                // Objectifys the location
                var locationToBeSet = {
                        nickname: nickname, 
                        latitude: latitude, 
                        longitude: longitude,
                        forecasts: {}
                        };

                // Store place (as object) in locations array
                locations.push(locationToBeSet);
    
                // Return index of added location
                return locations.length - 1; 
    };

    
    // Removes the saved location at the given index.
    // 
    this.removeLocationAtIndex = function(index)
    {
        // Say locations = [A, B, C, D, E], we want to remove index=2 (location C) TESTED!
        
        // Locations are shifted down in the array one by one
        for (var i = index; i < locationCacheInstance.length; i++)
            {
                // A given location at index 'i' is replaced by the next location in array 
                locationCacheInstance.locationAtIndex(i) = locationCacheInstance.locationAtIndex(i + 1);
            }
        // Remove the last element of the locations array
        locations.pop();
    };

    // This method is used by JSON.stringify() to serialise (convert to String) this class.
    // Note that the callbacks attribute is only meaningful while there 
    // are active web service requests and so doesn't need to be saved.
    //
    this.toJSON = function() {
        
        var locationsPDO = locations;
        
        return locationsPDO;
     
    };
    
    // Given a public-data-only version of the class (such as from
    // local storage), this method will initialise the current
    // instance to match that version. Source: 1003 snippets - Saving and restoring class instances
    // [{},{}, {}]?
    this.initialiseFromPDO = function(locationWeatherCachePDO) {
    
        locations = JSON.parse(locationWeatherCachePDO);
        // This fills the current instance with the local storage version of the locations array (locationWeatherCachePDO) //    Unsure about the ".locations" inbw PDO and length
        /*for (var i = 0; i < locationWeatherCachePDO.length; i++)
        {
            //RHS of this may need to be CHANGED possibly - How does locationWeatherCachePDO look?
            var location = locationWeatherCachePDO[i];
            locations.push(location);
        }*/
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
    // 
    // Two ways it needs to be called: 1) from the main page to get today's weather summary 2) from the view location page for all the 30 day history
    //
    this.getWeatherAtIndexForDate = function(index, date, callback) {
        
        loadLocations();
        
        var URL = "https://api.forecast.io/forecast/988329b972a83f6343eb72db35594fe6/";
        var script = document.createElement('script');
        script.src = url + locations[index].latitude + "," + locations[index].longitude + "," + time + "?callback="+callback;
        document.body.appendChild(script);
    
    };
    
    // This is a callback function passed to forecast.io API calls.
    // This will be called via JSONP when the API call is loaded.
    //
    // This should invoke the recorded callback function for that
    // weather request.
    //
    this.weatherResponse = function(response) {
        
        
        
        // 1) Main Page use: To get Weather Summary and Icon
        // ACCESS THE LOCATION INDEX?????
        if (document.getElementById("locationList") !== null){
            
            // Basically do what is occuring below
            
            
        }
        // 2) View Location Page use: To get specific Weather details
        else if (document.getElementById("weatherheading") !== null){
            
            var summary = response.//Access to weather summary
            
            
            document.getElementById("summary").nodeValue = "Summary: " + summary;
            
            // Repeat above for other features PLUS 'heading date'
            
        }
        
        
        
 /*       
        ---------------------
        routes = routesArray;
        
        // List view section heading: Flight list
        var listHTML = "";

        //   PART 1:
        // ADD CODE HERE TO ITERATE OVER ROUTES ARRAY AND CREATE
        // LIST ITEMS FOR EACH ROUTE (AS BELOW)
       
        
        // HTML Format of list item is:
        //   <tr> <td onmousedown=\"listRowTapped("+i+")\" class=\"full-width mdl-data-table__cell--non-numeric\">"[SOURCE AIRPORT] -> [DEST AIRPORT]
        //   <div class="subtitle">[AIRLINE CODE], Stops: [STOPS]</div></td></tr>
        //
        
        for (var i=0; i < routes.length; i++)
            {
       listHTML += "<tr> <td onmousedown=\"listRowTapped("+i+")\" class=\"full-width mdl-data-table__cell--non-numeric\">" + routes[i].sourceAirport + " &rarr; " + routes[i].destinationAirport;
       listHTML += "<div class=\"subtitle\">" + routes[i].airline + ", Stops: " + routes[i].stops +"</div></td></tr>";
            }

        // Insert the list view elements into the flights list.
        flightsListElement.innerHTML = listHTML;
 */       
        
    };

    // Private methods:
    
    // Given a latitude and longitude, this method looks through all
    // the stored locations and returns the index of the location with
    // matching latitude and longitude if one exists, otherwise it
    // returns -1.
    //
    function indexForLocation(latitude, longitude)
    {
        // loadLocations(); ?????
        
        for (var i = 0; i < locations.length; i++)  //each locations in my array 
            {
               if (locations[i].latitude === latitude && locations[i].longitude === longitude){
                    
                   return i;
             }
            }
            
        return -1;    
    };
}

    
    
// Restore the singleton locationWeatherCache from Local Storage.
//
function loadLocations()
{
    var locationsJSON = localStorage.getItem(APP_PREFIX);
    if (locationsJSON === undefined || locationsJSON === null || locationsJSON === "0")
       {
           console.log("locations array undefined");
            return [];
       };
    
    //var locationWeatherCachePDO = JSON.parse(locationsJSON);
    //console.log("locationWeatherCachePDO " + locationWeatherCachePDO);
    // Create a new instance of the class --DOING IT GLOBAL FIRST--
    // var locationCacheInstance = new LocationWeatherCache();
    // Give this new instance (that we will work with on this time entering the website) values from the Local Storage
    return locationCacheInstance.initialiseFromPDO(locationsJSON);
              
}

// Save the singleton locationWeatherCache to Local Storage.
//
// This function is called each time to "update" the locations array in Local Storage. 
// Basically needs to access what is already in local storage --> add this new location to the end --> store the locations array over the top of the old array (or delete old and save new)
function saveLocations(latitude, longitude, nickname)
{
    loadLocations();
    
    var locationIndex = locationCacheInstance.addLocation(latitude, longitude, nickname);
    
    var arrayToBeSavedToLocalStorageString = JSON.stringify(locationCacheInstance);
    
    localStorage.setItem(APP_PREFIX, arrayToBeSavedToLocalStorageString);

    // Should recieve info from Addlocationspage
    // locationCacheInstance.Addlocation of this info
    // Save the locations array to local storage overwritting or delete and add a new one
    console.log("SAVED LOCVATION");
    // Load the Index page.
    window.location = "index.html";
    /*
    // ADDED THIS!!!!
    var locationIndexString = JSON.stringify(locationIndex);
    updateMainList(locationIndexString, arrayToBeSavedToLocalStorage);
    
    window.location = "viewlocation.html";
    viewLocation(locationIndex); 
    */
    // Should Return the user to the main page potentially??
}




/* Saves location straight to LS 
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
*/