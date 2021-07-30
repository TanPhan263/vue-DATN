<template>
  <div class="microsite-gallery" style="margin-top: 15px; overflow:visible">
      <div class="ship">
        <h4>QUÁN CÙNG LOẠI</h4>
        <div class="sub-menu-ship" :style="'width:' + menuWidth +'px;'" >
          <ul v-if="stores.length > 0">
            <li v-for="(store,index2) in stores" v-bind:key="index2">
              <div v-if="store.discount === true" class="top-left">
                <div class="popup" @click="openPopup('myPopup'+ store.storeID,store.storeID)"
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
                <div class="name-food">{{subString(store.storeName) }}...</div>
                <div class="address-store"> <i class="fa fa-map-marker"  style="color: red"></i> {{ subString(store.storeAddress) }}...
                  <div style="color: #585858; float:right;">{{store.khoangcach}} km</div>
                </div>
                  <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                   <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{store.ratePoint}} <span class="fa fa-star" style="color: orange"></span></div>
                  </div>
                <div class="intro"></div>
              </a>
            </li>
            <li @click="viewMore()" v-if="bussinessTypeID && viewmore" style="width:177px; height: 19em; border: 1px solid red; color: red;">
                <p class="middle-last">
                  Xem tất cả các quán cùng loại
                </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
import RouterService from '@/services/RouterService.js';
import StoreService from '@/services/StoreService.js';
import DiscountService from '@/services/DiscountService.js';
export default {
    name:'RelativeStore',
    data(){
        return{
            show:true,                    //biến cờ cho biết quán tải xong hay chưa
            viewmore: false,              //biến cờ cho biết còn quán để xem thêm hay không
            loadingStoreDiscount: false,  //biến load khi tải khuyến mãi của quán
            discount: [],                 //danh sách tất cả khuyến mãi 
            discountList:[],              //danh sách khuyến mãi của quán
            clicked: false,               //biến cờ xác định đã click vào xem khuyến mãi hay chưa
            stores:[],                    //danh sách quán
            type:[],                      //danh sách loại quán
            menuWidth: 193,               //độ rộng menu chứa các quán
        }
    },
    props:{
        bussinessTypeID: String,
        storeID: String
    },
    mounted(){
      this.onInit();
    },
    methods: {
      async onInit(){
        let id = this.storeID;
        this.type = await StoreService.getAllBussinessType();       //lấy danh sách loại quán
        this.discount = await DiscountService.getAll();             //lấy danh sách khuyến mãi
        let storeList = await StoreService.getByBussinessType(this.bussinessTypeID); //lấy danh sách quán theo id loại quán
        var storeListRemoveCurr = storeList.filter(function(store){ //trừ quán đang mở 
          return store.storeID !== id
        })
        if(storeListRemoveCurr.length > 14){                        //nếu nhiều hơn 14 quán thì sẽ có xem thêm
          this.viewmore = true;
          this.stores = storeListRemoveCurr.slice(0,14);
          this.menuWidth = 197 * (this.stores.length + 1);          //tính toán độ rộng của menu chứa các quán
        }
        else {
          this.stores = storeListRemoveCurr;
          this.menuWidth = 200 * (this.stores.length);              //tính toán độ rộng của menu chứa các quán
        }
        
        this.show = false;
      },
      //hàm cắt chuỗi nếu quá dài
      subString(index){
        return index.toString().substring(0,20);
      },
      subString_address(index){
        return index.toString().substring(0,12);
      },
      //lấy tên loại quán ăn theo id
      getType(index){
        try{
          var temp='Unknown'
          this.type.forEach(element => {
            if(element.businessTypeID == index)
              temp = element.businessTypeName;
          });
          return temp;
        }
        catch(err){
          console.log(err);
      }
		},
    //Hàm mở Popup khuyến mãi
		openPopup(name,id) {
        this.loadingStoreDiscount = true;
        var popupnew = document.getElementById(name);
        popupnew.classList.toggle("show");
        this.clicked = true;
        this.getDisCount(id);
    },
      //Hàm đóng Popup khuyến mãi
    closePopup(name) {
      if(this.clicked == true){
        this.discountList = [];
        this.loadingStoreDiscount = false;
        var popupnew = document.getElementById(name);
        popupnew.classList.toggle("show");
        this.clicked = false;
      }
    },

     //Lấy discount của quán 
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
    //hàm lấy tên của discount theo id
    getDiscountName(id){
      let temp = ''
      this.discount.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    //đi đến trang xem thêm quán
    viewMore(){
      RouterService.viewMore(this.bussinessTypeID);
    }
  },
  
}
</script>

<style scoped>
/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 10px;
}
 
::-webkit-scrollbar-track {
    background-color: #ebebeb;
    -webkit-border-radius: 10px;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: #6d6d6d; 
}
.ship{
  width:100%;
  margin:0 auto;
  overflow-x: scroll;
  overflow-y: hidden;
}
.ship .sub-menu-ship{
  padding-top: 4em;
	clear:both;
}
.ship .sub-menu-ship ul{
	padding-left:10px;
	margin:0;
	list-style-type:none;
  position:relative;
}
  .ship .sub-menu-ship ul li{
	position: relative;
	float:left;
	margin:0px 15px 30px 0px;
	background-color:#fff; 
	text-align:left; 
	border-radius: 15px;
	height: 18em;
	cursor: pointer;
	box-shadow: 2px 2px 2px #AAA;
}
  .ship .sub-menu-ship ul li:hover a img{
	opacity: 0.4;
}
  .ship .sub-menu-ship ul li:hover .middle{
	opacity: 1;
}
  .ship .sub-menu-ship ul li a img{
	border-radius:15px 15px 0px 0px; 
	width:177px; 
	height:150px;
}
  .ship .sub-menu-ship ul li a{
	text-decoration:none; 
	display:block; 
	white-space:nowrap;  
	color:#000;
	border-radius: 10px;
	cursor: pointer;
	background-color:#fff;
	box-shadow: 2px 2px 2px #AAA;
}
  .ship .sub-menu-ship ul li .button{
	text-decoration:none; 
	display:block; 
	white-space:nowrap;  
	color:#000;
	border: none;
}
  .ship .sub-menu-ship ul li a div.name-food{
	font-size:15px;
	font-weight: 800;
	display:block;
	padding:3px;
	cursor: pointer;
	margin-bottom: 10px;
}
.ship .sub-menu-ship ul li a div.address-store{
	font-size:13px;
	padding:3px; 
	color:#000;
}
.ship .sub-menu-ship ul li a div.intro{
  font-size:13px;
	padding:3px; 
	display:block;
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
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.middle-last{
  width: 100px;
  transition: .5s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  font-size: medium;
}
</style>