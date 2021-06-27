<template>
    <div class="discover">
		<h2 v-if="lable && !show">{{lable[0].businessTypeName}}</h2>
      <div class="artical" style="width: 100%">
        <div  v-if="!show" class="slider" style="width:100%">
          <ul v-if="pageOfItems && pageOfItems.length> 0">
			<li v-for="(store, index ) in pageOfItems" v-bind:key="index">
				<a v-on:click="storeClicked(store.storeID)">
				<img v-lazy="store.storePicture"/>
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
		  <ul v-else style="text-align: center;"><img src="../../../assets/imgs/wrong.jpg" style="width:60%; margin-bottom: 50px" alt=""></ul>
        </div>
			<div  v-if="!show" class="text-center pb-0 pt-3" style="font-weight: bold;">
				<jw-pagination :items="stores" @changePage="onChangePage" v-bind:pageSize="pageSize" :styles="customStyles" :labels="customLabels"></jw-pagination>
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
import RouterService from '@/services/RouterService.js';
import StoreService from '@/services/StoreService.js';
import BussinessTypeService from '@/services/BussinessTypeService.js';
const customLabels = {
    first: '<<',
    last: '>>',
    previous: '<',
    next: '>'
};
const customStyles = {
    li: {
        display: 'inline-block',
    },
    a: {
        color: 'black'
    }
};
export default {
	watch: {
      '$route' (to, from) {
        if (to.path === '/viewmore') {
         this.onInit();
        }
      }
    },
	data(){
		return{
		stores:[],
		type: [],
		pageOfItems: [],
		customLabels,
		customStyles,
		show:true,
		pageSize: 18,
		lable: ''
		}
	},
	mounted(){
		this.onInit();
	},
	props:{
		categoryID: String,
	},
	methods:{
		onChangePage(pageOfItems){
			this.pageOfItems = pageOfItems;
		},
		async onInit(){
			this.show = true;
			this.type = await StoreService.getAllBussinessType();
			const key = this.$route.query.key;
			this.stores = await StoreService.getByBussinessType(key);
			this.lable = await BussinessTypeService.getByID(key);
			if(this.stores) this.show= false;
		},
		storeClicked(item) {
			RouterService.storeClicked(item);
		},
		subString(index){
			return index.toString().substring(0,20);
		},
		subString_address(index){
			return index.toString().substring(0,12);
		},
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
	}
}
</script>

<style>
@import url('../../../assets/css/style.css');
.pagination{
	margin: 0 auto;
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