
<template>
  <div>
    <div>
      <h3>Chọn địa điểm của bạn</h3>
      <label style="padding: 0px 0px 0 10px;z-index:9999">
        <GmapAutocomplete style="width: 70%;"
          @place_changed="setPlace"
        :options="{fields: ['geometry', 'formatted_address', 'address_components']}">
          >
        </GmapAutocomplete>
        <button  @click="changeMarker">Thay đổi</button>
      </label>
      <br/>

    </div>
    <br>
    <GmapMap
      :center="center"
      :zoom="18"
      style="width:100%;  height: 400px;"
    >
      <GmapMarker
        :position="center"
      ></GmapMarker>
    </GmapMap>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
        //mặc định là Montreal
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: '',
      currentPlace: null
    };
  },
props:{
    place:String
},
  mounted() {
    this.geolocate();
  },
  methods: {
    // nhận địa điểm thông qua autocomplete component
    setPlace(place) {
      this.currentPlace = place;
      console.log(this.currentPlace.formatted_address);
    },
    sendPlace(place) {
        this.$emit('send-place',place)
        },
    changeMarker() {
        if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.center = marker;
        this.reserveGeocode();
        this.currentPlace = null;
      }
    },
    geolocate: function() {
    
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    reserveGeocode(){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: this.center }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
            this.places=results[0].formatted_address;
            this.sendPlace(this.places);
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        });
    }
  }
};
</script>