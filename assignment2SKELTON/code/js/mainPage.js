// Code for the main app page (locations list).

// This is sample code to demonstrate navigation.
// You need not use it for final app.
/*
function viewLocation(locationName)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName); 
    // And load the view location page.
    location.href = 'viewlocation.html';
}
*/




    // ADDED THIS!!!!
    updateMainList();
    
/*
    window.location = "viewlocation.html";
    viewLocation(locationIndex); 
*/




function viewLocation(locationIndex){
    
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
 
// Source: 6.2 Alexandria Material
// Needs to add the location to the main page when the location is stored in local Storage
// May require a window.onload to update their blank page when they initially load???

// window.onload = ready;
                 
   // Needs access to the locations array!
function updateMainList()
{
    var locationsArray = loadLocations();
    
    for (i = 0; i < locationsArray.length; i++){
    
    var tempLiNode, tempPrimarySpanNode;
    var tempImgNode, tempHeadingSpanNode, tempSummarySpanNode;
    var listOfLocations = document.getElementById("locationList");
    
    // Create an individual 'li' node to be a row for the location
    tempLiNode = document.createElement("li");
    tempLiNode.setAttribute("class", "mdl-list__item mdl-list__item--two-line");
    tempLiNode.setAttribute("id", "location" + i);
    tempLiNode.setAttribute("onclick", "viewLocation(" + i + ");");    
    
    // Create main span node for the primary content
    tempPrimarySpanNode = document.createElement("span");
    tempPrimarySpanNode.setAttribute("class", "mdl-list__item-primary-content");
    tempPrimarySpanNode.setAttribute("id", "mainSpan" + i);
    
    // Create image node
    tempImgNode = document.createElement("img");
    tempImgNode.setAttribute("class", "mdl-list__item-icon");
    tempImgNode.setAttribute("id", "icon" + i);
            // Src will need to change!!!
    tempImgNode.setAttribute("src", "images/loading.png");
    tempImgNode.setAttribute("class", "list-avatar");
    
    // Create Span node for 'heading'
    tempHeadingSpanNode = document.createElement("span")
    tempHeadingSpanNode.textContent = locationsArray[i].nickname;
    
    // Create span node for the weather summary
    tempSummarySpanNode = document.createElement("span");
    tempSummarySpanNode.setAttribute("id", "weather" + i);
    tempSummarySpanNode.setAttribute("class", "mdl-list__item-sub-title");
    
    /*
    // Adds the node in the brackets inside of the node at the start
    tempLiNode.add(tempPrimarySpanNode, null);
    tempPrimarySpanNode.add(tempImgNode, null);
    tempPrimarySpanNode.add(tempHeadingSpanNode, null);
    tempPrimarySpanNode.add(tempSummarySpanNode, null);
    */
    
    // Adds the 'tempLiNode' to the end of the listOfLocations (ul part)
    listOfLocations.appendChild(tempLiNode, null);
    
    // Makes a reference to this newly created li node
    var liNode = document.getElementById("location" + i);
    // Adds directly to this node
    liNode.appendChild(tempPrimarySpanNode, null);
    
    // Makes a reference to this newly created primary span node
    var primarySpanNode = document.getElementById("mainSpan" + i);
    // Adds directly to this node
    primarySpanNode.appendChild(tempImgNode, null);
    primarySpanNode.appendChild(tempHeadingSpanNode, null);
    primarySpanNode.appendChild(tempSummarySpanNode, null);

    }
};



