/*
* Purpose: This file is designed to further details of forecasts and allow the
*          easy removable of the location
* Organization/Team: 301
* Author: Bray Morrow
* Last Modified: 20 May 2016
* Version: 1.3.2
*/

// Set global variables.
var map, marker;

// This function displays a map at the chosen location.
function initMap()
{
    // Get access to the locations array and location index.
    locationsArray = loadLocations();
    Index = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // Display a map, centred on user's chosen position.
    var usersChosenPosition = {lat: locationsArray[Index].latitude, lng: locationsArray[Index].longitude};
    var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: usersChosenPosition
    });
 
    // Display an overlay with a location pin and label.
    var markerPosition = {lat: locationsArray[Index].latitude, lng: locationsArray[Index].longitude};
    var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({
            position: markerPosition,
            map: map
    });
    infowindow.setContent(locationsArray[Index].nickname);
    infowindow.open(map, marker);
}
 
// This function requests current forecast information for the day and displays on the view location page.
function loadPageContent()
{
    locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
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
    
    // Store a date to be retrieved from the the cashe weather response.
    localStorage.setItem(APP_PREFIX + "-selectedDate", dateSimpleString);
    
    // Update the sub heading based on this date.
    document.getElementById("weatherheading").innerHTML = "Weather " + dateSimpleString;
    
    // Gets access to the location index of what is currently being viewed.
    locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // Requests the forecast for a location at a given date.
    locationCacheInstance.getWeatherAtIndexForDate(locationIndex, dateForForecastData, "locationCacheInstance.weatherResponse");
}

// This function removes the location currently being viewed.
function removeThisLocation()
{
    // Gets access to the location index of what is currently being viewed.
    locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // Calls the function within the cashe to remove the location.
    locationCacheInstance.removeLocationAtIndex(locationIndex);
}

loadPageContent()
