<template>
<div class="wraper" @click="disableDropdown">
  <transition name="fade" mode="out-in" >
      <div v-show="!isLoaded" class="modal-mask-home" style="background: white; text-align:center;">
        <div class="modal-wrapper">
          <div>
              <div name="fade" mode="out-in" style="width:100%; background-color: #fff; border-radius:7px;">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
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
				<div id="searchform" style="padding:10px;">
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
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
              <div class="col-7" v-if="results && !loading">
                <Suggest v-bind:results="results" @click-store="storeClicked"/>
              </div>
            </div>
            </div>
					</div>
				</div>
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
              <HereMap v-bind:apikey="apikey" @send-place="getPlace"/>
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
      apikey:'',                      //apikey truyền vào bản đồ 
      isLoaded: false,                //biến cờ khi load thông tin xong
      location: '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh, Vietnam',//địa chỉ mặc định
      active: false,                  //biến mở cửa sổ bản đồ
      banner: '',                     //ảnh banner                  
      loading: false,                 //biến loading khi đan tìm quán
      stores:null,                    //Danh sách quán 
      keyword: '',                    //từ khóa để tìm quán
      results: null,                  //danh sach quán sau khi lọc 
      isDropdown: false,
    }
  },
  created(){
    this.onInit();                    //hàm khởi tạo
  },
  mounted(){                
  },
  watch:{
    keyword: function(){                //hàm watch của biến keyword hàm này sẽ chạy khi biến thay đổi 
      this.isDropdown=true;
      this.loading = true;
      // this.stores = [];
      this.search();
    }
  },
  methods:{
    onInit: _.debounce(function(){
      document.title = "Viefood";
      this.getBanner();                  //load banner
      this.getKeys();                    //load apikey cho map
      // var id= localStorage.getItem('provinceId');
      if(sessionStorage.getItem('place')){
        let tempplace = JSON.parse(sessionStorage.getItem('place'));//lấy địa điểm có trong sessionStorage
        this.location = tempplace.formatted_address;
      }
      this.isLoaded = true;                                         //hoàn tất tải 
    },1000),
    getBanner(){                                                    //lấy link ảnh của banner trên firebase
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
    storeClicked(item) {                                            //chuyển đến trang em chi tiết quán
      RouterService.storeClicked(item);
    },
    dishClicked(item) {
      RouterService.dishClicked(item);                              
    },
    onSearchClicked(){                                              //khi nhấn tìm hoặc enter sẽ chuyển đến trang tìm kiếm
      localStorage.setItem("keyword", this.keyword);
      this.$router.push('/search?key=' + this.keyword).catch(()=>{});
    },
    disableDropdown(){                                               //ẩn hộp thoại gợi ý tìm quán 
      this.isDropdown = false;
      return this.isDropdown;
    },
    async getPlace(place,lat,long){                                   //lấy tên địa điểm sau khi người dùng đổi 
      try{
        this.location = place; 
        this.active=false;
      }
      catch(err){console.log(err)}
    },
    openMap(){                                                          //mở cửa sổ bản đồ
      this.active = true;
    },
    //test
    search: _.debounce(async function(){                                //hàm tìm kiếm
       if(this.keyword == '')
        {
          this.loading = false;
          return this.results=null;
        }
      if(sessionStorage.getItem('place')){
					let tempplace = JSON.parse(sessionStorage.getItem('place'));
					console.log(tempplace)
          //gọi api lấy danh sách quán theo từ khóa và lat lng của địa chỉ mới 
					this.results = await StoreService.searchStore_distance(this.keyword,tempplace.lat,tempplace.lng);
				}
			else
        { //nếu không có địa chỉ mới thì gọi api lấy danh sách quán theo từ khóa và lat lng của địa chỉ mặc định 
          this.results = await StoreService.searchStore(this.keyword);
        }
      if(this.results.length > 0 ){
        this.results = this.results.filter(function(store){ //lọc khoảng cách < 10km
          return parseFloat(store.khoangcach) < 10;
        })
      }
      this.loading =false;
    },500),
    getKeys(){                                      //hàm lấy apikey từ firebase
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
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #ff603b;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>