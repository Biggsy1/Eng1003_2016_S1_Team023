// Code for the View Location page.

// This is sample code to demonstrate navigation.
// You need not use it for final app.


var locationIndexOfCurrentLocation;
// Index is sent from clicking on the Index page or straight after the save locations button

// Calls the weather API for a new date
function sliderMoved(sliderValue){
    // the new value of slider will mean a new date
    
    // var sliderValue = document.getElementById("slider").getAttribute("value");
    var numberOfDays = 30 - sliderValue;
    
    var date = new Date();
    var msecSince1970 = date.getTime();
    console.log(msecSince1970);

    msecSince1970 += -86400000*numberOfDays;
    date.setTime(msecSince1970);
    // Unsure how this date will go in the function!!!
    
    // this new date is sent to the getWeatherAtIndexForDate 
    
    locationCacheInstance.getWeatherAtIndexForDate(locationIndexOfCurrentLocation, date, "locationCacheInstance.weatherResponse");
    
}



function viewLocation(locationIndex){
    
    locationIndexOfCurrentLocation = locationIndex;
    var locationsArray = loadLocations(); 
    
    // Use the location name for header bar title.
    document.getElementById("headerBarTitle").textContent = locationsArray[locationIndex].nickname;

    initialiseMap(locationsArray, locationIndex);

};



function initialiseMap(locationsArrayToInitialiseMap, Index)
{
    // Display a map, centred on their location.
    var usersChosenLocation = {lat: locationsArrayToInitialiseMap[Index].latitude, lng: locationsArrayToInitialiseMap[Index].longitude};
    var map = new google.maps.Map(document.getElementById("map"), {
            // CAREFUL with zoom!!!
            zoom: 12,
            center: usersChosenLocation
    });
 
    
    // Display an overlay with a location pin and label.
    var usersChosenLocation = {lat: locationsArrayToInitialiseMap[Index].latitude, lng: locationsArrayToInitialiseMap[Index].longitude};
    var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({
            position: usersChosenLocation,
            map: map
    });
    infowindow.setContent(locationsArrayToInitialiseMap[Index].nickname);
    infowindow.open(map, marker);
}
 
 
