
<template>
  <div>
    <!-- <div>
      <h2>Chọn địa điểm của bạn</h2>
      <label>
        <GmapAutocomplete
          @place_changed="setPlace">
        </GmapAutocomplete>
        <button @click="addMarker">Add</button>
      </label>
      <br/>

    </div> -->
    <br>
    <GmapMap
      :center="center"
      :zoom="18"
      style="width:100%; height: 400px;"
    >
      <!-- <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
      ></GmapMarker> -->
      <GmapMarker
        :position="center"
      ></GmapMarker>
    </GmapMap>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gmap-vue@1.2.2/dist/gmap-vue.min.js"></script>
<script>
export default {
  name: "GoogleMap",
  props:{
    lat: String,
    lng: String
  },
  data() {
    return {
        //mặc định là Montreal
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
    };
  },
  created(){
    
  },
  mounted() {
    // this.geolocate();
    this.center={ lat:parseFloat(this.lat) , lng:parseFloat(this.lng)}
    console.log(this.center);
  },

  methods: {
    // nhận địa điểm thông qua autocomplete component
    // setPlace(place) {
    //   this.currentPlace = place;
    // },
    // addMarker() {
    //   if (this.lat && this.lng) {
    //     console.log(this.lat,this.lng)
    //     const marker = {
    //       // lat: this.currentPlace.geometry.location.lat(),
    //       // lng: this.currentPlace.geometry.location.lng()
    //       lat:parseFloat(this.lat),
    //       lng:parseFloat(this.lng)
    //     };
    //     this.markers.push({ position: marker });
    //     this.places.push(this.currentPlace);
    //     this.center = marker;
    //     this.currentPlace = null;
    //   }
    // },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
      //this.addMarker();
    }
  }
};
</script>