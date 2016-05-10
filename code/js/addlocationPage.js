// Code for the Add Location page.


// Set Global variables
var map, geocoder; 
var marker = null;


// Intitalise map when the window loads
window.onload = function initMap() {
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



// Stop multiple markers!!
// Sort out why the initMap is not a function


// !!!!!!!!!
// CONSOLE LOG "results[0].geometry.location" from the function for the local storage thing and save location button

                                                                                         
                                        
                                        

// Use when the user hits save location Button!! 
// NEEDS to access local store / Cashe
// NEEDS if statement to deal with no nickname and invalid GPS      

function saveButtonClicked() {
    var address = document.getElementById("field1").value;
    geocoder.geocode({"address": address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
              
    
    console.log("button was clicked");

    
    console.log("First if statement true");
    console.log("results: " + results);
        
    var temporaryNickname, temporaryLatitude, temporaryLongitude;

    temporaryLatitude = results[0].geometry.location.lat;
    temporaryLongitude = results[0].geometry.location.lng;
    
              
     if (document.getElementById("field2").value === "")
        { 
            temporaryNickname = results[0].formatted_address;
        } 
     else
         {
            temporaryNickname = document.getElementById("field2").value;
         }
        
    LocationWeatherCache.addLocation[temporaryLatitude, temporaryLongitude, temporaryNickname];
        
  }
        
    else {
        window.alert("No valid GPS given. Please try another location.");
    }
    })
              
              
};



        
     /*   
    console.log("button was clicked");
    
    if (statusPDO === google.maps.GeocoderStatus.OK){
    
    console.log("First if statement true");
    console.log("resultsPDO: " + resultsPDO);
        
    var temporaryNickname, temporaryLatitude, temporaryLongitude;

    temporaryLatitude = resultsPDO[0].geometry.location.lat;
    temporaryLongitude = resultsPDO[0].geometry.location.lng;
    
     if (document.getElementById("field2") === null)
        { 
            temporaryNickname = resultsPDO[0].formatted_address;
        } 
     else
         {
            temporaryNickname = document.getElementById("field2").value;
         }
        
    LocationWeatherCache.addLocation(temporaryLatitude, temporaryLongitude, temporaryNickname);
        
  }
    else {
        window.alert("No valid GPS given. Please try another location.");
    }
    

*/











 