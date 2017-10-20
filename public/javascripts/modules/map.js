import axios from 'axios'

const mapOptions = {
  center: { lat: 44.7866, lng: 20.4489 },
  zoom: 13
};

function loadPlaces(map, lat = 44.7866, lng = 20.4489){
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then(res => {
    const places = res.data;
    if(!places.length){
      alert('No places found!');
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();

    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      const position = { lat: placeLat, lng: placeLng};
      bounds.extend(position);
      const marker = new google.maps.Marker({ map, position });
      marker.place = place;
      return marker;
    });


    markers.forEach(marker => marker.addListener('click', function(){
      const title = $('.place__info--title');
      const description = $('.place__info--description');
      const location = $('.place__info--location');
      const image = $('.place__info--image');
      const placeholder = $('.placeholder__text');
      if(location.text() == ''){
        location.after('<hr>');
      }

      if(this.place.description.length > 400){
        this.place.description = this.place.description.slice(0, 400) + '...'
      }


      placeholder.css('display', 'none');
      title.text(this.place.name);
      title.attr('href', `/store/${this.place.slug}`);
      location.text(this.place.location.address);
      description.text(this.place.description);
      image.attr('src', `/uploads/${this.place.photo || 'store.png'}`);
      image.css('display', 'block');

      const html = `<p class="map__place__title">${this.place.name}</p>`;
      infoWindow.setContent(html);
      infoWindow.open(map, this);
    }));


    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);

  });
}

function makeMap(mapDiv){
  if(!mapDiv) return;
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = document.querySelector('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng() )
  })
}

export default makeMap