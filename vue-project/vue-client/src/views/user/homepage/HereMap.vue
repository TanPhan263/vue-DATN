<template>
  <div id="map">
      <div style="padding: 10px">
       <input type="text" v-model="location" v-on:keyup.enter="addMarker" style="height: 50px;border:none;font-size: 17px">
         <button class="btn_change"  @click="addMarker" >Thay đổi</button>
            <button v-if="show" @click="getNearByStore" class="btn_nearby">Xem quán gần bạn</button>
             <button v-if="!show" @click="removeNearByStore" class="btn_nearby">Ẩn tất cả quán</button>
            </div>
  <!--In the following div the HERE Map will render-->
    <div id="mapContainer" style="height:400px;width:100%" ref="hereMap"></div>
  </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import StoreService from '@/services/StoreService.js';
export default {
  name: "HereMap",
  props:{
    lat: String,
    lng: String,
    storeName: String
  },
  data() {
    return {
      stores:[],
      show: true,
      platform: null,
      apikey: 'yS3OXwUUCPu4saZkhFUozPLGpnkLfaGcKSTNpJKJjec',//yS3OXwUUCPu4saZkhFUozPLGpnkLfaGcKSTNpJKJjec
      center: { lat: 10.851170, lng: 106.755493 },
      finish:{},
      location:'1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh',
      map:{},
      geocodingService:{},
      routingService:{},
      ui:{},
      iconStart:{},
      iconFinish:{},
    };
  },
  watch:{
    apikey(){
    }
  },
  async mounted() {
    this.onInit();
    this.getKeys();
    //Initialize the platform object:
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    });
    this.platform = platform;
    this.geocodingService = this.platform.getGeocodingService();
    this.routingService = this.platform.getRoutingService();
    this.initializeHereMap();
  },
  methods: {
    reset(){
      this.platform =  null;
      this.map ={};
      this.geocodingService ={};
      this.routingService = {};
      this.ui ={};
      this.stores =[];
      this.show= true;
    },
    getKeys(){
      const apiRef = firebase.database().ref("HereMap/ListApi/");
      apiRef.on("value", snapshot => {
        let data = snapshot.val();
        if(data){
        Object.keys(data).forEach(key => {
            if(data[key].status == 1) 
            {
              this.apikey = data[key].apikey;
            }
        });
        }
      });
    },
    onInit(){
        if(sessionStorage.getItem('place')){
          let tempplace = JSON.parse(sessionStorage.getItem('place'));
          this.location = tempplace.formatted_address;
          const marker = {
            lat: tempplace.lat,
            lng: tempplace.lng
          };
          this.center = marker;
        }
      },
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
      this.ui = H.ui.UI.createDefault(this.map, maptypes);
      this.iconStart = new H.map.Icon('https://image.flaticon.com/icons/png/32/1673/1673221.png');
      this.iconFinish = new H.map.Icon('https://image.flaticon.com/icons/png/32/1673/1673188.png');
      // End rendering the initial map

      let markerStart = new H.map.Marker(this.center,{icon: this.iconStart});
      markerStart.setData('<p>Vị trí của bạn</p>');
      markerStart.addEventListener('tap', event =>{
        const buble = new H.ui.InfoBubble(event.target.getGeometry(),
        {
            content: event.target.getData()
        });
        this.ui.addBubble(buble);
      });
      this.map.addObject(markerStart);
      if(this.lat && this.lng && this.storeName){
        this.finish = {lat: parseFloat(this.lat), lng:parseFloat(this.lng)};
        let markerFinish = new H.map.Marker(this.finish,{icon: this.iconFinish});
        markerFinish.setData('<p>'+ this.storeName +'</p>');
        markerFinish.addEventListener('tap', event =>{
          const buble = new H.ui.InfoBubble(event.target.getGeometry(),
          {
              content: event.target.getData()
          });
          this.ui.addBubble(buble);
        });
        this.map.addObject(markerFinish);
        this.drawRoute(this.center,this.finish);
      }
    },
    addMarker(){
      this.geocodingService.geocode({searchText: this.location}, data =>{
        if(data.Response.View.length > 0){
          var place = data.Response.View[0].Result[0].Location.Address.HouseNumber +', ' +
            data.Response.View[0].Result[0].Location.Address.Street +', '
          + data.Response.View[0].Result[0].Location.Address.Subdistrict +', '
          + data.Response.View[0].Result[0].Location.Address.District + ','
          + data.Response.View[0].Result[0].Location.Address.City;
          this.location= place;
          if(data.Response.View[0].Result.length >0){
              let position = data.Response.View[0].Result[0].Location.DisplayPosition;
              sessionStorage.setItem('place',JSON.stringify({formatted_address: place,lat: position.Latitude, lng: position.Longitude}));
              this.map.removeObjects(this.map.getObjects ())
              this.center = {lat: position.Latitude, lng: position.Longitude};
              let markerStart = new H.map.Marker({lat: position.Latitude, lng: position.Longitude},{icon: this.iconStart});
              this.map.addObject(markerStart);
              if(this.lat && this.lng && this.storeName){
                  let markerFinish = new H.map.Marker(this.finish,{icon: this.iconFinish});
                  this.map.addObject(markerFinish);
                  this.drawRoute(this.center, this.finish);
              }else{
                  this.map.setCenter(this.center);
                  this.sendPlace(place,position.Latitude,position.Longitude);
              }
          }
        }
      }, error =>{
          alert('Không tìm thấy địa điểm này');
          console.log(error)
      })
    },
    sendPlace(place,lat,lng) {
      this.$emit('send-place',place,lat,lng);
      this.$root.$refs.Homebody.changePlace(lat,lng);
      this.$root.$refs.Area.changePlace(lat,lng);
      this.$root.$refs.SearchPage.onInit();
    },
    drawRoute(start, finish){
        this.routingService.calculateRoute(
            {
            "mode":"fastest;car;traffic:enabled",
            "waypoint0": `${start.lat},${start.lng}`,
            "waypoint1":`${finish.lat},${finish.lng}`,
            "representation": "display"
            },
            data =>{
                console.log(data);
                if(data.response.route.length > 0)
                {
                    let lineString = new window.H.geo.LineString();
                    data.response.route[0].shape.forEach(point =>{
                        let [lat,lng] = point.split(",");
                        lineString.pushPoint({
                            lat: lat, lng:lng
                        });
                    })
                    var poylineOutline = new window.H.map.Polyline(lineString, {
                        style: {
                          lineWidth: 7,
                          strokeColor: 'rgba(0, 128, 255, 0.7)',
                          lineTailCap: 'arrow-tail',
                          lineHeadCap: 'arrow-head'
                        }
                      });
                    let polylineArrow = new window.H.map.Polyline(lineString,
                    {
                        style:{
                            lineWidth: 7,
                            fillColor: 'white',
                            strokeColor: 'rgba(255, 255, 255, 1)',
                            lineDash: [0, 2],
                            lineTailCap: 'arrow-tail',
                            lineHeadCap: 'arrow-head'
                        }
                    });
                    var routeLine = new window.H.map.Group();
                    routeLine.addObjects([poylineOutline,polylineArrow]);
                    this.map.addObject(routeLine)
                    this.map.getViewModel().setLookAtData({bounds: poylineOutline.getBoundingBox()});
                }
            },
            err =>{
                console.log(err);
            }
        );
    },
    async getNearByStore(){
      var id= localStorage.getItem('provinceId');
      if(sessionStorage.getItem('place')){
        let tempplace = JSON.parse(sessionStorage.getItem('place'));
        this.stores = await StoreService.getByProvince_distance(id,tempplace.lat,tempplace.lng);
      }
      else this.stores = await StoreService.getByProvince(id);
      this.stores = this.stores.filter(function(store){
          return parseFloat(store.khoangcach) < 2;
      })
      this.stores.forEach(element => {
          this.nearByMarker(element.lat,element.long,element.storeName,element.storeID);
      })
      this.map.setCenter(this.center);
      alert('Hoàn tất, mời bạn di chuyển map để xem các quán');
      this.show= false;
    },
    nearByMarker(lat,lng,name,id){
        if(lat && lng){
        let marker = new H.map.Marker({lat:lat, lng: lng},{icon: this.iconFinish});
        marker.setData('<a href="/'+ id+ '">'+ name +'</a>');
        marker.addEventListener('tap', event =>{
        const buble = new H.ui.InfoBubble(event.target.getGeometry(),
        {
            content: event.target.getData()
        });
        this.ui.addBubble(buble);
        });
        this.map.addObject(marker);
        }
    },
    removeNearByStore(){
        this.map.removeObjects(this.map.getObjects ());
        let markerStart = new H.map.Marker(this.center,{icon: this.iconStart});
        markerStart.setData('<p>Vị trí của bạn</p>');
        markerStart.addEventListener('tap', event =>{
        const buble = new H.ui.InfoBubble(event.target.getGeometry(),
        {
            content: event.target.getData()
        });
        this.ui.addBubble(buble);
        });
        this.map.addObject(markerStart);
        this.map.setCenter(this.center);
        this.show = true;
    }
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
.btn_nearby{
  float: right;
  background: skyblue;
  color: white;
  background: #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  color: #666;
  padding: 5px;
  font-weight: 700;
  border: none
}
.btn_nearby:hover{
  border: 1px solid  #666;
}
</style>