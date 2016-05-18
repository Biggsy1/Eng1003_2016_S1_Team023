// Code for the main app page (locations list).

    // ADDED THIS!!!!
   updateMainList();
   updateWeatherSummaries();



function updateWeatherSummaries(){
    var locationsArray = loadLocations();
    
    // Get todays date and convert to version usable by forecast API
    var date = new Date();
    var todayForecastData = date.forecastDateString();
    
    
    
    // Must call for each Location in the index list
    for (var i = 0; i < locationsArray.length; i++){
    
    locationCacheInstance.getWeatherAtIndexForDate(i, todayForecastData, "locationCacheInstance.weatherResponse");
        
    }
}


// View location cant pass the information to the next page! Therefore check the skeleton code - locally store the Location Index and then look for that in LS on the new page


function viewLocation(locationIndex)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationIndex); 
    // And load the view location page.
    location.href = 'viewlocation.html';
}


// Source: 6.2 Alexandria Material
// Needs to add the location to the main page when the location is stored in local Storage
// May require a window.onload to update their blank page when they initially load???

// window.onload = ready;
       

   // Needs access to the locations array!
function updateMainList()
{
    var locationsArray = loadLocations();
    var listHTML = "";
    var listOfLocations = document.getElementById("locationList"); 
    
    
    for (var i=0; i < locationsArray.length; i++)
            {
                listHTML += "<li class=\"mdl-list__item mdl-list__item--two-line\" onclick=\"viewLocation("+i+");\"> <span class=\"mdl-list__item-primary-content\"> <img class=\"mdl-list__item-icon\" id=\"icon"+i+"\" src=\"images/loading.png\" class=\"list-avatar\">  </img> <span>"+locationsArray[i].nickname+"</span><span id=\"weather"+i+"\" class=\"mdl-list__item-sub-title\"> Weather Summary </span> </span> </li>"      
            }
    
        // Insert the list view elements into the locations list.
        listOfLocations.innerHTML = listHTML;
};



