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
  <Navbar/>
  <div v-if="isLoaded" class="pn-microsite">
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
               {{ formatRate }}
              </div>
               <div v-else class="numberCircle" style="float:right; background:red">
              {{ formatRate }}
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
                    <span> <span class="fa fa-location-arrow locationicon fa-3x" style="font-size: 15px"></span> {{storeOpen[0]['storeAddress']}}</span>
                  </a>
                </span>
              </div>
              <div class="res-common-price" style="padding-bottom: 10px;">
                <div class="micro-timesopen" style="padding-top: 5px;padding-bottom: 15px;">
                  <span class="fa fa-clock-o houricon" style="font-size: 15px"></span>
                  <span v-if="getActiveTime(storeOpen[0].openTime,storeOpen[0].cLoseTime)" class="itsopen">Mở cửa </span>
                  <span v-else class="itsclose" >Đóng cửa </span>
                  <span style="font-size:medium" >{{storeOpen[0].openTime}} - {{storeOpen[0].cLoseTime}}</span>
                </div>
                <div class="res-common-minmaxprice"  style="border-top: 1px solid #888;">
                  <span v-if="discountList"><span v-for="(discount,index) in discountList" v-bind:key="index" style="font-size: 15px; color: red; border: 1px solid red; padding: 2px; margin-right: 3px;"> <i class="fa fa-tag"/> {{getDiscountName(discount.idDiscountType)}}</span>  </span>
                </div>
                  <iframe :src="'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fviefood.info%2F'+storeID+'&layout=button&size=large&appId=396920051515132&width=87&height=28'" width="87" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                    <p v-if="storeName != ''" @click="openChat" style="float: right; font-size: 15px; cursor:pointer"> <i class="fas fa-comment-alt"></i> Nhắn tin</p>
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
      <div class="micro-main-content" >
        <div v-if="storeMenu" id="menu" class="microsite-table-book" style="overflow: hidden;
          margin-bottom: 15px;
          border-radius: 15px;
        width: 985px;">
          <div class="tb-title">
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
          <Comments @change-rate="changeRate" v-bind:storeID="storeID" v-bind:storeRate="storeRate"/>
          <div id="map" class="microsite-gallery" style="margin-top: 15px">
            <div style="margin-bottom: 40px">
              <strong style="font-size: 20px">BẢN ĐỒ</strong>
               <a v-if="storeOpen[0].lat" class="direction-button" :href="'http://maps.google.com/maps?z=8&t=m&q=loc:' + storeOpen[0].lat + '+' + storeOpen[0].long" target="_blank" >
                <i class="fas fa-directions"></i> Xem trên GoogleMap
              </a>
            </div>
            <!-- <GoogleMap v-if="storeOpen[0].lat" v-bind:lat="storeOpen[0].lat" v-bind:lng="storeOpen[0].long"/> -->
            <HereMap v-if="storeOpen[0].lat" v-bind:lat="storeOpen[0].lat" v-bind:lng="storeOpen[0].long" v-bind:storeName="storeOpen[0].storeName"/>
            <div id="map"></div>
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
      isLoaded: false,
      // chat: false,
      // address: '',
      //binding class
      activeClass: 'Thông tin quán',
      scrollMenu: '',
      //dishChoosed
      active: false,
      dishChoosed:'',
      dishChoosedIndex: 0,
      storeID:'',
      storeName: '',
      storePicture: '',
      storeRate:0,
      storeOpen: [
        // {
        // storeID: String,
        // storeAddress: String,
        // storeName: String,
        // storePicture: String,
        // openTime: String,
        // cLoseTime: String ,
        // userID: String,
        // provinceID:String ,
        // menuID: String,
        // businessTypeID:String,
        // ratePoint: String,
        // }
      ],
      storeMenu:[],
      // menuId: '',
      // isMapOpen: false,
      // provinces: [],
      businessTypeName:'',
      // ratePoint:[],
      // totalRate:5,
      // commentList:[],
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
    RelativeStore,
    HereMap
  },
  computed:{
    formatRate(){
      return Math.ceil(this.storeRate*100)/100;
    }
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
        var relative_bot = document.getElementById('relative').offsetTop + document.getElementById('relative').offsetHeight;
        if(document.documentElement.scrollTop > 300 && document.documentElement.scrollTop <  (relative_bot - 100)) {
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
        this.storeOpen = await StoreService.getByID(this.storeID);
        this.storeName=this.storeOpen[0].storeName;
        document.title = this.storeName;
        this.storePicture=this.storeOpen[0].storePicture;
        this.address=this.storeOpen[0].storeAddress;
        this.storeRate = this.storeOpen[0].ratePoint;
        this.isLoaded = true;
        if(this.storeRate == null || this.storeRate == 'NaN' ) this.storeRate = 0;
        this.storeMenu = await StoreService.getDishByStore(this.storeID);
        this.businessTypeName = await StoreService.getBussinessTypeById(this.storeOpen[0].businessTypeID);
        this.getDisCount(this.storeID,this.storeMenu);
      }
      catch{}
    },
    openChat(){
      this.$root.$refs.Footer.openChat(this.storeID,this.storeName,this.storePicture,this.storeOpen[0].userID);
    },
    changeRate(rate){
      this.storeRate = rate;
    }
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

<style scoped>
@import url('../../../assets/css/style-1.css');
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
</style>
