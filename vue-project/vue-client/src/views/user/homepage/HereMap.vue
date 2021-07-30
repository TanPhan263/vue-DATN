<template>
  <div id="map">
    <div v-if="lat && lng && storeName">
      <p v-if="travelTime<=15" class="timeTravel"> <img src="../../../assets/imgs/smiling.png" height="32" width="32" alt="">  Chỉ mất khoảng {{ travelTime }} phút di chuyển bằng Ôtô để đi từ vị trí của bạn đến quán, Đi ngay thôi nào!!! </p>
      <p v-if="travelTime>15 && travelTime <= 30" class="timeTravelMedium"> <img src="../../../assets/imgs/happy.png" height="32" width="32" alt=""> Khoảng {{ travelTime }} phút di chuyển bằng Ôtô!!! Nhưng vẫn chưa quá xa đâu</p>
      <p v-if="travelTime>30" class="timeTravelFar"> <img src="../../../assets/imgs/sad.png" height="32" width="32" alt=""> Mất khoảng {{ travelTime }} phút di chuyển bằng Ôtô!!! Một chuyến đi dài...</p>
    </div>
    <div style="padding: 10px;">
      <input type="text" v-model="location" v-on:keyup.enter="addMarker" style="height: 50px;border:none;font-size: 17px">
      <button class="btn_change"  @click="addMarker" >Thay đổi</button>
      <select class="selectRange" name="selectRange" id="selectRange" v-model="rangeSelected">
        <option v-for="(range,index) in searchRange" v-bind:key="index" :value="range"> Phạm vi {{range}}km</option>
      </select>
      <button v-if="show" @click="getNearByStore" class="btn_nearby">Xem quán gần bạn</button> 
      <button v-if="!show" @click="removeNearByStore" class="btn_nearby">Ẩn tất cả quán</button>
    </div>
  <!--In the following div the HERE Map will render-->
    <div id="mapContainer" style="height:400px;width:100%;" ref="hereMap"></div>
  </div>
</template>

<script>
import StoreService from '@/services/StoreService.js';
export default {
  name: "HereMap",
  props:{
    apikey: String,
    lat: String,
    lng: String,
    storeName: String
  },
  computed:{
   travelTime(){
      return Math.ceil(this.timeTravel/60);
    }
  },
  data() {
    return {
      searchRange:[],     //danh sách các bán kính tìm kiếm
      rangeSelected:2,    //bán kính mặc định là 2
      platform: null,     //platform của here map
      //apikey: '',//yS3OXwUUCPu4saZkhFUozPLGpnkLfaGcKSTNpJKJjec
      map:{},             //đối tượng map
      mapContainer: {},   //đói tượng map container 
      maptypes:{},        //loại map
      geocodingService:{}, //geocode service của HereMap
      routingService:{},  //routing service của HereMap
      ui:{},              //ui của hereMap
      iconStart:{},        //icon dùng cho marker
      iconFinish:{},
      center: { lat: 10.84959, lng: 106.77194 },//điểm mặc định là HCMUTE
      finish:{},          //điểm đến (vị trí của quán)
      timeTravel: 0,      //thời gian di chuyển
      location:'1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam', //biến hiển thị formated address
      stores:[],          //danh sách các quán
      show: true,         //biến thay đổi button Xem quán gần bạn hoặc Ẩn tất cả quán
    };
  },
  watch:{
    apikey(){
      this.$forceUpdate();
    },
    rangeSelected(){ //hàm bắt sự kiện khi biến rangeSelected thay đổi
      if(!this.show){//nếu đang hiện vị trí các quán
        this.removeNearByStore();//xóa các vị trí hiện tại
        this.getNearByStore();//hiển thị vị trí các quán trong phạm vi được chọn lên bản đồ
      }
    }
  },
  async mounted() {
    this.onInit();
    //Khởi tạo platform với api key
    const platform = new window.H.service.Platform({
      apikey: this.apikey
    });
    this.platform = platform;
    this.geocodingService = this.platform.getGeocodingService();//khởi tạo geocode service
    this.routingService = this.platform.getRoutingService();    //khởi tạo routing service
    this.initializeHereMap();
  },
  methods: {
    onInit(){
        if(sessionStorage.getItem('place')){ //nếu có địa điểm trong sessionStorage thì sử dụng địa điểm này 
          let tempplace = JSON.parse(sessionStorage.getItem('place'));
          this.location = tempplace.formatted_address;
          const marker = {
            lat: tempplace.lat,
            lng: tempplace.lng
          };
          this.center = marker;
        }
        for(var i = 1;i <=50 ;i++) //tạo 
        {
          this.searchRange.push(i);
        }
    },
    initializeHereMap() { // rendering map
      this.mapContainer = this.$refs.hereMap;
      const H = window.H;
      // Obtain the default map types from the platform object
      this.maptypes = this.platform.createDefaultLayers();
      // Instantiate (and display) a map object:
      this.map = new H.Map(this.mapContainer, this.maptypes.vector.normal.map, {
        zoom: 17,
        center: this.center
      });
      addEventListener("resize", () => this.map.getViewPort().resize());
      // add behavior control
      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
      // add UI
      H.ui.UI.createDefault(this.map, this.maptypes);
      this.ui = H.ui.UI.createDefault(this.map, this.maptypes);
      this.iconStart = new H.map.Icon('https://image.flaticon.com/icons/png/32/1673/1673221.png');
      this.iconFinish = new H.map.Icon('https://image.flaticon.com/icons/png/32/1673/1673188.png');
      // End rendering the initial map
      //add marker
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
      //nếu đang trong trang chi tiết quán
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
    addMarker(){                                                                          //Thêm marker vào bản đồ 
      this.geocodingService.geocode({searchText: this.location}, data =>{
        if(data.Response.View.length > 0){
          var place = data.Response.View[0].Result[0].Location.Address.HouseNumber +', ' +  //lấy thông tin địa chỉ 
            data.Response.View[0].Result[0].Location.Address.Street +', '
          + data.Response.View[0].Result[0].Location.Address.Subdistrict +', '
          + data.Response.View[0].Result[0].Location.Address.District + ','
          + data.Response.View[0].Result[0].Location.Address.City;
          this.location= place;
          if(data.Response.View[0].Result.length >0){
              let position = data.Response.View[0].Result[0].Location.DisplayPosition;      //lấy lat lng
              sessionStorage.setItem('place',JSON.stringify({formatted_address: place,lat: position.Latitude, lng: position.Longitude}));
              this.map.removeObjects(this.map.getObjects())                                //remove các marker hiện tại   
              this.center = {lat: position.Latitude, lng: position.Longitude};              
              let markerStart = new H.map.Marker({lat: position.Latitude, lng: position.Longitude},{icon: this.iconStart}); //tạo marker mới 
              this.map.addObject(markerStart);                                               //thêm marker vàom map
              if(this.lat && this.lng && this.storeName){                                     //nếu đang ở trong trang chi tiết quán this.lat && this.lng && this.storeName sẽ có giá trị 
                  let markerFinish = new H.map.Marker(this.finish,{icon: this.iconFinish});   //tạo mới đối tượng marker với lat lng của quán
                  this.map.addObject(markerFinish);                                           //thêm vào map
                  this.drawRoute(this.center, this.finish);                                   //vẽ đường đi
              }else{
                  this.map.setCenter(this.center);                                             
                  this.sendPlace(place,position.Latitude,position.Longitude);                  //nếu ở ngoài trang chủ thì gọi hàm cập nhật khoảng cách các quán ở các component khác
              }
          }
        }
      }, error =>{
          alert('Không tìm thấy địa điểm này');
          console.log(error)
      })
    },
    sendPlace(place,lat,lng) {                      //gửi thay đổi đến các component khác
      this.$emit('send-place',place,lat,lng);
      this.$root.$refs.Homebody.changePlace(lat,lng);
      this.$root.$refs.Area.changePlace(lat,lng);
      this.$root.$refs.SearchPage.onInit();
    },
    drawRoute(start, finish){                         //vẽ đường đi
      this.routingService.calculateRoute(
        {
        "mode":"fastest;car;traffic:enabled",         //các chế độ khi vẽ
        "waypoint0": `${start.lat},${start.lng}`,     //điểm đầu
        "waypoint1":`${finish.lat},${finish.lng}`,     //điểm cuối 
        "representation": "display",                  
        "routeAttributes": "summary"                   
        },
        data =>{
            console.log(data);
            if(data.response.route.length > 0)
            {
                this.timeTravel = parseInt(data.response.route[0].summary.travelTime); //lấy thông tin thời gian di chuyển
                let lineString = new window.H.geo.LineString();                        //
                data.response.route[0].shape.forEach(point =>{                         //data.response.route[0].shape là một list các lat,lng
                    let [lat,lng] = point.split(",");                                    
                    lineString.pushPoint({                                             //thêm vào lineStrong để vẽ
                        lat: lat, lng:lng
                    });
                })
                var poylineOutline = new window.H.map.Polyline(lineString, {            //vẽ phần ouline của đường đi
                    style: {
                      lineWidth: 7,
                      strokeColor: 'rgba(0, 128, 255, 0.7)',
                      lineTailCap: 'arrow-tail',
                      lineHeadCap: 'arrow-head'
                    }
                  });
                let polylineArrow = new window.H.map.Polyline(lineString,               //vẽ mũi tên của đường đi
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
                routeLine.addObjects([poylineOutline,polylineArrow]);                  //tạo object chứa poylineOutline,polylineArrow           
                this.map.addObject(routeLine)                                           //thêm vào Map
                this.map.getViewModel().setLookAtData({bounds: poylineOutline.getBoundingBox()}); //hiển thị route ở trung tâm
            }
        },
        err =>{
            console.log(err);
        }
      );
    },
    async getNearByStore(){                                 //hiển thị vị trí các quán trong phạm vi được chọn lên bản đồ 
      var id= localStorage.getItem('provinceId');
      if(sessionStorage.getItem('place')){                  //lấy danh sách các quán theo vị trí hiện tại
        let tempplace = JSON.parse(sessionStorage.getItem('place'));
        this.stores = await StoreService.getByProvince_distance(id,tempplace.lat,tempplace.lng);
      }
      else this.stores = await StoreService.getByProvince(id);
      var vm = this;
      this.stores = this.stores.filter(function(store){    //lọc các quán theo bán kính rangeSelected mà người dùng chọn
          return parseFloat(store.khoangcach) <= parseInt(vm.rangeSelected);
      })
      this.stores.forEach(element => {
        this.nearByMarker(element.lat,element.long,element.storeName,element.storeID); //add vào map
      })
      this.map.setCenter(this.center);  
      //thông báo khi hoàn tất            
      this.$notify({
        title:'Tải quán thành công',
        text: 'Các quán trong phạm vi ' + vm.rangeSelected +'km tính từ vị trí của bạn<br>Di chuyển bản đồ để xem nhé!!!',
        duration: 4000,
         type: 'success',
      });
      setTimeout(e => {this.$notify({
        title:'Tips',
        text: 'Nhấn vào các marker để xem tên quán,<br> Nhấn vào tên quán để đi đến quán đó',
        duration: 6000,
      });}, 3000)
      this.show = false;
    },
    nearByMarker(lat,lng,name,id){
      if(lat && lng){
      let marker = new H.map.Marker({lat:lat, lng: lng},{icon: this.iconFinish}); //tạo mới một object matker
      marker.setData('<a href="/'+ id+ '">'+ name +'</a>');                         //set lable cho marker
      marker.addEventListener('tap', event =>{                                      //thêm event nhấn vào marker sẽ hiển thị popup tên quán
      const buble = new H.ui.InfoBubble(event.target.getGeometry(),
      {
          content: event.target.getData()
      });
      this.ui.addBubble(buble);
      });
      this.map.addObject(marker);
      }
    },
    removeNearByStore(){                                                      //remove tất cả marker của quán 
      this.map.removeObjects(this.map.getObjects ());                          //remove tất cả marker
      let markerStart = new H.map.Marker(this.center,{icon: this.iconStart});   //tạo mới marker là địa chỉ của người dùng hiện tại
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
      if(this.lat && this.lng && this.storeName){                                //nếu đang ở trong trang chi tiết quán this.lat && this.lng && this.storeName sẽ có giá trị 
        let markerFinish = new H.map.Marker(this.finish,{icon: this.iconFinish});//tạo marker của quán đang xem 
        this.map.addObject(markerFinish);                                         //thêm marker vao map
        this.drawRoute(this.center, this.finish);                                  //vẽ đường đi
      }
    }
  }
};
</script>

<style scoped>
#map {
  min-width: 360px;
}
.btn_change{
  font-family: 'Dosis', sans-serif !important;
  background: red;
  color: white;
  border-radius: 5px;
  border: none;
  padding: 5px;
  font-weight: 700;
  border: 1px solid red;
  margin-bottom: 10px;
  font-size: 16px;
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
  font-family: 'Dosis', sans-serif !important;
  float: right;
  color: white;
  background: #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  color: #666;
  padding: 5px;
  font-weight: 700;
  border: 1px solid #eee;
  font-size: 16px
}
.btn_nearby:hover{
  border: 1px solid  #666;
}
.timeTravel{
  font-size:17px;
  color: limegreen;
  font-weight: bold;
}
.timeTravelMedium{
  font-size:17px;
  color: 	#ffcc00;
  font-weight: bold;
}
.timeTravelFar{
  font-size:17px;
  color: 	#cc3300;
  font-weight: bold;
}
.selectRange{
  font-size: 15px;
  font-family: 'Dosis', sans-serif !important;
  width: 21%;
  margin-left: 5px;
  float: right;
  color: white;
  background: #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  color: #666;
  padding: 5px;
  font-weight: 700;
  border: 1px solid #eee;  
}

</style>