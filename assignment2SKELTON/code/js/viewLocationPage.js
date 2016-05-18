

var map, marker;

loadPageContent()


// Index is sent from clicking on the Index page or straight after the save locations button

// Calls the weather API for a new date
function sliderMoved(sliderValue){
    // the new value of slider will mean a new date
    
    // The number of days before today is 30 less the value of the slide (Remembering the value starts at 30)
    var numberOfDaysBeforeToday = 30 - sliderValue;
    
    // Creates a new date and gets the ms since 1970
    var date = new Date();
    var msecSince1970 = date.getTime();
    console.log(msecSince1970);
    
    
    // Use the ms since 1970 and take away the number of ms in a day by number of days to have the date for previous days
    msecSince1970 += -86400000*numberOfDaysBeforeToday;
    date.setTime(msecSince1970);
    var dateSimpleString = date.simpleDateString(); 
    var dateForForecastData = date.forecastDateString();
    
    // Update the Heading based on this date
    document.getElementById("weatherheading").innerHTML = "Weather " + dateSimpleString;
    
    locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // This info is send to getWeatherAtIndexForDate and hence the Forecast API
    locationCacheInstance.getWeatherAtIndexForDate(locationIndex, dateForForecastData, "locationCacheInstance.weatherResponse");
    
}


function loadPageContent(){
    
    locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    var locationsArray = loadLocations(); 
    
    // Use the location name for header bar title.
    document.getElementById("headerBarTitle").textContent = locationsArray[locationIndex].nickname;

    
    // Call the Weather API for today's date!!
    var date = new Date();
    var todaySimpleDate = date.simpleDateString();
    var todayForecastData = date.forecastDateString();
    
    // Updates the Heading
    document.getElementById("weatherheading").textContent = "Weather " + todaySimpleDate;
    
    locationCacheInstance.getWeatherAtIndexForDate(locationIndex, todayForecastData, "locationCacheInstance.weatherResponse");
};

 
function initMap()
{
    // Get Locations and Index
    locationsArray = loadLocations();
    Index = localStorage.getItem(APP_PREFIX + "-selectedLocation");
    
    // Display a map, centred on User's chosen position.
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
 
