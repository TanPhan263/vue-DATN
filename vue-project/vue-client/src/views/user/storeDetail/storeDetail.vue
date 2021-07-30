<template>
<div class="wrapper" style="background-color: #f6f6f6f6"> 
  <transition name="fade" mode="out-in" >
      <div v-show="!isLoaded" class="modal-mask" style="background: white; text-align:center;">
        <div class="modal-wrapper">
          <div>
              <div name="fade" mode="out-in" style="width:100%; background-color: #fff; border-radius:7px;">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
          </div>
        </div>
      </div>
  </transition>
  <Navbar/>
  <div v-if="isLoaded" class="pn-microsite">
    <div id="storeInfor" class="micro-content">
      <div class="micro-header clearfix">
        <div class="main-image fl_left">
          <div class="img" style="height: 275px">
            <a href="#">
              <img
                v-lazy="storeOpen[0].storePicture"
                alt="viefood.info"
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
               {{ formatRate }}
              </div>
               <div v-else class="numberCircle" style="float:right; background:red">
              {{ formatRate }}
              </div>
                <h1 style="width:600px; margin-top:20px;font-size: 25px;" class="fl_left">{{storeOpen[0].storeName}}
              </h1>
              <div class="clearfix"></div>
              <div class="category">
                <div class="category-items fl_left" style="max-width: 200px;">
                  <iframe :src="'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fviefood.info%2F'+storeID+'&layout=button&size=large&appId=396920051515132&width=87&height=28'" width="87" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                </div>
                 <div class="category-items fl_left" style="max-width: 500px;">
                 <iframe :src="'https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fviefood.info%2F'+storeID+'&width=108&layout=button_count&action=like&size=large&share=false&height=21&appId=396920051515132'" width="87" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                 </div>
                 <div class="category-items fl_left" style="max-width: 500px;">
                  <button v-if="storeName != ''" @click="openChat" class="chat-btn"> <i style="font-size:16px" class="fab fa-facebook-messenger"></i> Nhắn tin</button>
                 </div>
              </div>
            </div>
            <div class="res-summary-point"></div>
            <div class="disableSection" style="width:97%">
              <div class="res-common-add">
                <span>
                  <a href="#map">
                    <span> <span class="fa fa-map-marker icon" style="font-size: 17px"></span> {{storeOpen[0]['storeAddress']}}</span>
                  </a>
                </span>
              </div>
              <div class="res-common-add">
                <span>
                  <a href="#menu">
                    <span> <span class="fas fa-utensils icon" style="font-size: 17px"></span> {{ businessTypeName }} </span>
                  </a>
                </span>
              </div>
              <div class="res-common-add">
                <span>
                  <a href="#menu">
                    <span> <span class="fas fa-usd icon" style="font-size: 17px"></span> {{minprice}},000 - {{maxprice}},000 </span>
                  </a>
                </span>
              </div>
              <div class="res-common-price">
                <div class="micro-timesopen">
                  <span class="fa fa-clock-o houricon"></span>
                  <span style="color:#333333;font-size:18px" >{{storeOpen[0].openTime}} - {{storeOpen[0].cLoseTime}}</span>
                  <span v-if="getActiveTime(storeOpen[0].openTime,storeOpen[0].cLoseTime)" class="itsopen">Đang mở cửa </span>
                  <span v-else class="itsclose">Đóng cửa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="micro-main-menu" :class="'micro-main-menu fl_left ' + scrollMenu">
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
      <div class="micro-main-content">
        <div v-if="storeMenu" id="menu" class="microsite-table-book" style="overflow: hidden;
          margin-bottom: 15px;
          border-radius: 15px;
          width:100%;">
          <div class="tb-title">
            <div v-if="discountList" class="tb-discount">
              <div class="tb-discount-item" v-for="(discount,index) in discountList" v-bind:key="index">
                <div class="row">
                <div class="icontag"><i style="font-size:25px" class="fa fa-tag"/></div>
                <div :class="[index === 0? 'discountName':'discount discountName']">
                  <p>{{getDiscountName(discount.idDiscountType)}}</p>
                </div> 
                 <div :class="[index === 0? 'discountContent':'discount discountContent']">
                  <p>{{getDiscountContent(discount.idDiscountType)}}</p> 
                </div> 
                </div>
              </div>
            </div>
            <h2 style="font-size: 17px; padding: 5px 0; cursor: pointer">
              MENU
            </h2>
          </div>
          <div class="tb-offers-box">
            <div class="tb-content">
              <div v-for="(dish,index) in storeMenu" v-bind:key="index" class="tb-offer-item">
                <div @click="showDishChoosed(dish,index)" class="tb-item-left" style="margin-left: 20px">
                  <img v-lazy="dish.dishPicture" style="width: 120px; height: 110px; border-radius:10px; cursor:pointer;"/>
                </div>
                  <div class="tb-item-mid">
                  <p @click="showDishChoosed(dish, index)" class="tb-oi-time">
                    <span>{{dish.dishName}}</span>
                  </p>
                  <p style="font-size: 15px;" class="tb-oi-time">
                    <span>{{dish.dishPrice}}</span>
                  </p>
                </div>
                <div style="float:right;">
                  <div class="res-common-minmaxprice"  v-if="dishDiscountList[index]" >
                      <span v-for="(discount,index) in dishDiscountList[index]" v-bind:key="index" style="margin-right: 5px; padding: 3px;"><span style="font-size: 17px; color: red"> <i class="fa fa-tag"/> {{getDiscountName(discount.dishcountTypeID)}}</span>
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
                  <img v-lazy="dishChoosed.dishPicture" style="width: 300px; height: auto; border-radius:3px" />
                  </div>
                  <div class="tb-item-mid col-sm-4">
                    <a class="tb-shorttitle" style="font-size:medium">
                        <strong><span>Giá gốc:</span><span>{{dishChoosed.dishPrice}}</span></strong>
                        <br>
                        <h5>Khuyến mãi đang áp dụng:</h5>
                        <div class="res-common-minmaxprice"  v-if="dishDiscountList[dishChoosedIndex]">
                        <span v-for="(discount,index) in dishDiscountList[dishChoosedIndex]" v-bind:key="index" style="margin-right: 5px; padding: 3px;"><span style="font-size: 17px; color: red"> <i class="fa fa-tag"></i> {{getDiscountName(discount.dishcountTypeID)}} <br></span>
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
          <Comments v-if="storeOpen[0]" @change-rate="changeRate" v-bind:storeID="storeID" v-bind:storeRate="storeRate" v-bind:ownerID="storeOpen[0].userID" />
          <div id="map" class="microsite-gallery" style="margin-top: 15px">
            <div style="margin-bottom: 40px">
              <strong style="font-size: 20px">BẢN ĐỒ</strong>
               <a v-if="storeOpen[0].lat" class="direction-button" :href="'http://maps.google.com/maps?z=8&t=m&q=loc:' + storeOpen[0].lat + '+' + storeOpen[0].long" target="_blank" >
                <i class="fas fa-directions"></i> Xem trên GoogleMap
              </a>
            </div>
            <!-- <GoogleMap v-if="storeOpen[0].lat" v-bind:lat="storeOpen[0].lat" v-bind:lng="storeOpen[0].long"/> -->
            <HereMap v-if="storeOpen[0].lat && apikey" v-bind:apikey="apikey" v-bind:lat="storeOpen[0].lat" v-bind:lng="storeOpen[0].long" v-bind:storeName="storeOpen[0].storeName"/>
          </div>
        <!-- <div id="realtive" class="microsite-gallery" style="margin-top: 15px; overflow:visible">
            <div style="margin-bottom: 40px">
              <h4>QUÁN CÙNG LOẠI</h4>
            </div>
         
            <div id="map"></div>
        </div> -->
           <RelativeStore id="relative" v-if="storeOpen[0]"  v-bind:bussinessTypeID="storeOpen[0].businessTypeID"  v-bind:storeID="storeOpen[0].storeID"/>
      </div>
     
    </div>
  </div>
  <Footer id="footer" style="margin-top: 200px;"/>
  
</div>
</template>

<script>
import firebase from '@/firebase/init.js';
import { freeSet } from '@coreui/icons';
import Header from '../containers/Header';
import Navbar from '../navBar/Navbar';
import GoogleMap from './GoogleMap';
import RelativeStore from './RelativeStore';
import Comments from '../comments/comments';
import Footer from '../footer/Footer'
import StoreService from '@/services/StoreService.js';
import DiscountService from '@/services/DiscountService.js';

//tesst
import HereMap from '../homepage/HereMap'

export default {
  name: 'storeDetail',
   icons: { freeSet },
  data(){
    return{
      apikey:'',                          //apikey truyền vào map
      isLoaded: false,                    //biến xác nhận đã tải xong hay chưa
      activeClass: 'Thông tin quán',      //biến dùng để bind class 
      scrollMenu: '',                     //biến dùng để bind class 
      active: false,                      //biến mở xem chi tiết món ăn
      dishChoosed:'',                     //món ăn được chọn
      dishChoosedIndex: 0,                //vị trí của món ăn đc chọn trong mảng
      storeID:'',                         //các thông tin của quán
      storeName: '',
      storePicture: '',
      storeRate:0,
      maxprice:0,
      minprice:0,
      storeOpen: [],
      storeMenu:[], 
      businessTypeName:'',             
      discountList:[],                     //danh sách khuyến mãi của quán
      discountAll:[],                     //danh sách các loại khuyến mãi
      dishDiscountList:[]                 //danh sách khuyến mãi của món ăn
    }
  },
  components:{
    Header,
    Navbar,
    GoogleMap,
    Comments,
    Footer,
    RelativeStore,
    HereMap
  },
  computed:{
    formatRate(){   //format điểm của quán trước khi hiển thị
      return Math.ceil(this.storeRate*100)/100;
    }
  },
  methods:{
    showDishChoosed(dish,index) // hiển thị món ăn được chọn
    {
      this.active = true;
      this.dishChoosed = dish;
      this.dishChoosedIndex = index;
    },
    changeActive(tab){          //thay đổi tab
      this.activeClass = tab;
    },
    getActiveTime(open,close){  //hàm kiểm tra quán có trong thời gian hoạt động hay không 
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
    onScroll(){       //hàm thay đổi class của element có id="micro-main-menu"
      window.onscroll = () => {
        var relative_bot = document.getElementById('relative').offsetTop + document.getElementById('relative').offsetHeight; //vị trí bottom của element relative
        if(document.documentElement.scrollTop > 300 && document.documentElement.scrollTop <  (relative_bot - 100)) { 
          this.scrollMenu= 'sticky'; //nếu document.documentElement.scrollTop trong khoảng [300:(relative_bot - 100)] thì element sẽ có thêm class tên là sticky
        } else {
          this.scrollMenu= '';    //nếu không thì class sẽ trỏ về như mặc định
        }
      };
    },
    //lấy khuyến mãi của quán và của món ăn
    async getDisCount(id,array){ 
      try{
        this.discountList = await DiscountService.getDiscountbyStore(id);
        this.discountAll =  await DiscountService.getAll();
        for (let i = 0; i < array.length ; i++) {
          let discount = await DiscountService.getDishDiscounts(array[i].dish_ID)  //lấy khuyến mãi của từng món
          this.dishDiscountList.push(discount);
        };
      }
      catch(err){
        console.log(err)
      }
    },
    //lấy tên của khuyến mãi bằng id
    getDiscountName(id){
      let temp = ''
      this.discountAll.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    //lấy nội dung của khuyến mãi bằng id
    getDiscountContent(id){
      let temp = ''
      this.discountAll.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.content;
      });
      return temp;
    },
    async onInit(){
      try{
        this.storeOpen = await StoreService.getByID(this.storeID); //Lấy thông tin quán
        this.storeName=this.storeOpen[0].storeName;                 //set thông tin quán
        document.title = this.storeName;
        this.storePicture=this.storeOpen[0].storePicture;
        this.address=this.storeOpen[0].storeAddress;
        this.storeRate = this.storeOpen[0].ratePoint;
        this.isLoaded = true;                                     //đã lấy thông tin xong
        if(this.storeRate == null || this.storeRate == 'NaN' ) this.storeRate = 0;
        this.storeMenu = await StoreService.getDishByStore(this.storeID); //lấy thông tin thực đơn
        //lấy max price của thực đơn 
        this.maxprice = Math.max.apply(Math, this.storeMenu.map(function(dish) { return parseFloat(dish.dishPrice); }))
        //lấy max price của thực đơn 
        this.minprice = Math.min.apply(Math, this.storeMenu.map(function(dish) { return parseFloat(dish.dishPrice); }))
        //lấy tên loại hình quán
        this.businessTypeName = await StoreService.getBussinessTypeById(this.storeOpen[0].businessTypeID);
        //lấy khuyến mãi
        this.getDisCount(this.storeID,this.storeMenu);
      }
      catch{}
    },
    openChat(){ //gọi hàm openChat của component Footer để tạo mới một cuộc trò chuyện
      this.$root.$refs.Footer.openChat(this.storeID,this.storeName,this.storePicture,this.storeOpen[0].userID);
    },
    changeRate(rate){ //thay đổi điểm của quán sau khi có comment mới
      this.storeRate = rate;
    },
    getKeys(){        //lấy apikey từ firebase
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
  },
  created(){
    this.storeID=this.$route.params.id;
  },
  mounted(){
    try{
      this.getKeys();
      this.onInit();
      this.onScroll();
    }
    catch(err){console.log(err)}
  }
}
</script>

<style scoped>
@import url('../../../assets/css/style-1.css');
#map {
  height: 100%;
}
.sticky {
  position: fixed;
  top: 50px;
  width:14.7%;
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
.tb-oi-time{
	display: block;
  font-size: 18px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 5px 0;
  line-height: 1.4em;
	height: 30px;
	cursor: pointer;
	color: #000;
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
  background: #ff6e51;
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
