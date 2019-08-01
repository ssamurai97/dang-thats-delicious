import axios from 'axios';

import { $ } from './bling';

const mapOptions = {
    center: {lat: 43.2, lng: -79.8 },
    zoom: 8
};
//-------------------------------------------------------------------
function loadPlaces(map, lat = 43.2, lng =  -79.8) {
    axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
        const places = res.data;
        if(!places.length){
            alert('no places found!');
            return;
        }
        // create a bounds
        const bounds = new google.maps.LatLngBounds();

        const infoWindow = new google.maps.InfoWindow();
        //-----------------------------------------------------------
        const markers = places.map(place => {
            const [placeLng, placeLat] = place.location.coordinates;
            const postion = { lat: placeLat, lng: placeLng };
            bounds.extend(postion);
            const marker = new google.maps.Marker({ map, postion });
            marker.place = place;
            return marker;
        });
        //when someone clicks on  a marker, show the details of the place
        markers.forEach(marker => marker.addListener('click', function(){
					console.log(this.place);
					const html = `
            <div class="pop">
							<a href="/store/${this.place.slug}">
								<img src="/uploads/${this.place.photo || 'store.pug'}" 
								atl="${this.place.name}" />
								<p>${this.place.name} - ${this.place.location.address}</p>
								</a>
								</div>
								`;
            infoWindow.setContent(this.html);
            infoWindow.open(map, this);
            
        }));
        // the zoom the mao to fit al the markers perfectly
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    });
}
//---------------------------------------------------------------------
function makeMap(mapDiv){

    if(!mapDiv) return;
    //make our map
    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map)
    const input = $('[name="geolocate"]');
		const autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
			
		});
}

export default makeMap;