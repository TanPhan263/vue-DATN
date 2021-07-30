<template>
<div class="main" :style="'margin-bottom:' + margin +'px;'">
   <vueper-slides 
      style="width: 90%;margin: 0 auto; margin-top:20px;background-color:#f6f6f6; z-index: 1;"
      fixed-height="230px"
      class="no-shadow"
      :visible-slides="3"
      slide-multiple
      :gap="3"
      :bullets="true"
      :slide-ratio="1 / 3"
      :dragging-distance="200"
      :infinite="false"
      :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
       <template v-slot:arrow-left>
      <i class="fas fa-arrow-circle-left arrow"></i>
      </template>
      <template v-slot:arrow-right>
      <i class="fas fa-arrow-circle-right arrow"></i>
      </template>
      <vueper-slide style="border-radius:7px;" v-for="(slide, i) in discount" :key="i" :image="slide.discountTypePicture"  @click.native="getDiscountStore(slide.discountTypeID,slide.discountTypeName,slide.discountTypePicture)"  />
    </vueper-slides>
    <transition v-if="active">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
				<div class="modal-header">
					<slot name="header">
					<strong style="font-size: 20px">{{discountName}}</strong>
           <i @click="active=false" class="fas fa-times" style="padding: 3px;float: right; font-size: 20px;"></i>
					</slot>
				</div>
				<div class="modal-body" style="overflow-x: hidden">
        <img v-lazy="discountImg" alt="" style="width: 100%;margin-bottom: 20px">
        <h4>Các cửa hàng gần đây</h4>
					<slot name="body" v-if="!loadingDiscount">
              <div v-on:click="storeClicked(result.storeID)" href="" class="search_suggest" v-for="result in discountStore" v-bind:key="result.storeID" style="
                text-align: left; display: flex; border-bottom: 1px solid #e6e6e6;cursor: pointer;padding: 10px 45px 10px 0px;height: 120px;	border-radius:0px;" >
                  <div class="left-thing" style="width:20%">
                    <img v-lazy="result.storePicture" style="border-radius:5px;width:100%">
                  </div>
                  <div class="middle-thing" style="margin-left: 3px; height: 100%;">
                    <p style="margin-top: 0px; height: 15%; font-size: 16px; font-weight: bold;">{{result.storeName}}</p>
                    <p style="font-size: 14px;margin-top: 0px;">{{result.storeAddress}}</p>
                  </div>
                 <div v-if="getActiveTime(result.openTime,result.cLoseTime)" class="right-thing">
                    <p style="font-size: 13px;margin-top: 0px; height: 15%; color:green;">Đang hoạt động <span class="dot"></span></p>
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
   <div class="ship">
	  <div  class="menu-ship">
        <div class="hero">
          <h4>MÓN NGON MỖI NGÀY</h4>
        </div>
    </div>
    <div class="sub-menu-ship">
        <ul>
          <li v-for="(dish, index) in dishes" v-bind:key="index" style="height:90px;width:100px;"  @click="dishClicked(dish.dishName)">
          <a :href="'/search?key='+ dish.dishName" style="border:none;height:90px">
            <img v-lazy="dish.dishPicture" style="border-radius:10px 10px 10px 10px; width:102px; height:90px;cursor: pointer;"/>
          </a>
          <div @click="dishClicked(dish.dishName)" style="margin: 0 auto;text-align:center; width: 80px; padding-bottom: 20px;"> 
              <p style="margin-top: 3px; font-size:17px; font-weight:bold; word-break:keep-all; background: transparent;">{{dish.dishName}}</p></div>
          </li>
        </ul>
        <LoadingDish v-show="dishes.length==0"/>
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
                <div class="popup" @click="openPopup('danhgiacao'+ store.storeID,store.storeID)"
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
            <a class="image" v-on:click="storeClicked(store.storeID)" >
             <img v-lazy="store.storePicture"/>
              <div class="middle">
              <div class="text" style="background: #ff6666 ">Xem quán</div>
              </div>
              <div class="name-food">{{ subStringName(store.storeName)}}</div>
              <div class="address-store"><i class="fa fa-map-marker" style="color: red"></i>{{ subString(store.storeAddress) }}
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
        <Loading v-bind:storeNumber="12" v-show="show"/>
      </div>
      <div>
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%">
                <p @click="viewMoreGantoiDanhgiacao('Đánh giá cao')">XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
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
            <a v-on:click="storeClicked(store.storeID)">
              <img v-lazy="store.storePicture" />
              <div class="middle">
              <div class="text" style="background: #ff6666 ">Xem quán</div>
              </div>
              <div class="name-food"> {{ subStringName(store.storeName)}}</div>
              <div class="address-store"><i class="fa fa-map-marker"  style="color: red"></i>  {{ subString(store.storeAddress) }}
              <div style="color: black; float:right;">{{store.khoangcach}} km</div></div>
                <div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
                 <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
                </div>
              <div class="intro"></div>
            </a>
          </li>
        </ul>
        <Loading v-bind:storeNumber="12" v-show="show"/>
      </div>
      <div>
          <div class="ship">
            <div class="menu-ship">
              <div class="hero" style="width:100%">
                <p  @click="viewMoreGantoiDanhgiacao('Quán gần bạn')" >XEM THÊM <i class="fa fa-chevron-right" style="font-size: 16px;"></i></p>
              </div>
            </div>
          </div>  
      </div>
    </div>
    <Area v-bind:type="type" v-bind:discount="discount" v-bind:discountList="discountList" v-bind:loadingStoreDiscount="loadingStoreDiscount"/>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="disabled"  infinite-scroll-distance="100" style="margin-top: 20px;" >
      <div v-for="(list, index) in loadMoreList" v-bind:key="index" class="ship">
        <div class="menu-ship">
          <div v-if="loadMoreList[index]" class="hero" style="width:30%">
            <h3 v-if="list && list.length> 0" style="text-align:left"> {{ getType(list[0].businessTypeID) }}</h3>
          </div>
        </div>
        <div class="sub-menu-ship">
          <ul v-if="list">
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
              <a v-on:click="storeClicked(store.storeID)">
                <img v-lazy="store.storePicture"/>
              <div class="middle">
              <div class="text" style="background: #ff6666 ">Xem quán</div>
              </div>
                <div class="name-food">{{ subStringName(store.storeName) }}</div>
                <div class="address-store"> <i class="fa fa-map-marker"  style="color: red"></i> {{ subString(store.storeAddress) }}
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
import Loading from './Loading.vue';
import LoadingDish from './LoadingDish.vue';
const baseUrl='https://api.viefood.info/api/'
import DiscountService from '@/services/DiscountService.js'
import AnalystService from '@/services/AnalystService.js'

export default {
    name: 'Homebody',
    components:{
        VueperSlides, VueperSlide,Area,Loading,LoadingDish
    },
    data() {
        return {
          margin: 150,
          loading: false,               //biến load khi tải trang 
          loadingDiscount: false,       //biến load khi tải khuyến mãi ở slide
          loadingStoreDiscount: false,  //biến load khi tải khuyến mãi của quán
          index: 0,                     //biến index khi tải danh sách quán theo danh mục
          stores: [],                   //danh sách quán ăn
          provinceID: '',               
          nearest: [],                  //danh sách quán ăn gần tôi
          rates: [],                    //danh sách quán ăn đánh giá cao
          type: [],                     //danh sách loại quán
          loadMoreList: [],             //danh sách quán theo danh mục
          dishes: [],                   //danh sách món ăn
          discount:[],                  //danh sách khuyến mãi
          active:false,                 //biến mở modal khuyến mãi
          clicked: false,               //biến cờ xác định đã click vào xem khuyến mãi hay chưa
          show: true,                   //biến cờ cho biết đã tải các quán xong chưa
          discountStore: [],            //danh sách quán theo khuyến mãi
          discountList:[],              //danh sách khuyến mãi của mỗi quán
          discountName:'',              //tên Khuyến mãi đang chọn
          discountImg:'',               //ảnh khuyến mãi đang chọn
        }
      },
      created(){
        this.$root.$refs.Homebody = this;   
        this.onInit();
        this.$http.get(baseUrl + 'Dish/GetAll').then(response => { //lấy danh sách món ăn
            this.dishes = response.data;
            this.dishes = this.dishes.filter(function(dish){
              return dish.dishName.length < 20;               
            })
            let x = Math.floor(Math.random()*(this.dishes.length-10)) //chọn món random
            this.dishes = this.dishes.slice(x,x+10);
        })
      },
      mounted(){
        AnalystService.addVisitView();//gọi api tăng lượt truy cập
      },
      methods:{
        async onInit(){
          try{
            this.discount = await DiscountService.getByAdmin();              //lấy danh sách khuyến mãi
            this.type = await StoreService.getAllBussinessType();       //lấy danh sách loại quán
            var id = localStorage.getItem('provinceId');
            this.provinceID = id;
            if(sessionStorage.getItem('place')){                         //nếu có địa điểm mới đc thay đổi
              let tempplace = JSON.parse(sessionStorage.getItem('place'));
              //gọi api lấy danh sách quán theo quận và lat lng của địa chỉ mới 
              this.stores = await StoreService.getByProvince_distance(id,tempplace.lat,tempplace.lng);
            }
            else{
              //không thì gọi api với địa chỉ mặc định là HCMUTE
              this.stores = await StoreService.getByProvince(id)
            }
            this.rates = this.stores.filter(function compare(store) { //lọc quán trên 4sao
                return parseFloat(store.ratePoint) >= 4;
            });
            this.rates.sort(function compare( a, b ) {                //sắp xếp từ điểm cao đến thấp
                return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
            });
            this.nearest = this.stores.slice(0,12);                    
            this.rates = this.rates.slice(0,12);                        
            this.show = false;
          }catch(err){console.log(err)}
        },
        storeClicked(item) {                          //đi đến trang chi tiết quán
          RouterService.storeClicked(item);
        },
        dishClicked (item) {                          //tìm quán theo món
          localStorage.setItem("keyword", item);
          RouterService.dishClicked(item);
        },
        dishViewMore(){                              //đến trang xem thêm món
           RouterService.dishViewMore();
        },
        viewMoreGantoiDanhgiacao(index){             //đến trang xem thêm quán gần tôi/đánh giá cao
          RouterService.viewMoreGantoiDanhgiacao(index)
        },
        changeProvince(index){                       //load quán khi thay đổi tỉnh
          this.$http.get(baseUrl+ 'GetByIDProvince?id=' + index).then(response => {
            this.stores= response.data
          });
        },
        async changePlace(lat,long){                  //load quán khi thay đổi địa điểm
          try{
            this.loadMoreList =[];
            this.index=0;
            var id = localStorage.getItem('provinceId');
            //gọi api lấy danh sách quán theo quận và lat lng của địa chỉ mới 
            this.stores = await StoreService.getByProvince_distance(id, lat,long);
            this.rates = this.stores.filter(function compare(store) { //lọc quán trên 4sao
                return parseFloat(store.ratePoint) > 4;
            });
            this.rates.sort(function compare( a, b ) {                 //sắp xếp từ điểm cao đến thấp
                return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
            });
            this.nearest = this.stores.slice(0,12);
            this.rates = this.rates.slice(0,12);
          }
          catch(err){
            console.log(err);
          }
        },
        getType(index){                                 //lấy tên loại quán ăn theo id
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
        //cắt chuỗi
        subString(index){
          if(index.length>17)
            return index.toString().substring(0,17)+'...';
          return index;
        },
        subStringName(index){
          if(index.length>20)
            return index.toString().substring(0,20)+'...';
          return index;
        },
      loadMore(){                                   //tải thêm danh sách quán theo danh mục
        try{
          this.loading = false;
          setTimeout(() =>{
            if(this.index < this.type.length){      //khi chưa duyệt hết danh sách loại quán
                let id = this.type[this.index].businessTypeID;
                var store = this.stores.filter(function(store) {//lọc quán theo id danh mục
                    return store.businessTypeID === id });
                if(store.length >= 12){             //chỉ lấy danh mục có số quán >= 12
                    store = store.slice(0,12);
                  this.loadMoreList.push(store);
                }
                this.index = this.index + 1;        //tăng biến đếm lên 1 cho lần duyêt sau
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
      viewMore(id){                                 //đến trang xem thêm quán theo danh mục
        this.$router.push('/viewmore?key=' + id).catch(()=>{});
      },
      async getDiscountStore(id,name,img){          //lấy danh sách quán theo khuyến mãi
        this.loadingDiscount = true;
        this.discountName = name;                    //lấy thông tin khuyến mãi đang chọn để hiển thị
        this.discountImg = img;
        this.active=true;
        this.discountStore = await DiscountService.getStore(id) //gọi api lấy danh sách quán 
        this.discountStore = this.discountStore.filter(function(item){ //lọc quán trong bán kính <= 5km
          return parseFloat(item.khoangcach) <= 5;
        })
        this.discountStore.sort(function(a,b){                        //sắp xếp quán từ gần đến xa
          return parseFloat(a.khoangcach) - parseFloat(b.khoangcach);
        })
        this.loadingDiscount = false;
      },
      getActiveTime(open,close){                        //hàm kiểm tra quán có trong thời gian hoạt động hay không 
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
      openPopup(name,id) {                              //Hàm mở Popup khuyến mãi
        this.loadingStoreDiscount = true;
        var popupnew = document.getElementById(name);
        popupnew.classList.toggle("show");
        this.clicked = true;
        this.getDisCount(id);
      },
      closePopup(name) {                                  //Hàm đóng Popup khuyến mãi
        if(this.clicked == true){
          this.discountList = [];
          this.loadingStoreDiscount = false;
          var popupnew = document.getElementById(name);
          popupnew.classList.toggle("show");
          this.clicked = false;
        }
      },
      async getDisCount(id){                              //Lấy discount của quán 
        try{
          this.discountList = [];
          this.discountList = await DiscountService.getDiscountbyStore(id);
          this.loadingStoreDiscount = false;
        }
        catch(err){
          console.log(err)
        }
      },
      getDiscountName(id){                                 //hàm lấy tên của discount theo id
        let temp = ''
        this.discount.forEach(element => {
          if(element.discountTypeID == id)
            temp = element.discountTypeName;
        });
        return temp;
      },
    },
}
</script>

<style>
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
.arrow{
  font-size: 40px;
}
</style>