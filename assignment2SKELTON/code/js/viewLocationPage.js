/*
* Purpose: This file is designed to provide further details of forecasts and allow for
*          the easy removable of the location
* Organization/Team: 301
* Author: Bray Morrow
* Last Modified: 23 May 2016
* Version: 1.0.1
*/

// Set global variables.
var map, marker, watchID;

function accessCurrentLocation()
{
              var output = document.getElementById("map");

              if (!navigator.geolocation)
              {
                output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
                return;
              }

              function success(position) 
              {
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;
				var accuracy = position.coords.accuracy;
                  
                // Displays accuracy to user.
                document.getElementById("accuracy").innerHTML = "Accurate to: " + accuracy.toFixed(1) + "m";  
				
				// Displays when the DOM was last updated. 
				var now = new Date();
				var options = {
						hour12: true
				};
				document.getElementById("button").innerHTML = "Last updated: " + now.toLocaleTimeString("en-AU", options);     
                 
                // Display a map, centred on user's current position.
                var usersCurrentPosition = {lat: latitude, lng: longitude};
                var map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 12,
                        center: usersCurrentPosition
                    });
                  
                // Call the weather forecast from here
                var date = new Date();
                var todayForecastData = date.forecastDateString();  
                  
                // Store a lat and lng to be retrieved from the the cashe weather response.
                localStorage.setItem(APP_PREFIX + "-currentLocation", latitude+","+longitude);
                
                // Call to update the weather summary for the page.  
                locationCacheInstance.getWeatherAtIndexForDate("-1", todayForecastData, "locationCacheInstance.weatherResponse"); 
              };

              function error() 
              {
                output.innerHTML = "Unable to retrieve your location";
              };

              output.innerHTML = "<p>Locating…</p>";

              navigator.geolocation.getCurrentPosition(success, error);
}
    

// This function displays a map at the chosen location.
function initMap()
{
    // Get access to the locations array and location index.
    locationsArray = loadLocations();
    index = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // If index is -1 (= Current Location), then we need to access the location another way.
    if (index === "-1")
    {
        accessCurrentLocation();
        return;
    }
    
    // Display a map, centred on user's chosen position.
    var usersChosenPosition = {lat: locationsArray[index].latitude, lng: locationsArray[index].longitude};
    var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: usersChosenPosition
    });
 
    // Display an overlay with a location pin and label.
    var markerPosition = {lat: locationsArray[index].latitude, lng: locationsArray[index].longitude};
    var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({
            position: markerPosition,
            map: map
    });
    infowindow.setContent(locationsArray[index].nickname);
    infowindow.open(map, marker);
}
 
// This function requests current forecast information for the day and displays on the view location page.
function loadPageContent()
{
    locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // If it's current location, edit the inner HTML removing the slider and button.
    if (locationIndex === "-1")
    {    
        // Update the heading
        document.getElementById("headerBarTitle").textContent = "Current Location";
		document.getElementById("weatherheading").textContent = "Current Weather";
        // Remove the slider and button
        
    }
    else
    {
        var locationsArray = loadLocations(); 

        // Use the location name for header bar title.
        document.getElementById("headerBarTitle").textContent = locationsArray[locationIndex].nickname;

        // Requests current forecast information for today's date.
        var date = new Date();
        var todaySimpleDate = date.simpleDateString();
        var todayForecastData = date.forecastDateString();

        // Store a date to be retrieved from the the cashe weather response.
        localStorage.setItem(APP_PREFIX + "-selectedDate", todaySimpleDate);

        // Updates the sub heading.
        document.getElementById("weatherheading").textContent = "Weather " + todaySimpleDate;

        // Requests the forecast for a location at a given date.
        locationCacheInstance.getWeatherAtIndexForDate(locationIndex, todayForecastData, "locationCacheInstance.weatherResponse");
    }
};


// This function requests forecast information for a location at a date determined when the slider value 
// is changed.
function sliderMoved(sliderValue)
{
		
		var MILLISECONDS_IN_A_DAY = 86400000;
		var MAX_SLIDER_VALUE = 30;

		// The new value of slider will mean a new date.
		// The number of days before today is 30 less the value of the slide (Remembering the value starts 
		// at 30).
		var numberOfDaysBeforeToday = MAX_SLIDER_VALUE - sliderValue;

		// Creates a new date and gets the milliseconds since 1970.
		var date = new Date();
		var msecSince1970 = date.getTime();

		// Finds the number of milliseconds since 1970 for the selected day based on the slider value.
		msecSince1970 += -MILLISECONDS_IN_A_DAY*numberOfDaysBeforeToday;
		date.setTime(msecSince1970);

		// Converts dates to appropriate formats.
		var dateSimpleString = date.simpleDateString(); 
		var dateForForecastData = date.forecastDateString();

		if (document.getElementById("headerBarTitle").innerHTML !== "Current Location")
		{	
			// Store a date to be retrieved from the the cashe weather response.
			localStorage.setItem(APP_PREFIX + "-selectedDate", dateSimpleString);

			// Update the sub heading based on this date.
			document.getElementById("weatherheading").innerHTML = "Weather " + dateSimpleString;

			// Gets access to the location index of what is currently being viewed.
			locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
		}
		else
		{
			locationIndex = "-1";
			// Update the sub heading based on this date.
			document.getElementById("weatherheading").innerHTML = "Current Weather " + dateSimpleString;
		}
		// Requests the forecast for a location at a given date.
		locationCacheInstance.getWeatherAtIndexForDate(locationIndex, dateForForecastData, "locationCacheInstance.weatherResponse");	
}

// This function removes the location currently being viewed.
function removeThisLocation()
{
	console.log("It is:"+document.getElementById("headerBarTitle").innerHTML);
    // If it's current location, do nothing.
    if (document.getElementById("headerBarTitle").innerHTML !== "Current Location")
    {
        // Gets access to the location index of what is currently being viewed.
        locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");

        // Calls the function within the cashe to remove the location.
        locationCacheInstance.removeLocationAtIndex(locationIndex);
    }
}

loadPageContent()

// If current location is being viewed track the users movements and update location as well as forecast continuously. 
if (document.getElementById("headerBarTitle").innerHTML === "Current Location")
{
		watchID = navigator.geolocation.watchPosition(function(position) {
  
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;
                var accuracy = position.coords.accuracy;
                  
                // Display accuracy to user
                document.getElementById("accuracy").innerHTML = "Accurate to: " + accuracy.toFixed(1) + "m";
	
				// Displays when the DOM was last updated. 
				var now = new Date();
				var options = {
						hour12: true
				};
				document.getElementById("button").innerHTML = "Last updated: " + now.toLocaleTimeString("en-AU", options);
                 
                // Display a map, centred on user's current position.
                var usersCurrentPosition = {lat: latitude, lng: longitude};
                var map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 12,
                        center: usersCurrentPosition
                    });
                  
                // Call the weather forecast from here
                var date = new Date();
                var todayForecastData = date.forecastDateString();  
                  
                // Store a lat and lng to be retrieved from the the cashe weather response.
                localStorage.setItem(APP_PREFIX + "-currentLocation", latitude+","+longitude);
                
                // Call to update the weather summary for the page.  
                locationCacheInstance.getWeatherAtIndexForDate("-1", todayForecastData, "locationCacheInstance.weatherResponse"); 
          });
}		
