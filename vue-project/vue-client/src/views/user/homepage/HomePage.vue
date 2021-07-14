<template>
<div class="wraper" @click="disableDropdown">
  <transition name="fade" mode="out-in" >
      <div v-show="!isLoaded" class="modal-mask-home" style="background: white; text-align:center;">
        <div class="modal-wrapper">
          <div>
              <div name="fade" mode="out-in" style="width:100%; background-color: #fff; border-radius:7px;">
                <div class="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>
              </div>
          </div>
        </div>
      </div>
  </transition>
  <!-- <Header/> -->
  <Navbar/>
  <div class="content-banner">
			<div class="banner">
				<img id="banner" style="margin: auto; height: 270px;width: 100%; display: block;">
			</div>
			<div class="search" :style="'background: url('+ banner +')'">
				<form action="#" id="searchform" method="#" style="padding:10px;">
					<div class="search-1 clearfix">
            <div id="vitri" class="vitri" @click="openMap">
              <i class="fas fa-map-marker" style="color: red; font-size: 35px;text-shadow: 2px 2px 3px #585858;"></i>
              <p style="color:#484848;line-height: 20px;font-size: 18px; font-weight: bold;
                border-bottom:2px solid #484848;"> {{location}} 
              </p>
            </div>
            <input v-model="keyword" type="text" placeholder="Tìm kiếm món ăn, quán ăn,..." v-on:keyup.enter="onSearchClicked">
						<a @click="onSearchClicked" class="icon-search"><i class="fa fa-search" style=" margin-top: 8px;font-size: 30px;"></i></a>
            <div class="dropdown" v-if="isDropdown" style="margin: 0 auto;">
            <div id="myDropdown" class="dropdown-content" style="width: 618px;
                height: 550px;
                overflow-y: auto;overflow-x: hidden; padding: 5px;">
              <div v-show="loading" name="fade" mode="out-in" style="width:100%; background-color: #fff; border-radius:7px;">
                <div class="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>
              </div>
              <div class="col-7" v-if="results && !loading">
                <Suggest v-bind:results="results" @click-store="storeClicked"/>
              </div>
            </div>
            </div>
					</div>
				</form>
			</div>
	</div>

    <transition v-if="active === true">
      <div class="modal-mask-home">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div style="padding: 10px">
            <strong style="font-size: 20px"> Chọn địa điểm của bạn</strong>
              <i v-on:click="active=false" class="fas fa-times" style="padding: 3px;float: right; font-size: 23px;"></i>
            </div>
              <!-- <GoogleMapHome @send-place="getPlace"/> -->
              <HereMap @send-place="getPlace"/>
          </div>
        </div>
      </div>
		</transition>
      <transition name="fade" mode="out-in" >
          <router-view v-bind:keyword="keyword" :key="$route.path"></router-view>
      </transition>
    <Footer/>
  </div>
</template>
<script>
import firebase from '@/firebase/init.js';
import Navbar from '../navBar/Navbar'
import Suggest from './Suggest'
import Homebody from './Homebody'
import CategoryPage from './CategoryPage'
import SearchPage from './SearchPage'
import Footer from '../footer/Footer'
import GoogleMapHome from './GoogleMapHome';
import HereMap from './HereMap';
import StoreService from '@/services/StoreService.js'
import RouterService from '@/services/RouterService.js'
export default {
  name:'Home',
  components:{
      Navbar,
      Footer,
      GoogleMapHome,
      Suggest,
      CategoryPage,
      HereMap
    },
  data() {
    return {
      isLoaded: false,
      location: '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam',
      active: false,
      banner: '',
      show: true,
      loading: false,
      user: 'null',
      stores:null,
      keyword: '',
      results: null,
      isDropdown: false,
    }
  },
  created(){
    this.getBanner();
    this.onInit();
  },
  watch:{
    keyword: function(){
      this.isDropdown=true;
      this.loading = true;
      // this.stores = [];
      this.search();
    }
  },
  methods:{
    async onInit(){
      // var id= localStorage.getItem('provinceId');
      if(sessionStorage.getItem('place')){
        let tempplace = JSON.parse(sessionStorage.getItem('place'));
        this.location = tempplace.formatted_address;
        // this.stores = await StoreService.getByProvince_distance(id,tempplace.lat,tempplace.lng);
        //this.stores = await StoreService.getByProvince_distance(id,tempplace.geometry.location.lat,tempplace.geometry.location.lng);
      }
      // else this.stores = await StoreService.getByProvince(id);
      this.isLoaded = true;
    },
    getBanner(){
      const socialRef = firebase.database().ref("Footer/banner/");
        socialRef.on("value", snapshot => {
        let data = snapshot.val();
        if(data){
          let banner = [];
          Object.keys(data).forEach(key => {
              banner.push({
                id: key,
                picture: data[key].picture,
              });
          });
          this.banner = banner[0].picture;
        }
        else{
          this.banner='';
        }
      });
    },
    storeClicked(item) {
      RouterService.storeClicked(item);
    },
    dishClicked(item) {
      RouterService.dishClicked(item);
    },
    // onkeychange(key){
    //   try{
    //     this.isDropdown=true;
    //     this.loading = true;
    //     if(key == '' || key == null)
    //     {
    //       this.loading = false;
    //       return this.results=null;
    //     }
    //     else {
    //       setTimeout(() =>{
    //         this.results = this.stores.filter(function(store){
    //             var name = FormatWord.xoadau(store.storeName.toString().toLowerCase());
    //             var searchkey = FormatWord.xoadau(key.toString().toLowerCase());
    //             if (name.includes(searchkey))
    //               return true;
    //             return false;
    //         });
    //         this.loading = false;
    //       }, 1500);
    //     }
    //   }
    //   catch(err){
    //     console.log(err);
    //   }
    // },
    onSearchClicked(){
      localStorage.setItem("keyword", this.keyword);
      RouterService.onSearchClicked(this.keyword);
    },
    disableDropdown(){     
      this.isDropdown = false;
      return this.isDropdown;
    },
    async getPlace(place,lat,long){
      try{
        this.location = place; 
        // var id= localStorage.getItem('provinceId');
        // this.stores = await StoreService.getByProvince_distance(id,lat,long);
        this.active=false;
      }
      catch(err){console.log(err)}
    },
    openMap(){
      this.active = true;
    },
    //test
    search: _.debounce(async function(){
       if(this.keyword == '')
        {
          this.loading = false;
          return this.results=null;
        }
      if(sessionStorage.getItem('place')){
					let tempplace = JSON.parse(sessionStorage.getItem('place'));
					console.log(tempplace)
					//this.stores = await StoreService.searchStore_distance(key,tempplace.geometry.location.lat,tempplace.geometry.location.lng);
					this.results = await StoreService.searchStore_distance(this.keyword,tempplace.lat,tempplace.lng);
				}
			else
        {
          this.results = await StoreService.searchStore(this.keyword);
        }
      if(this.results.length > 0 ){
        this.results = this.results.filter(function(store){
          return parseFloat(store.khoangcach) < 5;
        })
      }
      this.loading =false;
    },500)
  }
}
</script>

<style>
@import url('../../../assets/css/style.css');
@import url('../../../assets/css/comments.css');
@import url('../../../assets/css/bootstrap.min.css');
 .modal-mask-home {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.644);
    display: table;
    transition: opacity .3s ease;
  }
.dot {
  height: 7px;
  width: 7px;
  background-color:#339933;
  border-radius: 50%;
  display: inline-block;
}
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 10px;
  background: #DC143C;
  border-radius: 3px;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}
[class*="col-"] {
  width: 100%;
}
@media only screen and (min-width: 768px) {
  /* For desktop: */
  .col-1 {width: 8.33%;}
  .col-2 {width: 16.66%;}
  .col-3 {width: 25%;}
  .col-4 {width: 33.33%;}
  .col-5 {width: 41.66%;}
  .col-6 {width: 50%;}
  .col-7 {width: 58.33%;}
  .col-8 {width: 66.66%;}
  .col-9 {width: 75%;}
  .col-10 {width: 83.33%;}
  .col-11 {width: 91.66%;}
  .col-12 {width: 100%;}
}
</style>