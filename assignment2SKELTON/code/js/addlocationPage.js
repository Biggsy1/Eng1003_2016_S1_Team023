// Code for the Add Location page.


// Set Global variables
var map, geocoder; 
var marker = null;


// Intitalise map when the window loads, called by HTML page
function initMap() {
         map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: {lat: -25.2744, lng: 133.7751}
        });
    
         geocoder = new google.maps.Geocoder();

      }

var resultsPDO, statusPDO;

// Called every time to find a new location from the user input
      function geocodeAddress() {
        var address = document.getElementById("field1").value;
        geocoder.geocode({"address": address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            // Changes the centre of the map
            map.setCenter(results[0].geometry.location);
            map.setZoom(12);
              
              resultsPDO = results;
              statusPDO = status;
              
            // Create a marker for the user
              if (marker === null)
            {
              marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
            }
              else
              {
                  marker = null;
                  marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
                  });   
              }
              
              // Display formatted address to user
              var infowindow = new google.maps.InfoWindow;
              var content = results[0].formatted_address   
              infowindow.setContent(content);
              infowindow.open(map, marker);
          };
        });
      }
   
// Delays the call of the geocodeAddress function call  
function delay() 
{ 
    setTimeout(geocodeAddress, 600);
};

      

// Called by HTML code when button is clicked
function saveButtonClicked() {
    // Needed so there is access to 'results' and 'status'
    var address = document.getElementById("field1").value;
    geocoder.geocode({"address": address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
                    
                    // Defined private variables that will be passed to the Cashe
                    var temporaryNickname, temporaryLatitude, temporaryLongitude;

                    // Allows access to just the longitude and latitude values from the Google API results
                    var input = results[0].geometry.location;
                    var inputString = JSON.stringify(input);
                    var latlngStr = inputString.split(",", 2);
                    var latSplit = latlngStr[0].split(":", 2); 
                    var lngSplitOne = latlngStr[1].split(":", 2); 
                    var lngSplitTwo = lngSplitOne[1].split("}", 2);                    

                    temporaryLatitude = latSplit[1];
                    temporaryLongitude = lngSplitTwo[0];             

                     // If there is no nickname given, use the actual address name
                     if (document.getElementById("field2").value === "")
                        { 
                            var formattedAddressString = JSON.stringify(results[0].formatted_address);
                            temporaryNickname = formattedAddressString;
                        } 
                     else
                         {
                            temporaryNickname = document.getElementById("field2").value;
                         }
              
                    // Call to the Cashe to store the location persistantly, with parametres as strings
                    // HOW ISNT THIS A FUNCTION????
                    LocationWeatherCache.addLocation(temporaryLatitude, temporaryLongitude, temporaryNickname);

                  }
            // If there is no valid GPS display an alert to the user
            else {
                    window.alert("No valid GPS given. Please try another location.");
                 }
        })            
};

