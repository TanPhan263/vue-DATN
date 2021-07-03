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
      <vueper-slide style="border-radius:10px;" v-for="(slide, i) in discount" :key="i" :image="slide.discountTypePicture"  @click.native="getDiscountStore(slide.discountTypeID,slide.discountTypeName)"  />
    </vueper-slides>
    <transition v-if="active">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
				<div class="modal-header">
					<slot name="header">
					<h4>{{discountName}}</h4>
           <i @click="active=false" class="fas fa-times" style="padding: 3px;float: right; font-size: 23px;"></i>
					</slot>
				</div>
				<div class="modal-body">
					<slot name="body" v-if="!loadingDiscount">
              <div v-on:click="storeClicked(result.storeID)" href="" class="search_suggest" v-for="result in discountStore" v-bind:key="result.storeID" style="
                text-align: left; display: flex; border-bottom: 1px solid darkgray;cursor: pointer;padding: 4px 45px 4px 10px;">
                  <img v-lazy="result.storePicture" class="left-thing" style="border-radius:5px;">
                  <div class="middle-thing" style="margin-left: 3px; height: 100%;">
                    <p style="margin-top: 0px; height: 15%; font-size: 14px; font-weight: bold;">{{result.storeName}}</p>
                    <p style="margin-top: 0px;">{{result.storeAddress}}</p>
                  </div>
                 <div v-if="getActiveTime(result.openTime,result.cLoseTime)" class="right-thing">
                    <p style="font-size: 12px;margin-top: 0px; height: 15%; color:green;">Đang hoạt động <span class="dot"></span></p>
                    <p style="color: #585858;" >{{result.khoangcach}} km</p>
                  </div>
                  <div v-else class="right-thing">
                    <p style=" margin-top: 0px; height: 20%; color:red;">Đóng cửa <span class="dot" style="background-color:#FF0000;"></span></p>
                    <p >{{result.khoangcach}} km</p>
                </div>
              </div>
					</slot>
          <div v-show="loadingDiscount" style="margin: 0 auto;" class="loader-discount"></div>
				</div>

				<div class="modal-footer">
					<slot name="footer">
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

   <div class="ship">
	  <div  class="menu-ship">
        <div class="hero">
          <h4>MÓN NGON MỖI NGÀY</h4>
        </div>
    </div>
    <div class="sub-menu-ship">
        <ul>
          <li v-for="(dish, index) in dishes" v-bind:key="index" style="height:90px;width:100px;"  @click="dishClicked(dish.dishName)">
          <a :href="'/search?key='+ dish.dishName">
            <img v-lazy="dish.dishPicture" style="border-radius:10px 10px 10px 10px; width:102px; height:90px;cursor: pointer;"/>
          </a>
          <div @click="dishClicked(dish.dishName)" style="margin: 0 auto;text-align:center; background-color:#f6f6f6; width: 80px; padding-bottom: 20px;"> 
                <p style="margin-top: 3px; font-size:15px; font-weight:bold; word-break:keep-all;">{{dish.dishName}}</p></div>
          </li>
        </ul>
    </div>
    <div>
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%;">
                <p @click="dishViewMore" >XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
              </div>
            </div>
          </div>  
      </div>
  </div>
    <div class="ship" style="width:88%;">
      <div class="menu-ship">
        <div class="hero">
          <h3>ĐƯỢC ĐÁNH GIÁ CAO</h3>
        </div>
      </div>
      <div id="Giaotannoi" class="sub-menu-ship" >
        <ul v-if="!show">
          <li v-for="(store, index ) in rates" v-bind:key="index"  style="position: relative">
              <div v-if="store.discount === true" class="top-left">
                <div class="popup"  @click="openPopup('danhgiacao'+ store.storeID,store.storeID)"
                 @mouseleave="closePopup('danhgiacao'+ store.storeID)">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-certificate fa-stack-2x"></i>
                        <i class="fa fa-tag fa-stack-1x fa-inverse"></i>
                    </span>
                    <span class="popuptext" :id="'danhgiacao'+ store.storeID">
                       <div v-show="loadingStoreDiscount" style="margin: 0 auto;" class="loader-small"></div>
                      <span v-show="!loadingStoreDiscount" v-if="discountList">
                        <span v-for="(dis,index) in discountList" v-bind:key="index"> <i class="fa fa-tag" style="font-size: 15px; color: red; padding: 2px;"/> {{getDiscountName(dis.idDiscountType)}} <br></span>
                      </span>
                    </span>
                </div>
              </div>
            <!-- <a v-on:click="storeClicked(store.storeID)">
              href="/Homepage/" -->
            <a class="image" :href="'/'+store.storeID" >
             <img v-lazy="store.storePicture"/>
              <div class="middle">
              <div class="text" style="background: #ff6666 ">Xem quán</div>
              </div>
             
              <div class="name-food">{{ subStringName(store.storeName)}}...</div>
              <div class="address-store"><i class="fa fa-map-marker" style="color: red"></i>{{ subString(store.storeAddress) }}...
              <div style="color: black; float:right;">{{store.khoangcach}} km</div>
              </div>
                <div class="address-store"> <span class="fas fa-utensils"></span> {{ getType(store.businessTypeID) }}
                <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                </div>
              <div class="intro"></div>
            </a>
          </li>
        </ul>
          <div v-show="show" style="margin: 0 auto" class="loader"></div>
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
          <h3>GẦN BẠN NHẤT</h3>
        </div>
      </div>
      <div id="Giaotannoi" class="sub-menu-ship" >
        <ul v-if="!show">
          <li vi v-for="(store, index) in nearest" v-bind:key="index">
             <div v-if="store.discount === true" class="top-left">
                <div class="popup"  @click="openPopup('gantoi'+ store.storeID,store.storeID)"
                 @mouseleave="closePopup('gantoi'+ store.storeID)">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-certificate fa-stack-2x"></i>
                        <i class="fa fa-tag fa-stack-1x fa-inverse"></i>
                    </span>
                    <span class="popuptext" :id="'gantoi'+ store.storeID">
                       <div v-show="loadingStoreDiscount" style="margin: 0 auto;" class="loader-small"></div>
                      <span v-show="!loadingStoreDiscount" v-if="discountList">
                        <span v-for="(dis,index) in discountList" v-bind:key="index"> <i class="fa fa-tag" style="font-size: 15px; color: red; padding: 2px;"/> {{getDiscountName(dis.idDiscountType)}} <br></span>
                      </span>
                    </span>
                </div>
              </div>
            <a :href="'/'+store.storeID">
              <img v-lazy="store.storePicture" />
              <div class="middle">
              <div class="text" style="background: #ff6666 ">Xem quán</div>
              </div>
              <div class="name-food"> {{ subStringName(store.storeName)}}...</div>
              <div class="address-store"><i class="fa fa-map-marker"  style="color: red"></i>  {{ subString(store.storeAddress) }}...
              <div style="color: black; float:right;">{{store.khoangcach}} km</div></div>
                <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                 <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                </div>
              <div class="intro"></div>
            </a>
          </li>
        </ul>
        <div v-show="show" style="margin: 0 auto;" class="loader"></div>
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
    <Area v-bind:type="type" v-bind:discount="discount" v-bind:discountList="discountList" v-bind:loadingStoreDiscount="loadingStoreDiscount"/>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="disabled"  infinite-scroll-distance="100" style="margin-top: 20px;" >
      <div v-for="(list, index) in loadMoreList" v-bind:key="index" class="ship">
        <div class="menu-ship">
          <div class="hero" style="width:30%">
            <h3 v-if="list && list.length > 0" style="text-align:left"> {{ getType(list[0].businessTypeID) }}</h3>
          </div>
        </div>
        <div v-if="list" class="sub-menu-ship">
          <ul>
            <li v-for="(store,index2) in list" v-bind:key="index2">
              <div v-if="store.discount === true" class="top-left">
                <div class="popup"  @click="openPopup('myPopup'+ store.storeID,store.storeID)"
                 @mouseleave="closePopup('myPopup'+ store.storeID)">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-certificate fa-stack-2x"></i>
                        <i class="fa fa-tag fa-stack-1x fa-inverse"></i>
                    </span>
                    <span class="popuptext" :id="'myPopup'+ store.storeID">
                       <div v-show="loadingStoreDiscount" style="margin: 0 auto;" class="loader-small"></div>
                      <span v-show="!loadingStoreDiscount" v-if="discountList">
                       <span v-for="(dis,index) in discountList" v-bind:key="index"> <i class="fa fa-tag" style="font-size: 15px; color: red; padding: 2px;"/> {{getDiscountName(dis.idDiscountType)}} <br></span>
                      </span>
                    </span>
                </div>
              </div>
              <a :href="'/'+store.storeID">
                <img v-lazy="store.storePicture"/>
              <div class="middle">
              <div class="text" style="background: #ff6666 ">Xem quán</div>
              </div>
                <div class="name-food">{{ subStringName(store.storeName) }}...</div>
                <div class="address-store"> <i class="fa fa-map-marker"  style="color: red"></i> {{ subString(store.storeAddress) }}...
                  <div style="color: #585858; float:right;">{{store.khoangcach}} km</div>
                </div>
                  <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                   <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
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
import RouterService from '@/services/RouterService.js';
import { loadOptions } from '@babel/core';
import Area from './Area.vue';
const baseUrl='https://api.viefood.info/api/'
import DiscountService from '@/services/DiscountService.js'

export default {
    name: 'Homebody',
    components:{
        VueperSlides, VueperSlide,Area
    },
    data() {
        return {
          margin: 150,
          loading: false,
          loadingDiscount: false,
          loadingStoreDiscount: false,
          index: 0,
          stores: [],
          provinceID: '',
          //Search data
          nearest: [],
          rates: [],
          type: [],
          loadMoreList: [],
          dishes: [],
          discount:[],
          active:false,
          discountStore: [],
          show: true,
          discountName:'',
          discountList:[],
          currDiscount:'',
          clicked: false,
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
      },
      methods:{
        async onInit(){
          try{
            this.discount = await DiscountService.getAll();
            var id = localStorage.getItem('provinceId');
            this.provinceID = id;
            this.stores = await StoreService.getByProvince(id)
            this.rates = await StoreService.getByProvince(id);
            this.rates.sort(function compare( a, b ) {
                return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
            });
            this.type = await StoreService.getAllBussinessType();
            console.log(this.type); 
            this.nearest = this.stores.slice(0,12);
            this.rates = this.rates.slice(0,12);
            this.show = false;
          }catch(err){console.log(err)}
        },
        storeClicked(item) {
          RouterService.storeClicked(item);
        },
        dishClicked (item) {
          localStorage.setItem("keyword", item);
          RouterService.dishClicked(item);
        },
        dishViewMore(){
           RouterService.dishViewMore();
        },
        viewMore_Search(index){
          RouterService.viewMore_Search(index)
        },
        changeProvince(index){
          this.$http.get(baseUrl+ 'GetByIDProvince?id=' + index).then(response => {
            this.stores= response.data
          });
        },
        async changePlace(lat,long){
          try{
            console.log('ChangePlace')
            var id= localStorage.getItem('provinceId');
            this.stores = await StoreService.getByProvince_distance(id, lat,long)
            this.rates = await StoreService.getByProvince_distance(id,lat,long);
            this.rates.sort(function compare( a, b ) {
                return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
            });
            this.nearest = this.stores.slice(0,12);
            this.rates = this.rates.slice(0,12);
          }
          catch(err){
            console.log(err);
          }
        },
        getType(index){
          try{
          var temp='Unknown'
          this.type.forEach(element => {
              if(element.businessTypeID == index)
                temp = element.businessTypeName;
          });
          return temp;
          }
          catch(err){console.log(err)}
        },
        subString(index){
          return index.toString().substring(0,13);
        },
        subStringName(index){
          return index.toString().substring(0,20);
        },
      loadMore(){
        try{
          this.loading = false;
          setTimeout(() =>{
            if(this.index < this.type.length){
                let id = this.type[this.index].businessTypeID;
                var store = this.stores.filter(function(store) {
                    return store.businessTypeID === id });
                if(store.length >= 12){
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
        }
        catch(err){console.log(err)}
      },
      viewMore(id){
        this.$router.push('/viewmore?key=' + id).catch(()=>{});
      },
      async getDiscountStore(id,name){
        this.loadingDiscount = true;
        this.discountName = name;
        this.active=true;
        this.discountStore = await DiscountService.getStore(id)
        this.loadingDiscount = false;
      },
      getActiveTime(open,close){
        const today = new Date();
        const hour = today.getHours();
        const min = today.getMinutes();
        let openHour = parseInt((open+'').substring(0,2));
        let openMin = parseInt((open+'').substring(3,5));
        let closeHour = parseInt((close+'').substring(0,2));
        let closeMin = parseInt((close+'').substring(3,5));
        if( openHour < hour && hour < closeHour)
            return true;
        else if( hour == closeHour && min < closeMin)
            return true;
        else if(hour == openHour && min >= openMin)
            return true;
        else return false;
      },
      openPopup(name,id) {
        this.loadingStoreDiscount = true;
        // if(this.currDiscount){
        //   var popupcurr = document.getElementById(this.currDiscount);
        //   popupcurr.classList.toggle("show");
        // }
        var popupnew = document.getElementById(name);
        popupnew.classList.toggle("show");
        this.currDiscount = name;
        this.clicked = true;
        this.getDisCount(id);
      },
      closePopup(name) {
        if(this.clicked == true){
          this.discountList = [];
          this.loadingStoreDiscount = false;
          this.currDiscount = '';
          var popupnew = document.getElementById(name);
          popupnew.classList.toggle("show");
          this.clicked = false;
        }
      },
      async getDisCount(id){
        try{
          this.discountList = [];
          this.discountList = await DiscountService.getDiscountbyStore(id);
          this.loadingStoreDiscount = false;
        }
        catch(err){
          console.log(err)
        }
      },
      getDiscountName(id){
        let temp = ''
        this.discount.forEach(element => {
          if(element.discountTypeID == id)
            temp = element.discountTypeName;
        });
        return temp;
      },
    },
    updated(){
    }
}
</script>

<style>
@import url('../../../assets/css/comments.css');
@import url('../../../assets/css/multiple-creens.css');
  .center_div{
   text-align: center;
} 
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loader-discount {
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #ec1c24;
  width: 80px;
  height: 80px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
.loader-small {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #ec1c24;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>