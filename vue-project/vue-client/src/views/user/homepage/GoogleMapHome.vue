
<template>
  <div>
    <div style="padding: 0px 0px 0 10px;" >
      <h3>Chọn địa điểm của bạn</h3>
      <label style="z-index:9999">
        <GmapAutocomplete style="width: 98%;"
          class="form-control"
          @place_changed="setPlace"
        :options="{fields: ['geometry', 'formatted_address', 'address_components']}">
          >
        </GmapAutocomplete>
      </label>
      <p >
        <i class="fa fa-map-marker" style="color: red; font-size: 20px;text-shadow: 2px 2px 3px #585858;"></i>
        {{places}}</p>
       <button  class="btn_change"  @click="changeMarker">Thay đổi</button>
      <br/>
    </div>
    <br>
    <GmapMap v-if="center"
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
      //mặc định là UTE
      center: { lat: 10.851170, lng: 106.755493 },
      places: '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam',
      currentPlace: null
    };
  },
// props:{
//     place:String,
//     lat: Number,
//     lng: Number
// },
  created() {
   this.$root.$refs.GoogleMapHome = this; 
   this.onInit();
  },
  methods: {
    onInit(){
      try{
        if(sessionStorage.getItem('place')){
        let tempplace = JSON.parse(sessionStorage.getItem('place'));
        console.log(tempplace)
        this.places = tempplace.formatted_address;
        console.log(this.places)
        const marker = {
          lat: tempplace.geometry.location.lat,
          lng: tempplace.geometry.location.lng
        };
        console.log(marker)
        this.center = marker;
        this.reserveGeocode();
        }
      }
      catch{

      }
    },
    // nhận địa điểm thông qua autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    sendPlace(place) {
      this.$emit('send-place',place,this.center.lat,this.center.lng);
      this.$root.$refs.Homebody.changePlace(this.center.lat,this.center.lng);
    },
    changeMarker() {
        if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.center = marker;
        // sessionStorage.setItem('place',JSON.stringify(this.currentPlace));
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
      try{
        // if(this.lat != '' && this.lng != '') this.center = {lat:parseFloat(this.lat) , lng:parseFloat(this.lng)}
        this.$gmapApiPromiseLazy().then(() => {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: this.center }, (results, status) => {
              if (status === "OK") {
                if (results[0]) {
                  sessionStorage.setItem('place',JSON.stringify(results[0]));
                  let place=results[0].formatted_address;
                  this.places = place;
                  this.sendPlace(this.places);
                } else {
                  window.alert("No results found");
                }
              } else {
                window.alert("Geocoder failed due to: " + status);
              }
            });
        });
      }
      catch(err){console.log(err)}
    }
  }
};
</script>
<style>
.btn_change{
  background: red;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 5px;
  font-weight: 700;
  border: 1px solid red;
}
.btn_change:hover{
  background:white;
  color: red;
}
</style>