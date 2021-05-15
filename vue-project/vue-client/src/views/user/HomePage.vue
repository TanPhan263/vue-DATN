<template>
<div @click="disableDropdown" class="wraper" style="background-color:#f6f6f6;">
  <Header/>
  <Navbar v-bind:user="user" @dishClicked="dishClicked"  @storeClicked="storeClicked"  :class="scroll" @onkeychange="onkeychange"/>
  <div class="content-banner">
			<div class="banner">
				<img id="banner" style="margin: auto; height: 270px;width: 100%; display: block;">
			</div>
			<div class="search">
				<form action="#" id="searchform" method="#" style="padding:10px;">
					<div class="search-1 clearfix">
            <div id="vitri" class="vitri" @click="active=true">
              <i class="fa fa-map-marker" style="color: red; font-size: 35px;text-shadow: 2px 2px 3px #585858;"></i>
              <p style="color:white;line-height: 20px;font-size: 17px; font-weight: bold;font-family:Helvetica;
              border-bottom:2px solid white;
              text-shadow: 2px 2px 3px #585858;"> {{ location }} 
              </p>
            </div>
            <input v-model="keyword" type="text" placeholder="Bánh mì bò kho..."  v-on:keyup="onkeychange(keyword)">
						<a @click="onSearchClicked" class="icon-search"><i class="fa fa-search" style=" margin-top: 8px;font-size: 30px;"></i></a>
            <div class="dropdown" v-if="isDropdown" style="margin: 0 auto;">
            <div id="myDropdown" class="dropdown-content" style="width: 618px;
                height: 550px;
                overflow: auto; padding: 5px;">
              <div v-show="loading" name="fade" mode="out-in" style="width:100%; background-color: #fff; border-radius:7px;">
                <div class="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>
              </div>
              <div v-if="results && !loading">
                <Suggest v-bind:results="results" @click-store="storeClicked" />
              </div>
            </div>
            </div>
					</div>
				</form>
			</div>
	</div>

   <transition v-if="active">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
						<i v-on:click="active=false" class="fa fa-window-close" style="float: right; font-size: 20px; margin-bottom: 10px;"></i>
					  <GoogleMap />
          <div class="modal-body">
            <p style="font-size: 15px; color:gray;"> <i class="fa fa-location-arrow"  style="margin-left: 20px;color: red; font-size: 15px;"></i> {{ location }}</p>
            <slot class="form-group" name="body">
              <input id="new_location" type="text" class="form-control" placeholder="Nhập vị trí của bạn" style="float: right; height: 30px">
              <button style=" width:20%; height:30px; border-radius: 5px;margin-top: 10px; background-color: red; color: white; border: none; font-size: 15px"> Thay đổi</button>
            </slot>
          </div>
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
import Header from './containers/Header'
import Navbar from './containers/Navbar'
import Suggest from './containers/Suggest'
import Homebody from './Homebody'
import CategoryPage from './containers/CategoryPage'
import SearchPage from './SearchPage'
import Search from './containers/Search'
import Footer from './containers/Footer'
import GoogleMap from './containers/GoogleMap';
import ProvinceService from '@/services/ProvinceService.js'
import FormatWord from '@/services/FormatWord.js'
import StoreService from '@/services/StoreService.js'
export default {
  name:'Home',
  components:{
      Header,
      Navbar,
      Search,
      Footer,
      GoogleMap,
      Suggest,
      CategoryPage
    },
  data() {
    return {
      location: 'Số 1, Võ Văn Ngân, TP.Thủ Đức, Việt Nam',
      active: false,
      nav: '',
      show: true,
      loading: false,
      user: '',
      stores:null,
      keyword: '',
      provinces:[],
      results: null,
      isDropdown: false,
      scroll: ''
    }
  },
  created(){
    this.onInit();
  },
  mounted(){ 
      this.onScroll();
  },
  methods:{
    async onInit(){
      this.keyword = this.$route.query.key;
      this.provinces= await ProvinceService.getAll();
      var id= localStorage.getItem('provinceId');
      this.stores = await StoreService.getByProvince(id);
      this.user=localStorage.getItem('userInfor');
      console.log(this.user);
      this.user = JSON.parse(this.user);
    },
    storeClicked(item) {
      this.$router.push('/storeDetail/'+ item)
    },
    dishClicked(item) {
      this.$router.push('/search?key='+ item)
    },
    onkeychange(key){
      this.isDropdown=true;
      this.loading = true;
      localStorage.setItem("keyword", key);
      if(key == '' || key == null)
        return this.results=null;
      else {
        setTimeout(() =>{
          //this.results = this.stores.filter(this.searchfilter);
           this.results = this.stores.filter(function(store){
              var name = FormatWord.xoadau(store.storeName.toString().toLowerCase());
              var searchkey = FormatWord.xoadau(key.toString().toLowerCase());
              if (name.includes(searchkey))
                return true;
              return false;
           });
          this.loading = false;
         }, 1500);
      }
    },
    searchfilter(store){
      var name = FormatWord.xoadau(store.storeName.toString().toLowerCase());
      var searchkey = FormatWord.xoadau(this.keyword.toString().toLowerCase());
      if (name.includes(searchkey))
        return true;
      return false;
    },
    onSearchClicked(){
      localStorage.setItem("keyword", this.keyword);
      this.$router.push('/search?key=' + this.keyword).catch(()=>{});
    },
    disableDropdown(){     
      this.isDropdown = false;
      return this.isDropdown;
    },
    onScroll(){
      window.onscroll = () => {
        if (document.documentElement.scrollTop > 35) {
         this.scroll= 'sticky'
        } else {
          this.scroll= ''
        }
      };
    }
  }
}
</script>

<style>
@import url('../../assets/css/style.css');
@import url('../../assets/css/footer.css');
@import url('../../assets/css/bootstrap.min.css');
.dot {
  height: 7px;
  width: 7px;
  background-color:#339933;
  border-radius: 50%;
  display: inline-block;
}
.sticky {
  position: fixed;
  top: 0px;
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
</style>