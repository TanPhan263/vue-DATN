<template>
<div class="wrapper" style="background-color: #f6f6f6f6"> 
  <transition name="fade" mode="out-in" >
      <div v-show="!isLoaded" class="modal-mask" style="background: white; text-align:center;">
        <div class="modal-wrapper">
          <div>
              <div name="fade" mode="out-in" style="width:100%; background-color: #fff; border-radius:7px;">
                <div class="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>
              </div>
          </div>
        </div>
      </div>
  </transition>
    <div v-if="storeID!=='' && storeName!=='' && storePicture!==''" @click="notify=false,chat=!chat" class="message"><i class="fa fa-envelope"></i>
    </div>
    <transition >
      <div v-show="chat" class="chat">
        <Chat v-bind:isOpen="chat" v-bind:storeID="storeID" v-bind:storeName="storeName" v-bind:storePicture="storePicture" />
      </div>
    </transition>
  <!-- <Header/> -->
  <Navbar :class="scroll_nav"/>
  <div class="pn-microsite">
    <div id="storeInfor" class="micro-content">
      <div class="micro-header clearfix">
        <div class="main-image fl_left">
          <div class="img" style="height: 275px">
            <a href="#">
              <img
                v-lazy="storeOpen[0].storePicture"
                alt="sunnie food finding"
                style="width: 488px; height: 275px;border-radius: 15px 0px 0px 15px;"
              />
            </a>
          </div>
        </div>
        <div class="main-information fl_left">
          <div class="res-common">
            <div class="breadcrum"></div>
            <div class="main-info-title">
              <div v-if="storeRate > 3.5" class="numberCircle" style="float:right;background:limegreen">
               {{ Math.ceil(storeRate*100)/100}}
              </div>
               <div v-else class="numberCircle" style="float:right; background:red">
              {{ Math.ceil(storeRate*100)/100}}
              </div>
              <h1 style="width: 600px; margin-top:20px;font-size: 25px" class="fl_left">{{storeOpen[0].storeName}}
              </h1>
              <div class="clearfix"></div>
              <div class="category">
                <div class="category-items fl_left" style="max-width: 200px;">
                  <a title="category-items;" style="font-size:large;"><i class="fas fa-utensils"></i>  {{ businessTypeName }}</a>
                </div>
                <div class="category-cuisines fl_left">
                </div>
              </div>
            </div>
            <div class="res-summary-point"></div>
            <div class="disableSection" style=" width:97%;border-top: 1px solid #888;">
              <div class="res-common-add">
                <span>
                  <a href="#map">
                    <span>  <span class="fa fa-location-arrow locationicon fa-3x" style="font-size: 15px"></span> {{storeOpen[0]['storeAddress']}}</span>
                  </a>
                </span>
              </div>
              <div class="res-common-price" style="padding-bottom: 10px;">
                <div class="micro-timesopen" style="padding-top: 5px;padding-bottom: 15px;">
                  <span class="fa fa-clock-o houricon" style="font-size: 15px"></span>
                  <span v-if="getActiveTime(storeOpen[0].openTime,storeOpen[0].cLoseTime)" class="itsopen">Mở cửa </span>
                  <span v-else class="itsclose" >Đóng cửa </span>
                  <span >{{storeOpen[0].openTime}} - {{storeOpen[0].cLoseTime}}</span>
                </div>
                <div class="res-common-minmaxprice"  style="border-top: 1px solid #888;">
                  <span v-if="discountList"><span v-for="(discount,index) in discountList" v-bind:key="index" class="fa fa-tag" style="font-size: 15px; color: red; border: 1px solid red; padding: 2px;"> {{getDiscountName(discount.idDiscountType)}}</span>  </span>
                </div>
                 <iframe :src="'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fviefood.info%2F'+storeID+'&layout=button&size=large&appId=396920051515132&width=87&height=28'" width="87" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div :class="'micro-main-menu fl_left ' + scrollMenu">
      <div class="tool-bar">
        <ul class="list-tool" >
          <li style="border: none;">
            <a href="#storeInfor" v-bind:class="[activeClass === 'Thông tin quán' ? 'active': '']" @click="changeActive('Thông tin quán')"
              >
              <i class="fa fa-info-circle" aria-hidden="true"></i>  THÔNG TIN QUÁN
              <span
                class="fa fa-angle-right"
                style="float: right; font-size: 14px"
              ></span>
            </a>
          </li>
          <li>
            <a href="#menu" v-bind:class="[activeClass === 'Thực đơn' ? 'active': '']" @click="changeActive('Thực đơn')"
              >
              <i class="fa fa-list" aria-hidden="true"></i>  THỰC ĐƠN
              <span
                class="fa fa-angle-right"
                style="float: right; font-size: 14px ;"
              ></span>
            </a>
          </li>
          <li>
            <a href="#comment" v-bind:class="[activeClass === 'Bình luận' ? 'active': '']" @click="changeActive('Bình luận')"
              >
              <i class="fa fa-comment" aria-hidden="true"></i>  COMMENTS
              <span
                class="fa fa-angle-right"
                style="float: right; font-size: 14px"
              ></span>
            </a>
          </li>
          <li>
            <a href="#map" v-bind:class="[activeClass === 'Xem trên Map' ? 'active': '']" @click="changeActive('Xem trên Map')"
              > <i class="fa fa-location-arrow"></i>  BẢN ĐỒ
              <span
                class="fa fa-angle-right"
                style="float: right; font-size: 14px"
              ></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  
    <div class="micro-right fl_right">
      <div class="micro-main-content"
        style="clear: both; position: static; min-height: 700px">
        <div id="menu" class="microsite-table-book">
          <div class="tb-title">
            <h2 style="font-size: 17px; padding: 5px 0; cursor: pointer">
              <a
                href=""
                title="Menu"
                target="_blank"
                style="color: #000"
                >MENU</a
              >
            </h2>
          </div>
          <div class="tb-offers-box">
            <div class="tb-content" >
              <div v-for="(dish,index) in storeMenu" v-bind:key="index" class="tb-offer-item">
                <div class="tb-item-left" style="margin-left: 20px">
                  <div class="popup" @click="showDishChoosed(dish,index)" @mouseover="openPopup('myPopup'+ index)" @mouseleave="closePopup('myPopup'+ index)">
                  <img v-lazy="dish.dishPicture" style="width: 120px; height: 110px; border-radius:10px; cursor:pointer;"/>
                    <span class="popuptext" :id="'myPopup'+ index"><img height="500" width="800"  v-lazy="dish.dishPicture" ></span>
                  </div>
                </div>
                  <div class="tb-item-mid" style="">
                    <a @click="showDishChoosed(dish, index)" style="color: #000" class="tb-oi-time">
                    <span class="">{{dish.dishName}}</span>
                    <span class=""></span>
                  </a>
                  <a style="color: #000; font-size: 15px;"  class="tb-oi-time">
                    <span>
                      {{dish.dishPrice}}</span
                    >
                  </a>
                </div>
                <!-- <div style="width: 30px; height:30px; background-color: red; float:right; border-radius: 5px;"> -->
                <!-- <p style="text-align: center; margin-top: 7px;"><span class="fa fa-plus fl-right" style="color:white;"></span></p> -->
                <div style="float:right">
                  <div class="res-common-minmaxprice"  v-if="dishDiscountList[index]">
                      <span v-for="(discount,index) in dishDiscountList[index]" v-bind:key="index" style="margin-right: 5px; padding: 3px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"> {{getDiscountName(discount.dishcountTypeID)}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <transition v-if="active">
              <div class="modal-mask">
              <div class="modal-wrapper">
                <div class="modal-container">
                <div class="modal-header">
                  <slot name="header">
                  <h5>{{dishChoosed.dishName}}</h5>
                  </slot>
                  <a class="tb-shorttitle" style="float:right; font-size: 20px;">
                      <i v-on:click="active=false" class="fas fa-times" style="float: right; font-size: 20px;"></i>
                    </a>
                </div>

                <div class="modal-body">
                <slot name="body">
                  <div class="row">
                  <div class="tb-item-left col-sm-6">
                  <img v-lazy="dishChoosed.dishPicture" style="width: 300px; height: 200px; border-radius:3px" />
                  </div>
                  <div class="tb-item-mid col-sm-4">
                    <a class="tb-shorttitle">
                        <strong><span>Giá gốc:</span><span>{{dishChoosed.dishPrice}}</span></strong>
                        <br>
                        <h6>Khuyến mãi đang áp dụng:</h6>
                        <div class="res-common-minmaxprice"  v-if="dishDiscountList[dishChoosedIndex]">
                        <span v-for="(discount,index) in dishDiscountList[dishChoosedIndex]" v-bind:key="index" style="margin-right: 5px; padding: 3px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"> {{getDiscountName(discount.dishcountTypeID)}}</span><br>
                        </span>
                        </div>
                    </a>
                  </div>
                  </div>
                  </slot>
                </div>

                <div class="modal-footer">
                </div>
                </div>
              </div>
              </div>
        </transition>
            <Comments v-bind:storeID="storeID" />
          <div id="map" class="microsite-gallery" style="margin-top: 15px">
            <div style="margin-bottom: 40px">
              <h4>BẢN ĐỒ</h4>
               <a v-if="storeOpen[0].lat" class="direction-button" :href="'http://maps.google.com/maps?z=8&t=m&q=loc:' + storeOpen[0].lat + '+' + storeOpen[0].long" target="_blank" >
                <i class="fas fa-directions"></i> Đường đi
              </a>
            </div>
            <GoogleMap v-if="storeOpen[0].lat" v-bind:lat="storeOpen[0].lat" v-bind:lng="storeOpen[0].long"/>
            <div id="map"></div>
        </div>
      </div>
    </div>
  </div>
  <Footer style="margin-top: 200px;"/>
  
</div>
</template>

<script>
import { freeSet } from '@coreui/icons';
import Header from './containers/Header';
import Navbar from './containers/Navbar';
import GoogleMap from './containers/GoogleMap';
import Comments from './containers/Comments/comments';
import Footer from './containers/Footer'
import Chat from '../user/chat/chatUser'
import StoreService from '@/services/StoreService.js';
import DiscountService from '@/services/DiscountService.js';

export default {
  name: 'storeDetail',
   icons: { freeSet },
   beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.usersOpened = from.fullPath.includes('Homepage')
    })
  },
  data(){
    return{
      notify: false,
      isLoaded: false,
      chat: false,
      address: '',
      //binding class
      activeClass: 'Thông tin quán',
      scrollMenu: '',
      scroll_nav:'',
      nav: '',
      //dishChoosed
      active: false,
      dishChoosed:'',
      dishChoosedIndex: 0,
      storeID:'',
      storeName: '',
      storePicture: '',
      storeRate:0,
      storeOpen: [
        {
        storeID: String,
        storeAddress: String,
        storeName: String,
        storePicture: String,
        openTime: String,
        cLoseTime: String ,
        userID: String,
        provinceID:String ,
        menuID: String,
        businessTypeID:String,
        ratePoint: String,
        }
      ],
      storeMenu:[],
      menuId: '',
      isMapOpen: false,
      provinces: [],
      businessTypeName:'',
      ratePoint:[],
      totalRate:5,
      commentList:[],
      discountList:[],
      discountAll:[],
      dishDiscountList:[]
    }
  },
  components:{
    Header,
    Navbar,
    GoogleMap,
    Comments,
    Footer,
    Chat
  },
methods:{
    // getType(index){
    //   this.$http.get(baseUrl +'/BusinessType/GetByID?id='+ index).then(response =>{
    //     this.businessTypeName = response.data[0].businessTypeName })
    // },
    showDishChoosed(dish,index)
    {
      this.active = true;
      this.dishChoosed = dish;
      this.dishChoosedIndex = index;
    },
    changeActive(tab){
      this.activeClass = tab;
    },
    getActiveTime(open,close){
		  const today = new Date();
      const hour = today.getHours();
      const min = today.getMinutes();
      let openHour = parseInt((open+'').substring(0,2))
      let openMin = parseInt((open+'').substring(3,5)) 
      let closeHour = parseInt((close+'').substring(0,2))
      let closeMin = parseInt((close+'').substring(3,5))
      if( openHour < hour && hour < closeHour)
          return true;
      else if( hour == closeHour && min < closeMin)
          return true;
      else if(hour == openHour && min >= openMin)
          return true
      else return false;
    },
     dishClicked (item) {
       this.$router.push({path: `dishtype`, query:{key: item}})
    },
    storeClicked(item){
      this.$router.push('/'+ item);
      this.$router.go();
    },
    onScroll(){
      window.onscroll = () => {
        if (document.documentElement.scrollTop > 35) {
          this.scroll_nav='sticky-nav';
        }
        else{
          this.scroll_nav='';
        }
        if (document.documentElement.scrollTop > 335) {
          this.scrollMenu= 'sticky';
        } else {
          this.scrollMenu= '';
        }
      };
    },
    async getDisCount(id,array){
      try{
      this.discountList = await DiscountService.getDiscountbyStore(id);
      this.discountAll =  await DiscountService.getAll();
      for (let i = 0; i < array.length ; i++) {
        let discount = await DiscountService.getDishDiscounts(array[i].dish_ID)
        this.dishDiscountList.push(discount);
      };
      console.log(this.dishDiscountList)
      }
      catch(err){
        console.log(err)
      }
    },
    getDiscountName(id){
      let temp = ''
      this.discountAll.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    async onInit(){
      try{
        this.storeID = this.$route.params.id;
        this.storeOpen = await StoreService.getByID(this.storeID);
        this.storeName=this.storeOpen[0].storeName;
        this.storePicture=this.storeOpen[0].storePicture;
        this.address=this.storeOpen[0].storeAddress;
        this.storeRate = this.storeOpen[0].ratePoint;
        if(this.storeRate == null || this.storeRate == 'NaN' ) this.storeRate = 0;
        this.storeMenu = await StoreService.getDishByStore(this.storeID);
        this.businessTypeName = await StoreService.getBussinessTypeById(this.storeOpen[0].businessTypeID);
        this.getDisCount(this.storeID,this.storeMenu);
        this.isLoaded = true;
      }
      catch{}
    },
    openPopup(name) {
			if(this.isPopup == false){
        this.isPopup = true;
        var popup = document.getElementById(name);
        popup.classList.toggle("show");
			}
		},
		closePopup(name) {
			if(this.isPopup == true){
				var popup = document.getElementById(name);
				popup.classList.toggle("show");
				this.isPopup = false;
			}
		},
  },
  created(){
    this.storeID=this.$route.params.id;
  },
  mounted(){
    try{
      // this.$http.get('https://api.viefood.info/api/Store/GetByID?id='+ id).then(response => {
      //       this.storeOpen = response.data
      //       this.storeID=this.storeOpen[0].storeID;
      //       this.storeName=this.storeOpen[0].storeName;
      //       this.storePicture=this.storeOpen[0].storePicture;
      //       this.address=this.storeOpen[0].storeAddress;
      //       this.storeRate = this.storeOpen[0].ratePoint;
      //       if(this.storeRate == null || this.storeRate == 'NaN' ) this.storeRate = 0;
      //       this.$http.get('https://api.viefood.info/api/Dish/GetByIDStore?id=' +this.storeID).then(response => {
      //           this.storeMenu = response.data;
      //           this.storeMenu.forEach( element => {
      //             if(!this.dishType.includes(element.dishType_ID))
      //               this.dishType.push(element.dishType_ID);
      //           });
      //       });
      //       this.getType(this.storeOpen[0].businessTypeID);
      //       this.isLoaded = true;
      // });
      this.onInit();
      this.onScroll();
    }
    catch(err){console.log(err)}
  }
}
</script>

<style>
@import url('../../assets/css/comments.css');
@import url('../../assets/css/style-1.css');
@import url('../../assets/css/footer.css');
@import url('../../assets/css/reset.css');
#map {
  height: 100%;
}
html {
  scroll-behavior: smooth;
}
.sticky {
  position: fixed;
  top: 50px;
}
.sticky-nav {
  position: fixed;
  top: 0px;
}
.message{
  z-index: 3;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: center;
  background: blue;
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.message i {
  margin: 13px;
  color: white;
  font-size: 30px;
}
.chat{
  z-index: 2;
  height: 450px;
  width: 950px;
  position: fixed;
  bottom: 0;
  right: 0;
}
.chatArea{
  z-index: 1;
  height: 500px;
  width: 700px;
  position: fixed;
  bottom: 0;
  right: 0;
}
.left-thing{
	width: 10%; 
	height: 100%;
}
.middle-thing{
	width: 55%;
	font-size: 13px;
}
.right-thing{
	width: 35%;
	float: right;
	text-align: right;
	font-size: 13px;
}
.numberCircle {
    width: 50px;
    line-height: 50px;
    border-radius: 50%;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    color: white;
} 
</style>
