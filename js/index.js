var map; 
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {center: {lat: 12.971598, lng: 77.594905}, zoom: 14, disableDefaultUI: true });
	 locMod.google(!!window.google);
}
var settings = {"async": false, "crossDomain": true,
 "url": "https://developers.zomato.com/api/v2.1/search?entity_type=city&count=5&lat=12.9648003&lon=77.5389259&sort=cost&order=desc",
  "method": "GET", "headers": {"user-key": "e64f3ce5bc66697bf5a46b14d7d00774"
} 
};
var res = ''; 

$.ajax(settings).done(function (response) {
	res = response; 
}); 
var locMod = {}; 
var locMod = {}; 
locMod.google = ko.observable(!!window.google); 
locMod.location = ko.observableArray([
	new Loc(res.restaurants[0].restaurant.name,res.restaurants[0].restaurant.location.latitude,res.restaurants[0].restaurant.location.longitude,res.restaurants[0].restaurant.user_rating.aggregate_rating), 
	new Loc(res.restaurants[1].restaurant.name,res.restaurants[1].restaurant.location.latitude,res.restaurants[1].restaurant.location.longitude,res.restaurants[1].restaurant.user_rating.aggregate_rating), 
	new Loc(res.restaurants[2].restaurant.name,res.restaurants[2].restaurant.location.latitude,res.restaurants[2].restaurant.location.longitude,res.restaurants[2].restaurant.user_rating.aggregate_rating), 
	new Loc(res.restaurants[3].restaurant.name,res.restaurants[3].restaurant.location.latitude,res.restaurants[3].restaurant.location.longitude,res.restaurants[3].restaurant.user_rating.aggregate_rating), 
	new Loc(res.restaurants[4].restaurant.name,res.restaurants[4].restaurant.location.latitude,res.restaurants[4].restaurant.location.longitude,res.restaurants[4].restaurant.user_rating.aggregate_rating) ]);
	locMod.query = ko.observable(''); 
	locMod.search_res = ko.computed(function(){
		var self = this;
		var query = this.query().toLowerCase(); 
		return ko.utils.arrayFilter(self.location(),function(locat){
			var matches = locat.title.toLowerCase().indexOf(query) != -1; 
			if(locat.marker) {
				locat.marker.setVisible(matches); 
			} return matches; 
		}); 
	}, locMod); 
	locMod.openInfowindow = function(locat) {
		google.maps.event.trigger(locat.marker,"click");
	};
	function googleError() {
		alert("Error Fetching Data"); 
	} 
	function Loc(title,lat, long,disp){
		var self  =this; 
		this.title = title;
		this.lng = long; 
		this.lat = lat; 
		this.desc = 'Rating by Users - '+disp; 
		this.addMapFunctionality = ko.computed(function(){
			if(locMod.google()){
				self.infowindow = new google.maps.InfoWindow();
				 self.icon = 'http://www.googlemapsmarkers.com/v1/990000/'; 
				 self.marker = new google.maps.Marker({position: new google.maps.LatLng(self.lat, self.lng), 
				 	animation: google.maps.Animation.DROP, map: map, title: self.title, icon: self.icon 
				 });
				  self.addListener = google.maps.event.addListener(self.marker, 'click', function() {
				  	for (var i = 0; i < locMod.location.length; i++) {
				  		locMod.location[i].infowindow.close(); 
				  	} 
				  	toggleBounce(self.marker); 
				  	map.panTo(self.marker.getPosition());
				  	self.infowindow.setContent(self.desc); 
				  	self.infowindow.open(map, self.marker);
				  	 }); 
				} 
			}); 
	}
	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
			 } else {
			 	marker.setAnimation(google.maps.Animation.BOUNCE); 
			 	setTimeout(function() {
			 		marker.setAnimation(null); 
			 	}, 1000); 
			 } 
			} 
ko.applyBindings(locMod);