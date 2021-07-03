<template>
  <div class="discover">
    <div style="margin-left: 20px" class="section">
        <ul> 
            <li><h1 style="font-size:1.7em; text-align: center">Khu vực</h1></li>
            <li  v-for="(district, index) in districts" v-bind:key="index"><a @click=" districtClicked(district.districtID)" :class="[districtID === district.districtID? 'active':'']"> {{district.districtName}}</a></li>
        </ul>
    </div>
    <div class="artical">
        <div class="slider">
          <ul v-if="!show">
            <li v-for="(store, index ) in stores" v-bind:key="index">
              <div v-if="store.discount === true" class="top-left">
                  <div class="popup"  @click="openPopup('area'+ store.storeID,store.storeID)"
                  @mouseleave="closePopup('area'+ store.storeID)">
                      <span class="fa-stack fa-lg">
                          <i class="fa fa-certificate fa-stack-2x"></i>
                          <i class="fa fa-tag fa-stack-1x fa-inverse"></i>
                      </span>
                      <span class="popuptext" :id="'area'+ store.storeID">
                        <div v-show="loadingStoreDiscount" style="margin: 0 auto;" class="loader-small"></div>
                        <span v-show="!loadingStoreDiscount" v-if="discountList">
                          <span v-for="(dis,index) in discountList" v-bind:key="index"> <i class="fa fa-tag" style="font-size: 15px; color: red; padding: 2px;"/> {{getDiscountName(dis.idDiscountType)}} <br></span>
                        </span>
                      </span>
                  </div>
                </div>
               <a :href="'/'+store.storeID">
                <img v-lazy="store.storePicture"  >
                  <div class="middle">
                  <div class="text" style="background: #ff6666 ">Xem quán</div>
                  </div>
                <div class="name-food">{{ subStringName(store.storeName)}}...</div>
                <div class="address-store"><i class="fa fa-map-marker"  style="color: red"></i>  {{ subString(store.storeAddress) }}...
                <div style="color: black; float:right;">{{store.khoangcach}} km</div></div>
                  <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                   <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                  </div>
            </a></li>
          </ul>
            <div v-show="show" style="margin: 0 auto; margin-top: 150px; margin-left: 340px" class="loader"></div>
            <div v-if="!show">
                <div class="hero" style="width:100%; text-align:center; font-weight: bold;font-size: 16px;cursor:pointer;">
                <a style=" text-decoration:none; color: black" :href="'/district/'+ this.districtID">XEM THÊM <i class="fa fa-chevron-right"></i></a>
              </div>
          </div> 
        </div>
    </div>
   
</div> 
</template>

<script>
import ProvinceService from '@/services/ProvinceService.js';
import StoreService from '@/services/StoreService.js';
export default {
    data(){
      return{
        districtID: '-MZDgDz4jgm59Muy9bJ3',
        districts: [],
        stores:[],
        show: false
      }
    },
    props: {
        type: Array,
        discount: Array,
        discountList:Array,
        loadingStoreDiscount:Boolean,
    },
    mounted(){
      this.onInit();
    },
    methods:{
        openPopup(name,id){
          this.$root.$refs.Homebody.openPopup(name,id);
        },
        closePopup(name){
          this.$root.$refs.Homebody.closePopup(name);
        },
        getDiscountName(id){
        let temp = ''
        this.discount.forEach(element => {
          if(element.discountTypeID == id)
            temp = element.discountTypeName;
        });
        return temp;
        },
        subString(index){
          return index.toString().substring(0,13);
        },
        subStringName(index){
          return index.toString().substring(0,20);
        },
         getType(index){
          var temp='Unknown'
          this.type.forEach(element => {
              if(element.businessTypeID == index)
                temp = element.businessTypeName;
          });
          return temp;
        },
        async onInit(){
          try{
            var id = localStorage.getItem('provinceId');
            this.districts = await ProvinceService.getDistrictByID(id);
            this.stores = await StoreService.getByDistrict(this.districts[0].districtID)
            // this.districts = this.districts.slice(0,19);
            this.stores = this.stores.slice(0,15);
          }
          catch(err){console.log(err)}
        },
        async districtClicked(id){
          try{
          this.districtID = id;
          this.show= true;
          this.stores = await StoreService.getByDistrict(id);
          this.stores = this.stores.slice(0,15);
          this.show=false;
          }
          catch(err){console.log(err)}
        }
    }
}
</script>

<style>
@import url('../../../assets/css/style.css');
.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.text {
  background-color: #04AA6D;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}
</style>