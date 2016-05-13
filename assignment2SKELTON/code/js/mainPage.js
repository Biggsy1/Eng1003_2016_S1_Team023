// Code for the main app page (locations list).

// This is sample code to demonstrate navigation.
// You need not use it for final app.

function viewLocation(locationName)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName); 
    // And load the view location page.
    location.href = 'viewlocation.html';
}


// Source: 6.2 Alexandria Material
// Needs to add the location to the main page when the location is stored in local Storage
// May require a window.onload to update their blank page when they initially load???

// window.onload = ready;


                 
   // Needs access to the locations array! Check Weather(0)! Check viewLocation(0)!
function updateMainList(locationIndex, accessToLocationsArray)
{
    var tempLiNode, tempPrimarySpanNode;
    var tempImgNode, tempHeadingSpanNode, tempSummarySpanNode;
    var listOfLocations = document.getElementById("locationList");
    
    // Create an individual 'li' node to be a row for the location
    tempLiNode = document.createElement("li");
    tempLiNode.setAttribute("class", "mdl-list__item mdl-list__item--two-line");
    tempLiNode.setAttribute("id", "location" + locationIndex);
    tempLiNode.onclick = viewLocation(locationIndex);
    
    // Create main span node for the primary content
    tempPrimarySpanNode = document.createElement("span");
    tempPrimarySpanNode.setAttribute("class", "mdl-list__item-primary-content");
    tempPrimarySpanNode.setAttribute("id", "mainSpan" + locationIndex);
    
    // Create image node
    tempImgNode = document.createElement("img");
    tempImgNode.setAttribute("class", "mdl-list__item-icon");
    tempImgNode.setAttribute("id", "icon" + locationIndex);
            // Src will need to change!!!
    tempImgNode.setAttribute("src", "images/loading.png");
    tempImgNode.setAttribute("class", "list-avatar");
    
    // Create Span node for 'heading'
    tempHeadingSpanNode = document.createElement("span")
    tempHeadingSpanNode.textContent = accessToLocationsArray[locationIndex].nickname;
    
    // Create span node for the weather summary
    tempSummarySpanNode = document.createElement("span");
    tempSummarySpanNode.setAttribute("id", "weather" + locationIndex);
    tempSummarySpanNode.setAttribute("class", "mdl-list__item-sub-title");
    
    /*
    // Adds the node in the brackets inside of the node at the start
    tempLiNode.add(tempPrimarySpanNode, null);
    tempPrimarySpanNode.add(tempImgNode, null);
    tempPrimarySpanNode.add(tempHeadingSpanNode, null);
    tempPrimarySpanNode.add(tempSummarySpanNode, null);
    */
    
    // Adds the 'tempLiNode' to the end of the listOfLocations (ul part)
    listOfLocations.add(tempLiNode, null);
    
    // Makes a reference to this newly created li node
    var liNode = document.getElementById("location" + locationIndex);
    // Adds directly to this node
    liNode.add(tempPrimarySpanNode, null);
    
    // Makes a reference to this newly created primary span node
    var primarySpanNode = document.getElementById("mainSpan" + locationIndex);
    // Adds directly to this node
    primarySpanNode.add(tempImgNode, null);
    primarySpanNode.add(tempHeadingSpanNode, null);
    primarySpanNode.add(tempSummarySpanNode, null);

};



