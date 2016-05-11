// Code for the View Location page.

// This is sample code to demonstrate navigation.
// You need not use it for final app.

var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation"); 
if (locationIndex !== null)
{
    var locationNames = [ "Location A", "Location B" ];
    // If a location name was specified, use it for header bar title.
    document.getElementById("headerBarTitle").textContent = locationNames[locationIndex];
}



window.onload = function initMap()
{
    // Display a map, centred on their location.
    var usersChosenLocation = {lat: LATITUDE of their place, lng: LONGITUDE of their place};
    var map = new google.maps.Map(document.getElementById("map"), {
            // CAREFUL with zoom!!!
            zoom: 16,
            center: usersChosenLocation
    });
 
    // Display an overlay with a location pin and label.
    var usersChosenLocation = {lat: LATITUDE of their place, lng: LONGITUDE of their place};
    var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({
            position: usersChosenLocation,
            map: map
    });
    infowindow.setContent("NAME ON MARKER");
    infowindow.open(map, marker);
}
 
 
