<template>
<div class="main">
    <div class="discover">
		<h2 v-if="lable">{{lable}}</h2>
      <div class="artical" style="width: 100%">
        <div class="menu-artical" >
          <div class="menu-left">
            <div @click="active=true" class="filter" style="padding: 10px;">
				<p style="float: left; font-size: 17px;"><strong>Bộ lọc:</strong> {{sortmode}} , {{optionDG}}, {{optionGT}} </p>
				<i style="font-size: 20px; float:right" class="fa fa-sliders"></i>
			</div>
          </div>
        </div>
		<transition v-if="active">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container" style="padding: 10px; width: 40%">
					<i v-on:click="closeModal" class="fas fa-times" style="float: right; font-size: 20px;"></i>
					<h4 style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 5px;">Bộ lọc kết quả</h4>
					<slot name="body">
						<CCard>
						<CCardHeader>
						<i class="fa fa-map-marker" style="float: right; font-size: 20px; margin-right: 3px;"></i> 
					  	<label class="container-search">Gần tôi
						<input  @click="sortmode='Gần tôi'" type="radio" :checked="checkedGT" name="radio">
						<span class="checkmark"></span>
						</label>
						</CCardHeader>
						<CCardBody>
						<CInputRadioGroup
							:options="optionsGanToi"
							:custom="true"
							:checked.sync="optionGT"
							:inline="true"
						/>
						</CCardBody>
						</CCard>
						<CCard>
						<CCardHeader>
						<i class="fa fa-star" aria-hidden="true" style="float: right;font-size: 20px;"></i>
						<label class="container-search">Đánh giá cao
						<input @click="sortmode='Đánh giá cao'" :checked="checkedDG" type="radio" name="radio">
						<span class="checkmark"></span>
						</label>
						</CCardHeader>
						<CCardBody>
							<CRow>
							<CInputRadioGroup
 							class="col-sm-12"
							:options="optionsDanhGia"
							:custom="true"
							:checked.sync="optionDG"
							:inline="true"
						/>
						</CRow>
						</CCardBody>
						</CCard>
					</slot>
					<div style="width: 100%; color: white; margin: 0 auto;text-align:center">
					<button v-on:click="sort(sortmode)" style="height:40px; border-radius: 5px;width: 50%; background-color: red; color: white; border: none; font-size: 20px" @click="active=false">
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
				<a :href="'/' + store.storeID">
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
		  <ul v-else style="text-align: center;"><img src="../../../assets/imgs/wrong.jpg" style="width:100%;" alt=""></ul>
        </div>
		<div v-show="show"  class="slider">
			<Loading v-bind:storeNumber="18"/>
		</div>
		<!-- <div  v-show="show" style="margin: 0 auto;" class="loader"></div> -->
      </div>
    </div>
		<div v-if="result" class="ship">
			<div class="text-center pb-0 pt-3" style="font-weight: bold;">
				<jw-pagination :items="result" @changePage="onChangePage" :pageSize="pageSize" :labels="customLabels"></jw-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import StoreService from '@/services/StoreService.js';
import DiscountService from '@/services/DiscountService.js';
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
	watch: {
      '$route' (to, from) {
        if (to.path === '/search') {
         this.onInit();
        }
      },
    },
	data(){
		return{
		active: false,									//biến hiển thị hộp thoại lọc quán
		result:[],										//danh sách các quán đã được lọc
		stores:[],										//danh sách các quán ban đầu
		type: [],										//danh sách loại hình quán
		currOptions:{									//biến lưu lại trạng thái lọc quán, sắp sếp 
			opsDG:'',
			opsGT:'',
			sortmode:''
		},
		sortmode: 'Gần tôi',							//chế độ sắp sếp 
		checkedGT: 'checked',							//biến check để biết mode nào đang được sử dụng
		checkedDG: '',
		optionsDanhGia: ['từ 0 sao', 'từ 1 sao', 'từ 2 sao','từ 3 sao', 'từ 4 sao', '5 sao'],//các options lọc quán theo sao
		optionDG:'từ 0 sao', 																//mặc định là 0sao
		optionsGanToi: ['Không giới hạn', '5km', '2km','1km'],								//các options lọc quán khoảng cách
		optionGT: 'Không giới hạn',															//mặc định là không giới hạn
		show:true,										//biến cờ cho biết quán tải xong hay chưa
		pageOfItems: [],								//danh sách quán theo trang
		customLabels,									//custom jw-pagination
		lable: '',
		pageSize: 18,
		loadingStoreDiscount: false,					//biến load khi tải khuyến mãi của quán
		discount: [],									//danh sách tất cả khuyến mãi 
		discountList:[],								//danh sách khuyến mãi của quán
		clicked: false,									//biến cờ xác định đã click vào xem khuyến mãi hay chưa
	  }
	},
	created(){
		this.$root.$refs.SearchPage = this; 			//khai báo để sử dụng ở các component khác 
		this.show = true;
	},
	mounted(){
		this.onInit();
		AnalystService.addVisitView();					//gọi api tăng lượt truy cập
	},
	methods:{
		onChangePage(pageOfItems){						//thay đổi danh sách quán khi thay đổi trang 
			this.pageOfItems = pageOfItems;
		},
		sort(index){									//Hàm sắp xếp lọc quán
			this.currOptions = {						//lưu lại lựa chọn của người dùng
				opsDG:this.optionDG,
				opsGT:this.optionGT,
				sortmode:index
			}
			this.show = true;							//hiện loading
			this.result = this.stores;					
			switch(index){
				case 'Gần tôi':							//sắp xếp quán từ gần đến xa
					this.checkedGT = 'checked';
					this.checkedDG = '';
					setTimeout(() =>{
						this.result.sort(this.sortDistance);
						this.show = false;
					}, 1000);
					break;
				case 'Đánh giá cao': 					//sắp xếp quán theo điểm từ cao xuống thấp
					this.checkedGT = '';
					this.checkedDG = 'checked';
					setTimeout(() =>{
					this.result.sort(this.sortRate);
						this.show = false;
					}, 1000);
					break;
			}
			switch(this.optionGT){
				case 'Không giới hạn':					//lọc quán theo khoảng cách
					this.result = this.result.filter(function(store){ 
						return store.khoangcach  > 0;
					});
					break;
				case '5km': 
					this.result = this.result.filter(function(store){
						return store.khoangcach  <= 5;
					});
					break;
				case '2km': 
					this.result = this.result.filter(function(store){
						return store.khoangcach  <= 2;
					}); break;
				case '1km': 
					this.result = this.result.filter(function(store){
						return store.khoangcach  <= 1;
					}); break;
				default:
					this.result = this.result.filter(function(store){
						return store.khoangcach  > 0;
					});
			}
			switch(this.optionDG){						//lọc quán theo sao	
				case 'từ 0 sao':	
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint)  >= 0;
					});
					break;
				case 'từ 1 sao': 
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint)  >= 1;
					});
					break;
				case 'từ 2 sao': 
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint)  >= 2;
					}); break;
				case 'từ 3 sao': 
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint)  >= 3;
					}); break;
				case 'từ 4 sao': 
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint)  >= 4;
					}); break;
				case 'từ 4 sao': 
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint) == 5;
					}); break;
				default: 
					this.result = this.result.filter(function(store){
						return parseFloat(store.ratePoint)  >= 0;
					});
			}
		},
		async onInit(){									//hàm khởi tạo
			this.show = true;				
			this.sortmode = 'Gần tôi';
			this.checkedGT = 'checked';
			this.optionDG = 'từ 0 sao';
			this.optionGT = 'Không giới hạn';
			this.currOptions = {						//lưu lại lựa chọn mặc định, biến thay đổi khi người dùng nhấn hoàn tất
				opsDG:this.optionDG,
				opsGT:this.optionGT,
				sortmode:this.sortmode
			}
			this.type = await StoreService.getAllBussinessType();	//lấy danh sách loại quán
			this.discount = await DiscountService.getAll();			//lấy danh sách khuyến mãi
			const key = this.$route.query.key
			if(key == 'Quán gần bạn' || key =='Đánh giá cao') 		//nếu key là Quán gần bạn hoặc Đánh giá cao
			{							
				var id= localStorage.getItem('provinceId');			
				if(sessionStorage.getItem('place')){
					let tempplace = JSON.parse(sessionStorage.getItem('place'));
					//gọi api lấy danh sách quán theo tỉnh và lat lng của địa chỉ mới 
					this.stores = await StoreService.getByProvince_distance(id,tempplace.lat,tempplace.lng); 
            	}
				//không thì gọi api với địa chỉ mặc định là HCMUTE
      			else this.stores = await StoreService.getByProvince(id);
				if(key == 'Đánh giá cao') {
					this.sortmode ='Đánh giá cao';
					this.checkedDG=true;
					this.stores.sort(this.sortRate);		//sắp xếp theo sao
				}
				else this.stores.sort(this.sortDistance);	//sắp xếp theo khoảng cách
				this.result = this.stores;
				this.show = false;
				this.lable= key;
			}
			else 											//nếu là từ khóa
			{
				if(sessionStorage.getItem('place')){
					let tempplace = JSON.parse(sessionStorage.getItem('place'));
					console.log(tempplace)
					//gọi api lấy danh sách quán theo từ khóa và lat lng của địa chỉ mới 
					this.stores = await StoreService.searchStore_distance(key,tempplace.lat,tempplace.lng);
				}	//không thì gọi api với từ khóa và địa chỉ mặc định là HCMUTE
				else this.stores = await StoreService.searchStore(key);
				if(this.stores != 'Không có kết quả tìm kiếm')
				{
					this.lable='';
					this.stores.sort(this.sortDistance); //sắp xếp theo khoảng cách
					this.result = this.stores;
					this.show = false;
				}
			}
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
			return temp;}
		catch(err){console.log(err)}
		},
		//các hàm sắp xếp
		sortDistance(a,b){							//theo khoảng cách 
			return parseFloat(a.khoangcach) - parseFloat(b.khoangcach);
		},
		sortRate(a, b){								//theo sao
			return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
		},
		sortProvince(store){						//theo tỉnh
			return store.provinceID == localStorage.getItem('provinceId');
		},
		openPopup(name,id) {						 //Hàm mở Popup khuyến mãi
			this.loadingStoreDiscount = true;
			var popupnew = document.getElementById(name);
			popupnew.classList.toggle("show");
			this.clicked = true;
			this.getDisCount(id);
		},
		closePopup(name) {							 //Hàm đóng Popup khuyến mãi
			if(this.clicked == true){
			this.discountList = [];
			this.loadingStoreDiscount = false;
			var popupnew = document.getElementById(name);
			popupnew.classList.toggle("show");
			this.clicked = false;
			}
		},
		async getDisCount(id){						 //Lấy discount của quán 
			try{
			this.discountList = [];
			this.discountList = await DiscountService.getDiscountbyStore(id);
			this.loadingStoreDiscount = false;
			}
			catch(err){
			console.log(err)
			}
		},
		getDiscountName(id){						//hàm lấy tên của discount theo id
			let temp = ''
			this.discount.forEach(element => {
			if(element.discountTypeID == id)
				temp = element.discountTypeName;
			});
			return temp;
		},
		closeModal(){								//đóng cửa sổ bộ lọc 
			this.active = false;
			this.sortmode = this.currOptions.sortmode;	//trả về cài đặt trước đó 
			this.optionGT = this.currOptions.opsGT;
			this.optionDG = this.currOptions.opsDG;
		}
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
	width: 320px;
	height: 40px;
	background-color:#ffffff;
	border-radius: 5px;
	box-shadow: 1px 2px 2px #AAA;
	margin-bottom: 20px;
}
/* The container */
.container-search {
  width: 600px;
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container-search input {
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
.container-search:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container-search input:checked ~ .checkmark {
  background-color: #ec1c24;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container-search input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container-search .checkmark:after {
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