$j = jQuery; 

var voronoi = false; 
var networkFlooding = true;
var MAX_FIELDS = 6; 
var CROSS_OCEAN_URI = "SPAINTOAFRICA";
var sitesByEiSearch = sortSitesByeiSearch();

L.mapbox.accessToken = 'pk.eyJ1IjoiY2phY2tzMDQiLCJhIjoiVFNPTXNrOCJ9.k6TnctaSxIcFQJWZFg0CBA';
var map = L.mapbox.map('map', 'cjacks04.jij42jel', { 
					zoomControl: false, 
					infoControl: false, 
					attributionControl: true}).setView([31, 35], 5);

var attribution = L.control.attribution().addTo(map);
attribution.addAttribution('Tiles and Data &copy; 2013 <a href="http://www.awmc.unc.edu" target="_blank">AWMC</a> ' +
				     '<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US" target="_blank">CC-BY-NC 3.0</a>');
new L.Control.Zoom( { position: 'bottomleft'}).addTo(map);

/*------------------------------------------------------
 * SETUP SITES 
 *------------------------------------------------------*/

/* note to self: 
 * svg: appending svg appends <svg/> to an element so you can draw all the shapes etc. 
 * g : appending g to svg allows you to group multiple svg shapes, so you can transform them all as if 
 *     they were a single shape. 
 */ 

map._initPathRoot()
var svg = d3.select("#map").select("svg");
g = svg.append("g")
/* SITES */
var sitesByTopURI = sortSitesByTopURI(); 


/* INITIALIZE MAP: MAKE THIS A FUNC! */ 
// init map: onLoad, do the following -- 
// set up sites, set up paths 
// initialize all the UTIL arrays


// DEAL WITH SITES VS. SITES WITH ROUTES. 
var sitesWithRoutes = new Array(); 
removeSitesWithoutRoutes();
var sites = sitesWithRoutes; 
sites.concat(places.data.filter(isDefaultTopType));
function isDefaultTopType(element, index, array) {
	return ( element.topType == 'metropoles' || 
		     element.topType == 'capitals'   || 
		     element.topType == 'temp'       || 
		     element.topType == 'towns'      ||
		     element.topType == 'villages'   || 
		     element.topType == 'waystations'||
		     element.topType == 'sites') 
}

/* Add a LatLng object to each item in the dataset */
sites.forEach(function(d) {
	d.LatLng = new L.LatLng(d.lat, d.lon);
})

svgSites = g.selectAll("circle")
		.data(sites) //change back to "sites"
		.enter()
		.append("circle")
		.attr("r", 2)
		.classed('node', true) 
		.call(d3.helper.tooltip(
			function(d, i){
				return createPopup(d);
			})
		);

var text = g.selectAll("text")
	.data(sites)
	.enter()
	.append("text")
	.text(function(d) { return d.arTitle})
	.classed('arabic label', true)
	.style("visibility", "hidden");

showAllPaths(); 
function restoreDefaultMap() {
	g.selectAll('circle.node').style("visibility", "hidden");
	g.selectAll("circle.node")
 		   .filter(function(d) { return isDefaultTopType(d)})
 		   .classed('node', true) 
 		   .attr("r", 2)
 		   .style("visibility", "visible"); 

 	g.selectAll("path").style("visibility", "visible"); //to restore after search 
 	showAllPaths(); // to restore after voronoi 
 	removeZoneClasses(); 
} 

/*------------------------------------------------------
 * SETUP ROUTES
 *------------------------------------------------------*/
var routes = allRoutes.features, 
    path = d3.geo.path().projection(project), 
    svgContainer = d3.select(map.getPanes().overlayPane).append("g"),
    group = svgContainer.append("g").attr("class", "leaflet-zoom-hide"),
    bounds = d3.geo.bounds(allRoutes), 
    feature;

function project(point) {
	var latlng = new L.LatLng(point[1], point[0]); 
	var layerPoint = map.latLngToLayerPoint(latlng); 
	return [layerPoint.x, layerPoint.y]; 
}

/* show subset of allRoutes */
var partial_feature; 
function showPath(partial, color) {
	partial.forEach(function(part) {
		partial_feature = g.selectAll("path")
		 .filter(function(d) {
		 	return d.properties.id == part.properties.id; 
		 })
		 .attr("class", "path-shortest")
		 .attr("stroke", color)
		 .attr("visibility", "visible");
	})
	resetMap();
}

/* Show all paths */
function showAllPaths() {
	d3.json("data/all_routes_new.json", function(routes) {
		feature = g.selectAll("path")
		   .data(routes.features)
		   .enter()
		   .append("path")
		   .attr("class", "path-all");

	 	resetMap(); 
	 	map.on("viewreset", resetMap); 
	})  
}

function resetMap() {
		/* reposition paths*/
	    var bottomLeft = project(bounds[0]),
	    topRight = project(bounds[1]);
	 
	    svgContainer.attr("width", topRight[0] - bottomLeft[0])
	         .attr("height", bottomLeft[1] - topRight[1])
	         .style("margin-left", bottomLeft[0] + "px")
	         .style("margin-top", topRight[1] + "px");
	 
	    group.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

	    feature.attr("d", path);

	    /* reposition sites and labels*/
	    svgSites.attr("transform",
			function(d) {
				return "translate("+
				map.latLngToLayerPoint(d.LatLng).x +","+
				map.latLngToLayerPoint(d.LatLng).y +")";
		});

	    text.attr("transform",
			function(d) {
				return "translate("+
				map.latLngToLayerPoint(d.LatLng).x +","+
				map.latLngToLayerPoint(d.LatLng).y +")";
		});
	    /* reposition voronoi */ 
	    if (voronoi) {
			d3.select("body").selectAll("path").remove();
			drawVoronoiCells(map, mergedPoints);
		}

 	}



/* ----------------------------------------------------
 * PATH FROM A TO B 
 * Given a start and end node ID, shows path on map
 * ----------------------------------------------------*/

var routesByEID = {},
	routesByID = {}, 
    pathFromAToB,
    pathsToShow = new Array(), 
    shortestPath, 
    pathWithinADay,
    pathThroughCenters,
    pathSourceID; 
var howManyTrue = 0; 


var pathColors = {}; 
var pathTypes = d3.set(['Shortest', 'Within A Day']); // can add back 'Through Centers' eventually.. 
var pathInitialSelections = d3.set(['Shortest', 'Within A Day']);
pathColors['Shortest'] = '#451D5C'; 
pathColors['Within A Day'] = '#345C1D';
// pathTypes.forEach(function(t) {
// 	pathColors[t] = getRandomColor();
// })

selectionsUI('#path-options', pathInitialSelections, pathColors); 
selectionsUI('#itinerary-options', pathInitialSelections, pathColors); 

function selectionsUI(identifier, initialSelections, colors) {
	var space = d3.select(identifier).selectAll('input')
  			.data(pathTypes.values())
  			.enter().append("label");

	space.append("input")
	  .attr('type', 'checkbox')
	  .property('checked', function(d) {
	    return initialSelections === undefined || initialSelections.has(d)
	  })
	  .attr("value", function(d) { return d }); 

	space.append("span")
	  .attr('class', 'key')
	  .style('background-color', function(d) { return colors[d] });

	space.append("span")
	  .text(function(d) { return d })
	  .attr("class", "english"); 
}

function initializePathMap() {
	var path, 
	    pathMap = d3.map(); 
	// TODO: find way to put these into ONE object that I pull out of. 
	pathMap.set("Shortest", function(s, t) {
		return shortestPath(s, t, 's');  // s == shortest path 
	})	
	pathMap.set("Within A Day", function(s, t) {
		return shortestPath(s, t, 'd'); // d == within a day 
	})
	pathMap.set("Through Centers", function(s, t) {
		return shortestPath(s, t, 'c'); // c == through centers. 
	})
	return pathMap;
}

sortRoutesByEID();

function drawPathFromSourceToTarget(sid, tid, pathSelections, isItinerary) {
	var s, t, pathFunction, pathToShow, topoPath, meters = 0; 
	var pathMap = initializePathMap();

	s = graph.getNode(sid);
	t = graph.getNode(tid);

	// labels?! 
	var labels = d3.selectAll('text')
		.filter(function(d) { 
			return d.topURI == sid || d.topURI == tid; })
		.style("visibility", "visible");
	labels.moveToFront(); 

	d3.selectAll('circle.node').attr("z-index", -9999);
	pathSelections.forEach(function(select) {
		pathFunction = pathMap.get(select); 
		pathToShow = pathFunction(s, t); 
		topoPath = createTopoPath(pathToShow); 
		meters = lengthInMeters(topoPath);
		if(!isItinerary) {
			var distance = $j('<div />', {  
				class : 'english', // change to format on screen 
				html : " Distance Traveled on " + select + " Path: " + meters + 'm'
			}).appendTo("#distance");  
		}
		showPath(topoPath, pathColors[select]);
	})
	map.on("viewreset", resetMap);
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function sortRoutesByEID() {
	var r; 
	for (var i = 0; i < routes.length; i++) {
		r = routes[i].properties.eToponym;
		if (routesByEID[r] === undefined) {
			routesByEID[r] = new Array(); 
			routesByEID[r].push(routes[i]);
		} else {
			routesByEID[r].push(routes[i]);
		}
	}
}

function createTopoPath(partialPath) {
	// init
	var topoPath = new Array(); 
	var routeSections = new Array();

	var last = partialPath[partialPath.length - 1];

	//iterate over path. find the route in the geojson
	for (var i = 0; i < partialPath.length; i++) {
			routeSections = routesByEID[partialPath[i]];
			addRelevantRoutes(routeSections, topoPath, partialPath);
	}
	return topoPath; 
}

// filter for route sections that are only in our path. 
function addRelevantRoutes(routes, path, pathIDs) {
	if (routes) {
		routes.forEach(function(r) {
			if ((pathIDs.indexOf(r.properties.eToponym) >= 0 ) && 
		  		(pathIDs.indexOf(r.properties.sToponym) >= 0)) {
				path.push(r);
			}
		})
	}
}
function addRoutesToPath(routes, path) {
	if (routes) {
		for (var i = 0; i < routes.length; i++) {

			path.push(routes[i]);
		}
	}
}

function findPaths() {
	g.selectAll('circle.node').attr("r", "2"); 
	d3.selectAll('text').style('visibility', 'hidden');
	removeZoneClasses();
	var pathSelections = selectedTypes('path-options'); 
	var fromID = $j("#site-from-value").val();
	var toID = $j('#site-to-value').val();
	d3.selectAll('.path-shortest').attr("class", "path-all"); //change back to red 
	$j("#distance").empty(); 
	drawPathFromSourceToTarget(fromID, toID, pathSelections, false);
}

function lengthInMeters(path) {
	var m = 0;
	path.forEach(function(p) {
		m += p.properties.Meter; 
	})
	return m; 
}
/*--------------------------------------------------------
 * ITINERARY : 
 * given an array of places (topURIs), returns a complete
 * path to display. 
 * TODO: enlarge (or activate popup) for stopover between
 * sites in the itinerary 
 *-------------------------------------------------------*/
ItineraryUI(); 
var numFields; 
function createItinerary() {
	var stops = []; 
	var formAnswers = $j('#itinerary-select')[0]; 
	console.log(numFields);
	for (var i = 1; i <= numFields; i++) {
		var s = formAnswers[i]; 
		if (s != undefined) {
			console.log(s.options[s.selectedIndex].value);
			stops.push(s.options[s.selectedIndex].value); 
		}
	}
	console.log(stops);
    d3.selectAll('.path-shortest').attr("class", "path-all"); //change back to red 
    var selections = selectedTypes('itinerary-options');

	var places = replaceOceanWithPath(stops); 
	drawItinerary(places[0], selections);
	drawItinerary(places[1], selections);
}

function drawItinerary(places, pathSelections) {
	var s, t; 
	for (var i = 0; i < places.length - 1; i++) {
		s = places[i]; 
		t = places[i+1]; 
		drawPathFromSourceToTarget(s, t, pathSelections, true); 
	}
}

// to deal with crossing the ocean, 
function replaceOceanWithPath(places) {
	var split = places.indexOf(CROSS_OCEAN_URI); 
	var part1 = places; 
	var part2 = [];
	if (split >= 0) {
		part1 = places.slice(0, split); 
		part2 = places.slice(split + 1); //to get rid of URI 
	}
	return [part1, part2]; 
}
// for now, just removes the last element. 
function ItineraryUI() {
	var wrapper = $(".input_fields_wrap"); 
	var addFieldButton = $(".add_field_button"); 

	var fieldSet = d3.set(); 
	numFields = 1; 
	wrapItineraryField(wrapper, numFields, fieldSet);
	$(addFieldButton).click(function(e) {
		e.preventDefault();
		if (numFields < MAX_FIELDS) {
			numFields++; 
			wrapItineraryField(wrapper, numFields);
		}
	})

	$('#remove-last-field').click(function(e) {
		$j('.itinerary-dropdown').last().remove(); 
		numFields--;  
	})

}


function wrapItineraryField(wrapper, numFields) {

	$(wrapper).append('<div id=' + numFields + ' class="itinerary-dropdown"><select></div>'); //do i need an id? 
	createDropDown($j('.input_fields_wrap > div > select')); 
}

function createDropDown(element) {
	for (var i = 0; i < sitesWithRoutes.length; i++) {
		var option =  $j("<option>", { value: sitesWithRoutes[i].topURI, 
									  text: sitesWithRoutes[i].eiSearch});
		element.append(option.clone());
	} 
	// cross ocean 
	element.append(
		$j("<option>", {
			value: CROSS_OCEAN_URI,
			text: 'Travel via ocean or sea'
		}) 
	)
}

/*--------------------------------------------------------
 * NETWORK FLOODING
 *-------------------------------------------------------*/

networkUI();
function networkUI() {
	$j('#toggle-network').on("click", function() {
	 	if (networkFlooding) {
	 		$j('#network-flooding-select').hide();
	 		networkFlooding = false;
	 	} else {
	  		$j('#network-flooding-select').show();
	  		networkFlooding = true;
	 	} 
	 })

	$j('#network-hide').on("click", function() {
		console.log('clicked');
		$j('#network-flooding-select').hide();
	})

	var numMultipliers = 10; 
	for (var i = 1; i <= numMultipliers; i++) {
		var option = $j("<option>", { value: i, text: i}); 
		$j('#multiplier-select').append(option.clone());
	}
	$j('#multiplier-select').val(3);
}


function makeNetwork() {
	//clean up old floods 
	removeZoneClasses();
	g.selectAll("circle.node").attr("visibility", "visible");
	slideLeft('#path-form-left');  // get rid of pathfinding / itinerary 
	
	//get values from form 
	var sourceID = $j('#site-network-flooding-value').val();
	var multiplier = $j('#multiplier-select').val(); // get multiplier from from 
	if ($('#network-show-unreachable').is(':checked')) {
		g.selectAll("circle.node").classed('zone5-node', true).attr("r", 3); // make default unreachable
	} else {
		g.selectAll("circle.node").attr("visibility", "hidden"); // hide everything before we start flooding
	}

	// get info grom graph.js
	var s = graph.getNode(sourceID);
    var distances = shortestPath(s, s, 'n');
	var network = getNetwork(distances, multiplier);
	networkToFlood = network;
	flood(network, sourceID);
}


function flood(network, source) {
 // make default unreachable
	var sitesByZone = network.values(); 
	var siteClass, pathClass, zone; 
	//TODO: make this faster by doing a map over all circle.node just once. 
	for(var i = 0; i < sitesByZone.length; i++) { // don't need last zone, default unreachable
		zone = sitesByZone[i];
		siteClass = 'zone' + ( i+1) + '-node';
		zone.forEach(function(s) {
			g.selectAll("circle.node")
			   .filter(function(d) { return d.topURI == s})
			   .classed('zone5-node', false)
			   .classed(siteClass, true) 
			   .attr("r", 4)
			   .style("visibility", "visible");
		})
	}
	g.selectAll('circle.node').filter(function(d) {return d.topURI == source}).attr("r", 10);
	map.on("viewreset", resetMap);

}

function removeZoneClasses() {
	for (var i = 1; i < 6; i++) {
		g.selectAll("circle.node")
			.classed('zone' + i + '-node', false);
	}
}

/*--------------------------------------------------------
 * UTIL 
 * TODO make this modular! 
 *-------------------------------------------------------*/

function sortSitesByeiSearch() {
	var sitesToAdd = places.data; 
	var sortedSites = {};
	for (var i = 0; i < sitesToAdd.length; i++) {
		if (sortedSites[sitesToAdd[i].eiSearch] === undefined) {
			sortedSites[sitesToAdd[i].eiSearch] = sitesToAdd[i]; 
		}
	}
	return sortedSites; 
}

function sortSitesByTopURI() {
	var sitesToAdd = places.data; 
	var sortedSites = {}; 
	for (var i = 0; i < sitesToAdd.length; i++) {
		if (sortedSites[sitesToAdd[i].topURI] === undefined) {
			sortedSites[sitesToAdd[i].topURI] = sitesToAdd[i]; 
		}
	}
	return sortedSites; 
}

function sortRoutesByRouteID() {
	var r; 
	for (var i = 0; i < routes.length; i++) {
		r = routes[i].properties.id;
		if (routesByID[r] === undefined) {
			routesByID[r] = routes[i];
		}
	}
}

function sortSitesBySource() {
	var data = places.data; 
	var sortedSites = {}; 
	for (var i = 0; i < data.length; i++) {
		if (sortedSites[data[i].source] == undefined) {
			sortedSites[data[i].source] = new Array(); 
			sortedSites[data[i].source].push(data[i]);
		} else { 
			sortedSites[data[i].source].push(data[i]); 
		}
	}
	return sortedSites;
}

function sortSitesByTopType() {
	var data = places.data; 
	var sortedSites = {}; 
	for (var i = 0; i < data.length; i++) {
		if (sortedSites[data[i].topType] == undefined) {
			sortedSites[data[i].topType] = new Array(); 
			sortedSites[data[i].topType].push(data[i]);
		} else { 
			sortedSites[data[i].topType].push(data[i]); 
		}
	}
	return sortedSites;	
}

function removeSitesWithoutRoutes() {
	var currentRoute; 
	$j.each(allRoutes.features,function (id, route) {
		r = route.properties;
		if ((sitesByTopURI[r.eToponym]) && !(exists(sitesWithRoutes, r.eToponym))) {
			sitesWithRoutes.push(sitesByTopURI[r.eToponym]);
		} if ((sitesByTopURI[r.sToponym]) && !(exists(sitesWithRoutes, r.sToponym))) {
			sitesWithRoutes.push(sitesByTopURI[r.sToponym]); 
		} 
	})
	sitesWithRoutes = places.data; 
	sitesWithRoutes.sort( function(a, b) {
		var element1 = a.eiSearch.toLowerCase(); 
		var element2 = b.eiSearch.toLowerCase(); 
		if (element1 < element2) {
			return -1 
		} if (element1 > element2 ) {
			return 1 
		} 
		return 0; 
	})
}

function exists(array, el) {
	var elementsFound = array.filter(function(element, index, array) {
		return element.topURI == el; 
	})	
	return elementsFound.length > 0; 
}



/*-----------------------------------------------------
 * VORONOI 
 *----------------------------------------------------*/ 
/* from https://github.com/zetter/voronoi-maps 
 */

function restoreFromVoronoi() {
	$j("#options").hide();
	$j("#network-flooding-title").hide();
	$j("#network-flooding-select").hide();
	d3.select("body").selectAll(".point-cell").remove();
	g.selectAll("circle.node").style("fill", null).style("visibility", "hidden");
	slideRight('#path-form-right');
	voronoi = false;
}

$j('#toggle-voronoi').on("click", function() {
	if (voronoi) {
		restoreFromVoronoi();
		restoreDefaultMap();
	} else if (!voronoi) {
		$j("#options").show();
		d3.selectAll('text').style('visibility', 'hidden'); 
		slideLeft('#path-form-left'); 
		renderVoronoi();
		voronoi = true; 
	}
})

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var topTypeColors = {}; 
var sitesByTopType = sortSitesByTopType();
var topTypes = d3.set(Object.keys(sitesByTopType));
var voronoiInitialSelections = d3.set(['metropoles', 'capitals', 'villages']);

topTypes.forEach(function(t) {
	topTypeColors[t] = getRandomColor();
})

/* call selectionUI func here, then set d3.*/ 
labels = d3.select('#voronoi-select').selectAll('input')
  .data(topTypes.values())
  .enter().append("label");

labels.append("input")
  .attr('type', 'checkbox')
  .property('checked', function(d) {
    return voronoiInitialSelections === undefined || voronoiInitialSelections.has(d)
  })
  .attr("value", function(d) { return d })
  .on("change", renderVoronoi);

labels.append("span")
  .attr('class', 'key')
  .style('background-color', function(d) { return topTypeColors[d] });

labels.append("span")
  .text(function(d) { return d });


var selectedTypes = function(identifier) {
	return d3.selectAll('#' + identifier + ' input[type=checkbox]')[0].filter(function(elem) {
	  return elem.checked;
	}).map(function(elem) {
	  return elem.value;
	})
}

var mergedPoints; 
function renderVoronoi() {
	var selected = selectedTypes('voronoi-select'); 
	var pointsToDraw = new Array(); 
	mergedPoints = [];
	g.selectAll("circle.node").style("visibility", "hidden");
	selected.forEach(function(s) {
		g.selectAll("circle.node")
		 		   .filter(function(d) { return d.topType == s})
		 		   .style("fill", topTypeColors[s])
		 		   .attr("r", 3)
		 		   .style("visibility", "visible")
		pointsToDraw.push(sitesByTopType[s]);
	})

	mergedPoints = pointsToDraw.concat.apply(mergedPoints, pointsToDraw); //flatten array
	drawVoronoiCells(map, mergedPoints);
}

 

/*-----------------------------------------------------
 * UI  
 *----------------------------------------------------*/ 

/* Create select (dropdown) for pathfinding */

var sitesOnly = new Array();
sitesWithRoutes.forEach(function(s) {
	sitesOnly.push({value: s.topURI, label: s.eiSearch}); 
})

// cross ocean
sitesOnly.push({value : CROSS_OCEAN_URI, label: "Cross Ocean or Sea"}); 
addAutocompleteToElement('#site-from', '#site-from-value');
addAutocompleteToElement('#site-to', '#site-to-value');
addAutocompleteToElement('#site-network-flooding', '#site-network-flooding-value');

function addAutocompleteToElement(identifier, hiddenField) {
	$j( identifier ).autocomplete({
		source: sitesOnly, 
		focus: function(event, ui) {
						// prevent autocomplete from updating the textbox
						event.preventDefault();
						// manually update the textbox
						$(this).val(ui.item.label);
					},
		select: function(event, ui) {
					// prevent autocomplete from updating the textbox
					event.preventDefault();
					// manually update the textbox and hidden field
					$(this).val(ui.item.label);
					$( hiddenField ).val(ui.item.value);
				}
	})
}

/* TABS 
 * TODO: this is ugly af. 
*/
$j("#pathfinding-title").on("click", function() {
	$j('#itinerary-content').hide();
	$j('#itinerary-title').removeClass("tab-selected"); 
	$j( this ).addClass("tab-selected"); 
	$j('#pathfinding-content').show();
})

$j("#itinerary-title").on("click", function() {
	$j("#pathfinding-title").removeClass("tab-selected"); 
	$j('#pathfinding-content').hide();
	$j( this ).addClass("tab-selected"); 
	$j('#itinerary-content').show(); 
})

/* SLIDE left and right */
$j('#path-form-left').on("click", function() {
	slideLeft(this); 
})

$j('#path-form-right').on("click", function() {
	slideRight(this);
})

function slideLeft(identifier) {
	$j('#site-form').hide('slide', {direction: 'left'}, 1000);
	$j( identifier ).hide();
	$j('#path-form-right').show();
}

function slideRight(identifier) {
	$j('#site-form').show('slide', {direction: 'left'}, 1000); 
	$j( identifier ).hide();
	$j('#path-form-left').show();
}

// top toolbar 
$j('#restore-default').on("click", function() {
	restoreFromVoronoi();
	g.selectAll("circle.node")
 		   .filter(function(d) { return isDefaultTopType(d)})
 		   .classed('node', true) 
 		   .attr("r", 2)
 		   .style("visibility", "visible"); 

 	d3.selectAll('path').classed('path-all', true);
 	removeZoneClasses(); 	
})


/*-----------------------------------------------------
 * POPUP / TOOLTIP 
 *----------------------------------------------------*/
function createPopup(place) {
	return('<center><span class="arabic">' + place.arTitle + 
	'</span><br><br><span class="english">' + place.translitTitle); 
} 

/*--------------------------------------------------------
 * SEARCH/FILTER 
 *-------------------------------------------------------*/

$j('#search input').on('keyup', (function (e) {
	if (e.which == 13) {
		g.selectAll("circle.node").style("visibility", "hidden");
		g.selectAll("path").style("visibility", "hidden");
		//changed places.data to sites
		var matchesIndex = filterPlaces( $j ( this ).val(), sites, ['translitTitle','UStranslitTitle','arTitle','topURI','topType']);
		for ( var i=0; i < matchesIndex.length; i++ ) {
			s_id = sites[matchesIndex[i]].topURI;
			g.selectAll("circle.node")
			 		   .filter(function(d) { return d.topURI === s_id})
			 		   .classed('node', true) 
			 		   .attr("r", 4)
			 		   .style("visibility", "visible")
		}
	}
	if ( $j (this).val() == "") {
		restoreDefaultMap(); 
		g.selectAll("path").style("visibility", "visible");
	}
  })
);


function filterPlaces( _needle, _obj, _keys ) {
	var matches = [];
	var needle = _needle.toUpperCase();
	for ( var i=0, ii=_obj.length; i<ii; i++ ) {
		for ( var j=0, jj=_keys.length; j<jj; j++ ) {
			var stack = _obj[i][_keys[j]].toUpperCase();
			if ( stack.indexOf( needle ) != -1 ) {
				matches.push( i );
			}
		}
	}
	return matches;
}









