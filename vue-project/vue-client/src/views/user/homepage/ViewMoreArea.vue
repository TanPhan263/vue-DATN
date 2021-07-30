<template>
<div class="main">
    <div class="discover">
			<h2 v-if="district"> Tất cả quán ăn ở {{district[0].districtName}}</h2>
      <div class="artical" style="width: 100%">
        <div class="menu-artical" >
          <div class="menu-left">
            <div @click="active=true" class="filter" style="padding: 10px;">
				<p style="float: left; font-size: 17px;"><strong>Sắp xếp:</strong> {{sortmode}} </p>
				<i style="font-size: 20px; float:right" class="fa fa-sliders"></i>
			</div>
          </div>
        </div>
		<transition v-if="active">
			<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container" style="padding: 10px; width: 30%">
						<i v-on:click="active=false" class="fas fa-times" style="float: right; font-size: 20px;"></i>
						<h4 style="text-align: center;border-bottom: 1px solid #eee; padding-bottom: 5px;">Sắp xếp kết quả</h4>
						<slot name="body">
							<i class="fa fa-map-marker" style="float: right; font-size: 20px; margin-right: 3px;"></i> 
							<label class="container">Gần tôi
							<input  @click="sortmode='Gần tôi'" type="radio" :checked="checked1" name="radio">
							<span class="checkmark"></span>
							</label>
							<i class="fa fa-star" aria-hidden="true" style="float: right;font-size: 20px;"></i>
							<label class="container">Đánh giá cao
							<input @click="sortmode='Đánh giá cao'" :checked="checked2" type="radio" name="radio">
							<span class="checkmark"></span>
							</label>
						</slot>
						<div style=" width: 90%; color: white; margin: 0 auto">
							<button v-on:click="sort(sortmode)" style=" height:40px; border-radius: 5px;margin-top: 30px;width: 100%; background-color: red; color: white; border: none; font-size: 20px" @click="active=false">
								Hoàn tất
							</button>
						</div>
					</div>
				</div>
			</div>
		</transition>
        <div v-if="!show" class="slider" style="width:100%">
          <ul v-if="pageOfItems && pageOfItems.length> 0">
			<li v-for="(store, index ) in pageOfItems" v-bind:key="index">
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
				<a @click="storeClicked(store.storeID)">
				<img :src="store.storePicture"/>
				<div class="middle">
					<div class="text" style="background: #ff6666 ">Xem quán</div>
				</div>
				<div class="name-food"> {{ subString(store.storeName)}}...</div>
				<div class="address-store"><i class="fa fa-map-marker"></i>  {{ subString_address(store.storeAddress) }}...
				<div style="color: #585858; float:right;">{{store.khoangcach}} km</div></div>
				
				<div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
				   <div v-if="store.ratePoint === 'NaN'" style="color: #585858; float:right;">{{0}} <span class="fa fa-star" style="color: orange"></span></div>
                  <div v-else style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
				</div>
				<div class="intro"></div>
				</a>
			</li>
          </ul>
		  <ul v-else><img src="../../../assets/imgs/wrong.jpg" alt=""></ul>
        </div>
		<div v-show="show"  class="slider">
			<Loading v-bind:storeNumber="18"/>
		</div>
      </div>
      <div class="ship">
		  <div class="text-center pb-0 pt-3" style="font-weight: bold;">
				<jw-pagination :items="stores" @changePage="onChangePage" v-bind:pageSize="pageSize" :labels="customLabels"></jw-pagination>
		</div>
      </div>
    </div>
	</div>
</template>

<script>
import StoreService from '@/services/StoreService.js';
import RouterService from '@/services/RouterService.js';
import DiscountService from '@/services/DiscountService.js';
import ProvinceService from '@/services/ProvinceService.js';
import AnalystService from '@/services/AnalystService.js';
import Loading from './Loading.vue';
const customLabels = {
    first: '<<',
    last: '>>',
    previous: '<',
    next: '>'
};
export default {
	components:{
		Loading
	},
	data(){
		return{
            active: false,						//biến hiển thị hộp thoại lọc quán
			district: '',						//quận/huyện đang xem 
            stores:[],							//danh sách các quán
            type: [],
            sortmode: 'Gần tôi',				//chế độ sắp sếp 
            checked1: 'checked',				//biến check để biết mode nào đang được sử dụng
            checked2: '',	
            show:true,							//biến cờ cho biết quán tải xong hay chưa
            pageOfItems: [],					//danh sách quán theo trang
           	customLabels,						//custom jw-pagination
            pageSize: 18,	
			loadingStoreDiscount: false,		//biến load khi tải khuyến mãi của quán
			discount: [],						//danh sách tất cả khuyến mãi 
			discountList:[],					//danh sách khuyến mãi của quán
			clicked: false,						//biến cờ xác định đã click vào xem khuyến mãi hay chưa
		}
	},
	created(){
		this.show = true;						//show loading						
	},
	mounted(){
		this.onInit();
		AnalystService.addVisitView();			//gọi api tăng lượt truy cập
	},
	methods:{
		onChangePage(pageOfItems){				//thay đổi danh sách quán khi thay đổi trang 
			this.pageOfItems = pageOfItems;
		},
		sort(index){							//Hàm sắp xếp lọc quán
            try{
			this.show = true;
			switch(index){
				case 'Gần tôi':					//sắp xếp quán từ gần đến xa
					this.checked1 = 'checked';
					this.checked2 = '';
					setTimeout(() =>{
						this.stores.sort(this.sortDistance);
						this.show = false;
					}, 1000);
					break;
				case 'Đánh giá cao': 			//sắp xếp quán theo điểm từ cao xuống thấp
					this.checked1 = '';
					this.checked2 = 'checked';
					setTimeout(() =>{
					this.stores.sort(this.sortRate);
						this.show = false;
					}, 1000);
					break;
			    }
            }
            catch(err){console.log(err)}
		},
		async onInit(){							//hàm khởi tạo
			const id = this.$route.params.id;
			this.district = await ProvinceService.getDistrict(id);		//lấy thông tin quận hiện tại
			document.title = this.district[0].districtName;				//set title cho trang
			this.type = await StoreService.getAllBussinessType();		//lấy danh sách loại quán
			this.discount = await DiscountService.getAll();				//lấy danh sách khuyến mãi
			if(sessionStorage.getItem('place')){
              let tempplace = JSON.parse(sessionStorage.getItem('place'));
			  //gọi api lấy danh sách quán theo quận và lat lng của địa chỉ mới 
              this.stores = await StoreService.getByDistrict_distance(id,tempplace.geometry.location.lat,tempplace.geometry.location.lng);
            }
			//không thì gọi api với địa chỉ mặc định là HCMUTE
            else this.stores = await StoreService.getByDistrict(id);
            console.log(this.stores)
			this.show = false;
		},	
		storeClicked (item) {					//đi đến trang chi tiết quán
			RouterService.storeClicked(item);
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
        catch(err){console.log(err)}
		},
		//các hàm sắp xếp
		sortDistance(a,b){
			return parseFloat(a.khoangcach) - parseFloat(b.khoangcach);
		},
		sortRate(a, b){
			return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
		},
		sortProvince(store){
			return store.provinceID == localStorage.getItem('provinceId');
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
	}
}
</script>

<style>
/* @import url('../../../assets/css/style.css'); */
.pagination{
	margin: 0 auto;
}
.filter{
	padding: 15px;
	width: 250px;
	height: 40px;
	background-color:#ffffff;
	border-radius: 5px;
	box-shadow: 1px 2px 2px #AAA;
	margin-bottom: 20px;
}
/* The container */
.container {
  width: 600px;
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding-bottom: 12px;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #ec1c24;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
 	top: 9px;
	left: 9px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: white;
}
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #ec1c24;
  width: 120px;
  height: 120px;
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