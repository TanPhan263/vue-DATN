<template>
  <div class="discover">
              <div class="section">
                  <ul> 
                     <li><h1 style="font-size:1.5em; text-align: center">Khu vực</h1></li>
                     <li  v-for="(district, index) in districts" v-bind:key="index"><a @click=" districtClicked(district.districtID)"> {{district.districtName}}</a></li>
                  </ul>
              </div>
              <div class="artical">
                  <div class="slider">
                    <ul v-if="!show">
                      <li v-for="(store, index ) in stores" v-bind:key="index"><a v-on:click="storeClicked(store.storeID)">
                          <img v-lazy="store.storePicture"  >
                          <div class="name-food">{{ subStringName(store.storeName)}}...</div>
                          <div class="address-store"><i class="fa fa-map-marker"  style="color: red"></i>  {{ subString(store.storeAddress) }}...
                          <div style="color: black; float:right;">{{store.khoangcach}} km</div></div>
                            <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                            <div style="color: black; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                            </div>
                      </a></li>
                    </ul>
                     <div v-show="show" style="margin: 0 auto; margin-top: 150px; margin-left: 340px" class="loader"></div>
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
        districts: [],
        stores:[],
        show: false
      }
    },
    props: {
        type: Array
    },
    mounted(){
      this.onInit();
    },
    methods:{
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
          this.districts = await ProvinceService.getAllDistrict();
          console.log(this.districts[0].districtID);
          this.stores = await StoreService.getByDistrict(this.districts[0].districtID)
          this.districts = this.districts.slice(0,19);
          this.stores = this.stores.slice(0,15);
        },
        async districtClicked(id){
          this.show= true;
            this.stores = await StoreService.getByDistrict(id);
            this.stores = this.stores.slice(0,15);
            this.show=false;
        },
        storeClicked(id)
        {
          this.$emit('storeClicked',id);
        }
    }
}
</script>

<style>
</style>