<template>
  <div id="map">
    <h3>Chọn địa điểm của bạn</h3>
    <div style="padding: 5px">
       <input type="text" v-model="location" style="height: 50px;border:none;font-size: 17px">
         <button class="btn_change"  @click="addMarker">Thay đổi</button>
        </div>
  <!--In the following div the HERE Map will render-->
    <div id="mapContainer" style="height:400px;width:100%" ref="hereMap"></div>
  </div>
</template>

<script>
export default {
  name: "HereMap",
  props: {
  },
  data() {
    return {
      platform: null,
      apikey: "",//yS3OXwUUCPu4saZkhFUozPLGpnkLfaGcKSTNpJKJjec
      center: { lat: 10.851170, lng: 106.755493 },
      location:'1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh',
      map:{},
      geocodingService:{}
      // You can get the API KEY from developer.here.com
    };
  },
  async mounted() {
    // Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    });
    this.platform = platform;
    this.geocodingService = this.platform.getGeocodingService();
    this.initializeHereMap();
  },
  methods: {
    initializeHereMap() { // rendering map
      const mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      var maptypes = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      this.map = new H.Map(mapContainer, maptypes.vector.normal.map, {
        zoom: 17,
        center: this.center
      });
      addEventListener("resize", () => this.map.getViewPort().resize());

      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

      // add UI
      H.ui.UI.createDefault(this.map, maptypes);
      // End rendering the initial map
      let marker = new H.map.Marker(this.center);
      this.map.addObject(marker);
    },
    addMarker(){
        this.geocodingService.geocode({searchText: this.location}, data =>{
            console.log(data)
            if(data.Response.View.length > 0){
                var place = data.Response.View[0].Result[0].Location.Address.Street +', '
                + data.Response.View[0].Result[0].Location.Address.Subdistrict +', '
                + data.Response.View[0].Result[0].Location.Address.District + ','
                + data.Response.View[0].Result[0].Location.Address.City;
                if(data.Response.View[0].Result.length >0){
                    let position = data.Response.View[0].Result[0].Location.DisplayPosition;
                    this.center = {lat: position.Latitude, lng: position.Longitude};
                    sessionStorage.setItem('place',JSON.stringify({formatted_address: place,lat: position.Latitude, lng: position.Longitude}));
                    let marker = new H.map.Marker({lat: position.Latitude, lng: position.Longitude});
                    this.map.removeObjects(this.map.getObjects ())
                    this.map.addObject(marker);
                    this.map.setCenter(this.center);
                    this.sendPlace(place,position.Latitude,position.Longitude);
                }
            }
        }, error =>{
           alert('Địa điểm không phù hợp');
           console.log(error)
        })
        
    },
    sendPlace(place,lat,lng) {
      this.$emit('send-place',place,lat,lng);
      this.$root.$refs.Homebody.changePlace(lat,lng);
      this.$root.$refs.Area.changePlace(lat,lng);
    },
  }
};
</script>

<style scoped>
#map {
  min-width: 360px;
}
.btn_change{
  background: red;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 5px;
  font-weight: 700;
  border: 1px solid red;
  margin-bottom: 10px;
}
.btn_change:hover{
  background:white;
  color: red;
}
input {
  width: 100% ;
  height: 50px;
  background: 
      linear-gradient(#000, #000) center bottom 5px /calc(100% - 10px) 2px no-repeat;
  background-color: #fff;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 17px;
  font-family: 'Dosis', sans-serif !important;
}
</style>