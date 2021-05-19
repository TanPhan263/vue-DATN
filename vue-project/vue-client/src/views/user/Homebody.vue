<template>
<div class="main" :style="'margin-bottom:' + margin +'px;'">
   <vueper-slides 
      style="width: 85%;margin: 0 auto; margin-top:20px;background-color:#f6f6f6;"
      fixed-height="230px"
      class="no-shadow"
      :visible-slides="4"
      slide-multiple
      :gap="3"
      :bullets="false"
      :slide-ratio="1 / 4"
      :dragging-distance="200"
      :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
      <vueper-slide   @click.native="active=true" style="border-radius:10px;" v-for="(slide, i) in banner" :key="i" :image="slide.src" />
    </vueper-slides>
    <transition v-if="active">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">

				<div class="modal-header">
					<slot name="header">
					<h3>DANH SÁCH QUÁN</h3>
					</slot>
				</div>

				<div class="modal-body">
					<slot name="body">
					  Danh sách quán
					</slot>
				</div>

				<div class="modal-footer">
					<slot name="footer">
					<button class="btn btn-danger" @click="active=false">
						Close
					</button>
					</slot>
				</div>
				</div>
			</div>
			</div>
		</transition>
     <transition v-if="loading">
       	<div class="modal-mask">
          <div class="loading" >
            <span class="fas fa-circle-notch fa-spin"></span>
          </div>
         </div>
    </transition>

   <div class="ship" style="width:88%;">
	  <div  class="menu-ship">
        <div class="hero">
          <h4>MÓN NGON MỖI NGÀY</h4>
        </div>
    </div>
    <div class="sub-menu-ship">
        <ul>
          <li v-for="(dish, index) in dishes" v-bind:key="index" style="height:90px;width:100px;"  @click="dishClicked(dish.dishName)">
             <a>
              <img v-lazy="dish.dishPicture" style="border-radius:10px 10px 10px 10px; width:102px; height:90px;cursor: pointer;"/>
          </a>
          <div @click="dishClicked(dish.dishName)" style="margin: 0 auto;text-align:center; background-color:#f6f6f6; width: 80px; padding-bottom: 20px;"> 
                <p style="margin-top: 3px;font-family: Helvetica; font-size:14px; font-weight:bold; word-break:keep-all;">{{dish.dishName}}</p></div>
          </li>
        </ul>
    </div>
    <div>
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%">
                <p @click="dishViewMore" >XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
              </div>
            </div>
          </div>  
      </div>
  </div>
    <div class="ship" style="width:88%;">
      <div class="menu-ship">
        <div class="hero">
          <h4>ĐƯỢC ĐÁNH GIÁ CAO</h4>
        </div>
      </div>
      <div id="Giaotannoi" class="sub-menu-ship" >
        <ul>
          <li v-for="(store, index ) in rates" v-bind:key="index">
            <a v-on:click="storeClicked(store.storeID)">
              <img v-lazy="store.storePicture"/>
              <div class="name-food">{{ subStringName(store.storeName)}}...</div>
              <div class="address-store"><i class="fa fa-map-marker" style="color: red"></i>{{ subString(store.storeAddress) }}...
              <div style="color: black; float:right;">{{store.khoangcach}} km</div>
              </div>
                <div class="address-store"> <span class="fas fa-utensils"></span> {{ getType(store.businessTypeID) }}
                <div style="color: black; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                </div>
              <div class="intro"></div>
            </a>
          </li>
        </ul>
      </div>
      <div>
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%">
                <p @click="viewMore_Search('Đánh giá cao')">XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
              </div>
            </div>
          </div>  
      </div>
    </div>
     <div class="ship">
      <div class="menu-ship">
        <div class="hero">
          <h4>GẦN BẠN NHẤT</h4>
        </div>
      </div>
      <div id="Giaotannoi" class="sub-menu-ship" >
        <ul>
          <li v-for="(store, index) in nearest" v-bind:key="index">
            <a v-on:click="storeClicked(store.storeID)">
              <img v-if="store.storePicture" v-lazy="store.storePicture" />
              <div class="name-food"> {{ subStringName(store.storeName)}}...</div>
              <div class="address-store"><i class="fa fa-map-marker"  style="color: red"></i>  {{ subString(store.storeAddress) }}...
              <div style="color: black; float:right;">{{store.khoangcach}} km</div></div>
                <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                <div style="color: black; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                </div>
              <div class="intro"></div>
            </a>
          </li>
        </ul>
      </div>
      <div>
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%">
                <p  @click="viewMore_Search('Quán gần bạn')" >XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
              </div>
            </div>
          </div>  
      </div>
    </div>
     <Area @storeClicked="storeClicked" v-bind:type="type"/>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="disabled"  infinite-scroll-distance="100" style="margin-top: 20px;">
      <div v-for="(list, index) in loadMoreList" v-bind:key="index" class="ship">
        <div class="menu-ship">
          <div class="hero" style="width:30%">
            <h4 v-if="list && list.length > 0" style="text-align:left"> {{ getType(list[0].businessTypeID) }}</h4>
          </div>
        </div>
        <div v-if="list" class="sub-menu-ship">
          <ul>
            <li v-for="(store,index) in list" v-bind:key="index">
              <a v-on:click="storeClicked(store.storeID)">
                <img v-lazy="store.storePicture"/>
                <div class="name-food">{{ subStringName(store.storeName) }}...</div>
                <div class="address-store"> <i class="fa fa-map-marker"  style="color: red"></i> {{ subString(store.storeAddress) }}...
                  <div style="color: #585858; float:right;">{{store.khoangcach}} km</div>
                </div>
                  <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                  <div style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                  </div>
                <div class="intro"></div>
              </a>
            </li>
          </ul>
        </div>
        <div style="margin-top: 20px;">
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%">
                <p @click="viewMore(list[0].businessTypeID)">XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
              </div>
            </div>
          </div>  
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import StoreService from '@/services/StoreService.js';
import { loadOptions } from '@babel/core';
import Area from './containers/Area.vue';
const baseUrl='https://localhost:44398/api/'

export default {
    name: 'Homebody',
    components:{
        VueperSlides, VueperSlide,Area
    },
    data() {
        return {
          margin: 150,
          loading: false,
          index: 0,
          stores: [],
          //Search data
          nearest: [],
          rates: [],
          type: [],
          loadMoreList: [],
          dishes: [],
          banner:[
            {
              id:1,
              src: require('../../assets/imgs/banner1.jpg')
            },
            {
              id:2,
              src: require('../../assets/imgs/banner2.jpg')
            },
            {
              id:3,
              src: require('../../assets/imgs/banner3.jpg')
            },
            {
              id:4,
                src: require('../../assets/imgs/banner4.jpg')
            },
            {
              id:5,
              src: require('../../assets/imgs/banner1.jpg')
            },
            {
              id:6,
            src: require('../../assets/imgs/banner2.jpg')
            },
            {
              id:7,
              src: require('../../assets/imgs/banner3.jpg')
            },
            {
              id:8,
              src: require('../../assets/imgs/banner4.jpg')
            }
          ],
          active:false
        }
      },
      created(){
          this.$root.$refs.Homebody = this;
          this.onInit();
          this.$http.get(baseUrl + 'Dish/GetAll').then(response => {
                this.dishes = response.data;
                let x = Math.floor(Math.random()*(this.dishes.length-10))
                console.log(x);
                this.dishes = this.dishes.slice(119,129);
          })
      },
      mounted(){
          // this.scroll();
      },
      methods:{
        async onInit(){
          try{
            var id= localStorage.getItem('provinceId');
            this.stores = await StoreService.getByProvince(id)
            this.rates = await StoreService.getByProvince(id);
            this.rates.sort(function compare( a, b ) {
                return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
            });
            this.type = await StoreService.getAllBussinessType();
            console.log(this.type); 
            this.nearest = this.stores.slice(0,12);
            this.rates = this.rates.slice(0,12);
          }catch{}
        },
        storeClicked (item) {
          this.$router.push('/storeDetail/' + item)
        },
        dishClicked (item) {
          localStorage.setItem("keyword", item);
          console.log(localStorage.getItem("keyword"));
          this.$router.push('/search?key='+ item)
        },
        dishViewMore(){
           this.$router.push('/DishType')
        },
        viewMore_Search(index){
          this.$router.push('/search?key=' + index).catch(()=>{});
        },
        changeProvince(index){
          this.$http.get(baseUrl+ 'GetByIDProvince?id=' + index).then(response => {
            this.stores= response.data
          });
        },
        async changePlace(lat,long){
          console.log('ChangePlace')
           var id= localStorage.getItem('provinceId');
            this.stores = await StoreService.getByProvince_distance(id, lat,long)
            this.rates = await StoreService.getByProvince_distance(id,lat,long);
            this.rates.sort(function compare( a, b ) {
                return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
            });
            this.nearest = this.stores.slice(0,12);
            this.rates = this.rates.slice(0,12);
        },
        onChildClick(value){
          this.provinceID = value
        },
        getType(index){
          var temp='Unknown'
          this.type.forEach(element => {
              if(element.businessTypeID == index)
                temp = element.businessTypeName;
          });
          return temp;
        },
        subString(index){
          return index.toString().substring(0,13);
        },
        subStringName(index){
          return index.toString().substring(0,20);
        },
      //   scroll() {
      //   window.onscroll = () => {
      //     let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight > document.documentElement.offsetHeight - 200 ;
      //     if(bottomOfWindow) {
      //       this.loading = true;
      //       if(this.index < this.type.length){
      //         var temp = this.type[this.index];
      //         if(this.index < this.type.length){
      //           var store = this.stores.filter(function(store) {
      //                 return store.businessTypeID ==  temp.businessTypeID });}
      //         while(store.length==0){
      //             this.index = this.index + 1;
      //             if( this.index < this.type.length){
      //             temp = this.type[this.index].businessTypeID;
      //             store = this.stores.filter(function(store) {
      //                   return store.businessTypeID ==  temp });
      //             }
      //         }
      //         setTimeout(() =>{ 
      //           this.loadMoreList.push(store);
      //           this.index = this.index + 1;
      //           this.loading = false;
      //           this.margin = 150;
      //         }, 1500);
      //       }
      //       else{
      //         this.loading = false;
      //         return;
      //       } 
      //     }
      //   };
      // },
      loadMore(){
        this.loading = false;
        setTimeout(() =>{
          if(this.index < this.type.length){
              console.log(this.type[this.index]);
              let id = this.type[this.index].businessTypeID;
              var store = this.stores.filter(function(store) {
                  return store.businessTypeID === id });
              if(store.length > 5){
                if(store.length > 12)
                  store = store.slice(0,12);
                this.loadMoreList.push(store);}
              this.index = this.index + 1;
              this.loading = false;
              this.margin = 150;
            }
            else{
            this.loading = false;
            }
          }, 200);
      },
      viewMore(id){
        this.$router.push('/ViewMore?key=' + id).catch(()=>{});
      },
      districtClicked(){

      }
    },
    updated(){
    }
}
</script>

<style>
@import url('../../assets/css/comments.css');
  .center_div{
   text-align: center;
} 
</style>