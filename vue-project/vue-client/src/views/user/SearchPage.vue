<template>
    <div class="discover">
		<h2 v-if="lable">{{lable}}</h2>
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
				<div class="modal-container" style="padding: 10px;">
					<i v-on:click="active=false" class="fa fa-window-close" style="float: right; font-size: 20px;"></i>
					<h4 style="text-align: center;">Sắp xếp kết quả</h4>
					<i class="fa fa-map-marker" style="float: right; font-size: 20px; margin-right: 3px;"></i> 
					<slot name="body">
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
				<a v-on:click="storeClicked(store.storeID)">
				<img :src="store.storePicture"/>
				<div class="name-food"> {{ subString(store.storeName)}}...</div>
				<div class="address-store"><i class="fa fa-map-marker"></i>  {{ subString_address(store.storeAddress) }}...
				<div style="color: #585858; float:right;">{{store.khoangcach}} km</div></div>
				
				<div class="address-store"> <span class="fas fa-utensils"></span>  {{ getType(store.businessTypeID) }}
				 <div style="color: #585858; float:right;">{{Math.ceil(store.ratePoint*100)/100}} <span class="fa fa-star" style="color: orange"></span></div>
				</div>
				<div class="intro"></div>
				</a>
			</li>
          </ul>
		  <ul v-else style="text-align: center;"><img src="../../assets/imgs/wrong.jpg" style="width:60%; margin-bottom: 50px" alt=""></ul>
        </div>
	
			<div class="text-center pb-0 pt-3" style="font-weight: bold;">
				<jw-pagination :items="stores" @changePage="onChangePage" :pageSize="pageSize" :labels="customLabels"></jw-pagination>
			</div>
		
		 <div  v-show="show" style="margin: 0 auto;" class="loader"></div>
      </div>
	  
	  <div style="margin-bottom: 300px;">
      <div class="ship">
        <div class="menu-ship">
          <div class="hero" style="width:100%; height: 300px">
          </div>
        </div>
      </div>  
    </div>
    </div>
</template>

<script>
import StoreService from '@/services/StoreService.js';
const customLabels = {
    first: '<<',
    last: '>>',
    previous: '<',
    next: '>'
};
export default {
	watch: {
      '$route' (to, from) {
        if (to.path === '/search') {
         this.onInit();
        }
      }
    },
	data(){
		return{
		active: false,
		stores:[],
		type: [],
		sortmode: 'Gần tôi',
		checked1: 'checked',
		checked2: '',
		show:true,
		pageOfItems: [],
		customLabels,
		lable: '',
		pageSize: 18
		}
	},
	created(){
		this.show = true;
	},
	mounted(){
		this.onInit();
	},
	methods:{
		onChangePage(pageOfItems){
			this.pageOfItems = pageOfItems;
		},
		sort(index){
			this.show = true;
			console.log(this.stores)
			switch(index){
				case 'Gần tôi':
					this.checked1 = 'checked';
					this.checked2 = '';
					setTimeout(() =>{
						this.stores.sort(this.sortDistance);
						this.show = false;
					}, 1000);
					console.log(this.stores)
					break;
				case 'Đánh giá cao': 
					this.checked1 = '';
					this.checked2 = 'checked';
					setTimeout(() =>{
					this.stores.sort(this.sortRate);
						this.show = false;
					}, 1000);
					console.log(this.stores)
					break;
			}
		},
		async onInit(){
			this.show = true;
			this.type = await StoreService.getAllBussinessType();
			const key = this.$route.query.key
			if(key == 'Quán gần bạn' || key =='Đánh giá cao') 
			{
				if(key == 'Đánh giá cao') {this.sortmode ='Đánh giá cao'; this.checked2=true;}
				var id= localStorage.getItem('provinceId');
      			this.stores = await StoreService.getByProvince(id);
				this.show = false;
				this.lable= key;
			}
			else 
			{
				this.$http.get('http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/Dish/Search?dishname=' + key).then(response => {
				if(response.data !='Không có kết quả tìm kiếm')
				{
					this.lable='';
					this.stores = response.data;
					this.stores = this.stores.filter(this.sortProvince);
					this.show = false;
				}});
			}
		},
		storeClicked (item) {
			this.$router.push('/storeDetail/' + item)
		},
		subString(index){
		return index.toString().substring(0,20);
		},
		subString_address(index){
		return index.toString().substring(0,12);
		},
		getType(index){
		var temp='Unknown'
		this.type.forEach(element => {
				if(element.businessTypeID == index)
				temp = element.businessTypeName;
		});
		return temp;
		},
		sortDistance(a,b){
			return parseFloat(a.khoangcach) - parseFloat(b.khoangcach);
		},
		sortRate(a, b){
			return parseFloat(b.ratePoint) - parseFloat(a.ratePoint);
		},
		sortProvince(store){
			return store.provinceID == localStorage.getItem('provinceId');
		}
	}
}
</script>

<style>
@import url('../../assets/css/style.css');
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
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 17px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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