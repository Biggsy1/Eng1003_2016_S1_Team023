/*
* Purpose: This file is designed to load saved locations and provide access to save more locations
*          as well as see further details of forecasts
* Organization/Team: 301
* Author: Bray Morrow
* Last Modified: 23 May 2016
* Version: 1.0.1
*/

// Source: Prac 9 Flights response
// This function updates the rows in the Main Page table. Add more possible functions to change the order of each row, if there is enough time
function updateMainList()
{
    var locationsArray = loadLocations();
    var listHTML = "";
    var listOfLocations = document.getElementById("locationList"); 
    
    // Ensure the Current Location remains on the page.
    listHTML += "<li class=\"mdl-list__item mdl-list__item--two-line\" onclick=\"viewLocation(-1)\"> <span class=\"mdl-list__item-primary-content\"> Current Location </span> </li>"      
    
    // For each element in the array, dynamically create a row in the table.
    for (var i=0; i < locationsArray.length; i++)
    {
        listHTML += "<li class=\"mdl-list__item mdl-list__item--two-line\" onclick=\"viewLocation("+i+");\"> <span class=\"mdl-list__item-primary-content\"> <img class=\"mdl-list__item-icon\" id=\"icon"+i+"\" src=\"images/loading.png\" class=\"list-avatar\">  </img> <span>"+locationsArray[i].nickname+"</span><span id=\"weather"+i+"\" class=\"mdl-list__item-sub-title\"> Weather Summary </span> </span> </li>"      
    }
    
        // Insert the list elements into the locations list.
        listOfLocations.innerHTML = listHTML;
};


// This function updates the min and max temperatures as well as the icon. 
function updateWeatherSummaries()
    {
        var locationsArray = loadLocations();

        // Get todays date and convert to version usable by forecast API.
        var date = new Date();
        var todayForecastData = date.forecastDateString();

        // Must call for each Location in the index list.
        for (var i = 0; i < locationsArray.length; i++)
        {
            // Requests the current daily forecast for a location.
            locationCacheInstance.getWeatherAtIndexForDate(i, todayForecastData, "locationCacheInstance.weatherResponse");
        }
}

// This function saves the location index to Local Storage to use later and allows the user to access a 
// more detailed summary of the forecast.
function viewLocation(locationIndex)
{
    // Save the desired location to local storage.
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationIndex); 
    // Loads the view location page.
    location.href = 'viewlocation.html';
}


// Updates the main page locations and weather summaries each time the user loads the page.
updateMainList();
updateWeatherSummaries();
