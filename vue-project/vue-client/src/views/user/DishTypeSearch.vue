<template>
<div class="main">
	<div class="ship" style="width:88%;height: 55em">
	  <div  class="menu-ship">
        <div class="hero">
          <h4>MÓN NGON MỖI NGÀY</h4>
        </div>
    </div>
    <div class="sub-menu-ship">
        <ul>
          <li v-for="(dish, index) in  pageOfItems" v-bind:key="index" style="height:90px;width:100px;margin:40px 15px 40px 0px;"  @click="dishClicked(dish.dishName)">
             <a>
              <img v-lazy="dish.dishPicture" style="border-radius:10px 10px 10px 10px; width:102px; height:90px;cursor: pointer;"/>
          </a>
          <div @click="dishClicked(dish.dishName)" style="margin: 0 auto;text-align:center; background-color:#f6f6f6; width: 80px; padding-bottom: 20px;"> 
                <p style="margin-top: 3px;font-family: Helvetica; font-size:14px; font-weight:bold; word-break:keep-all;">{{dish.dishName}}</p></div>
          </li>
        </ul>
    </div>
</div>
<div class="text-center pb-0 pt-3" style="margin-top:100px;font-weight: bold;">
		<jw-pagination :items="dishes" @changePage="onChangePage" :pageSize="pageSize" :styles="customStyles" :labels="customLabels"></jw-pagination>
	</div>
</div>
</template>

<script>
import RouterService from '@/services/RouterService.js'
const baseUrl='https://api.viefood.info/api/'
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
    },
};
export default {
	name:'DishType',
	data(){
		return{
            dishes:[],
            pageOfItems: [],
            customLabels,
            customStyles,
            pageSize: 40
		}
	},
	mounted(){
        this.$http.get(baseUrl + 'Dish/GetAll').then(response => {
                this.dishes = response.data;
        })
	},
	methods:{
		onChangePage(pageOfItems){
			this.pageOfItems = pageOfItems;
		},
		dishClicked(name){
			RouterService.dishClicked(name);
		}
	}
}
</script>

<style scope>
@import url('../../assets/css/style.css');
</style>