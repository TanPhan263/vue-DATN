
<template>
  <div>
    <br>
    <GmapMap
      :center="center"
      :zoom="18"
      style="width:100%; height: 400px;"
    >
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
    };
  },
  created(){
    
  },
  mounted() {
    this.center={ lat:parseFloat(this.lat) , lng:parseFloat(this.lng)}
    console.log(this.center);
  },

  methods: {
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>