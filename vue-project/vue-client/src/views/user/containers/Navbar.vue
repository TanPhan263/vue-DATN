<template>
  	<div :class="'navbar-fixed ' + scroll">
		<div class="container-header clearfix">
			<div class="logo fl_left">
				<a href="/Homepage/" title="">
					<img src="../../../assets/imgs/sunny.png" alt="sunnie.vn" width="112">
				</a>
				<select
				id="province"
				style="width:180px; font-weight:bold; font-size: 15px;"
				class="country provinces"
				vertical
				v-model="provinceSelected"
				placeholder="Địa điểm"
				@change="getProvince()"
            >
			<option v-on:click="getProvince" v-for="pro in provinces" v-bind:key="pro.provinceID" :value="pro.provinceID">
				{{pro.provinceName}}
			</option>
            </select>
			</div>
            
			<div class="top-category">
				<ul class="top-category-1">
					<li>
						<a @click="viewMore('Quán gần bạn')">Gần bạn</a>
					</li>
					<li>
						<a @click="viewMore('Đánh giá cao')">Đánh giá cao</a>
					</li>
					<li>
						<a @click="viewMore_bussinessType('-MZByCiXX28Ro2RuKytk')">Trà Sữa</a>
					</li>
					<li>
						<a @click="viewMore_bussinessType('-MZBxSmJyh7nXpJ-hFxd')">Ăn trưa</a>
					</li>
					<li>
						<a @click="viewMore_bussinessType('-MZBxl7ESrfzeBm2gTsE')">Ăn vặt</a>
					</li>
					<li>
						<a @click="viewMore_bussinessType('-MZBxapE_4hRznidydc_')">Coffee</a>
					</li>
				</ul>
			</div>
			<div v-if="isLoggedin" class="fl_right">
			  <CHeaderNav class="mr-4">
				<CHeaderNavItem class="d-md-down-none mx-2">
					<CHeaderNavLink>
					<i @click="search=true" style="font-weight: 300;font-size:20px; padding-right: 10px; float: right;color:black;" class="fa fa-search"/>
					 <div style="color:black;" v-if="user">Xin chào {{ getName() }}</div>	
					</CHeaderNavLink>
				</CHeaderNavItem>
				<TheHeaderDropdownAccnt style="" v-bind:avt="getAvt"/>
			  </CHeaderNav>
			</div>
			<div v-else  id="login" class="fl_right">
				<i  @click="search=true" style="font-size:20px; padding-right: 10px; float:left;color:black; margin-top:8px" class="fa fa-search"/>
				<router-link style="border-radius: 10px;margin-right: 5px;margin-top: 3px;" to="/login" >Đăng nhập</router-link>
				<router-link style="border-radius: 10px;margin-right: 5px; width: 90px; text-align:center;" to="/register">Đăng kí</router-link>
			</div>
		</div>
		<transition v-if="search">
		  <div class="modal-mask">
				<div class="modal-container2" style="width: 618px;overflow: auto;
                height: 550px; padding: 5px;"> 
			    <i @click="search=false" style="font-size:20px; float:right; color:white;" class="fa fa-times"></i>
				<p style="width:100%; color: white; font-size: 17px;">Tìm quán ăn của bạn:</p>
				<img src="" alt="">
			    <input v-model="keyword" style="width: 600px;display: block;
  margin-right: auto;
  margin-left: auto;;padding:5px; font-size: 20px;color: white;background-color: transparent;border: none;border-bottom: 2px solid white;height:40px;box-sizing: border-box;" type="text"  v-on:keyup="onkeychange(keyword)" >
				<div v-show="loading" name="fade" mode="out-in" style="text-align:center;width:600px; background-color: #fff; border-radius:7px;">
                <div class="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>
              	</div>
				<div v-if="results  && !loading">
                	<Suggest v-bind:results="results" @click-store="storeClicked"/>
              	</div>
				</div>
		  </div>
		</transition>
	</div>
</template>

<script>
const baseUrl='https://localhost:44398/api/'
import TheHeaderDropdownAccnt from '@/containers/TheHeaderDropdownAccnt'
import Suggest from './Suggest'
import AuthService from '@/services/AuthService.js';
export default {
name: 'navbars',
components:{
	TheHeaderDropdownAccnt,
	Suggest
},
data(){
    return{
		provinceSelected: '',
		avt:'',
		provinces: '',
		search: false,
		scroll: '',
		keyword:'',
		results: [],
		loading: false
    }
},
props:{
	user: String,
},
computed:{
	isLoggedin: function() {
		if(localStorage.getItem('isAuthen') == null || localStorage.getItem('isAuthen') == 'Đăng nhập thất bại' || !AuthService.isAuthented(localStorage.getItem('isAuthen'))) return false
		return true
	}
  },
  methods:{
	  getName(){
		  try{
		   	return this.user.userName;
		  }
		  catch{
			  alert("Lỗi rồi")
		  }
		   
	  },
	  getProvince(){
		try{
			localStorage.setItem('provinceId',this.provinceSelected)
			this.$router.go();
		}
		catch(e)
		{

		}
	  },
	  getAvt(){
		  this.user = JSON.parse(this.user)
		  if(this.avt=='')
			  return '../assets/imgs/userPic.png';
		  else if(this.user.picture =='') return '../assets/imgs/userPic.png';
		  return this.user.picture
	  },
	  getProvinceSelected(){
		  if(this.provinces!=''){
			this.provinces.forEach(element => {
				if(element.provinceID == localStorage.getItem('provinceId'))
					return element.provinceName
			});
		  }
		  return 'TP Hồ Chí Minh';
		},
		storeClicked(index){
			this.$emit('storeClicked',index);
		},
		dishClicked(index){
			this.$emit('dishClicked',index);
		},
		onkeychange(key){
		this.isDropdown=true;
		this.loading = true;
		this.$http.get('https://localhost:44398/api/Dish/Search?dishname=' + key).then(response => {
			if(response.data !='Không có kết quả tìm kiếm')
			{
				this.results = response.data;
				this.loading = false;
			}});
		},
		viewMore(index){
			this.$root.$refs.Homebody.viewMore_Search(index);
		},
		viewMore_bussinessType(index){
			this.$root.$refs.Homebody.viewMore(index);
		}
  },
  mounted(){
	this.$http.get(baseUrl + 'Province/GetAll').then(response => {
            this.provinces=response.data
    })
	if(localStorage.getItem('provinceId')==null)
	  {
		  this.provinceSelected='-MO5b_1K2_tF_C4GVDo3';
		  localStorage.setItem('provinceId', this.provinceSelected)
	  }
	  if(localStorage.getItem('provinceId')!=''){
		  this.provinceSelected=localStorage.getItem('provinceId')
	  }
  }
}
</script>

<style>
@import url('../../../assets/css/comments.css');
.options{
    width: 100px;
    height: 20px;
}
.provinces{
	height: 32px;
	display:inline-block;
	font-size: 14px;
	line-height: 30px;
	color:#505050; 
	background:#F0F0F0;
	border: none;
}
.search_suggest{
	width: 600px;
	background: #fff;
	height: 60px;
	border: none;
	padding: 0 15px;
	border-radius: 4px;
	float: left;
	font-size: 15px;
	
}
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 10px;
  background: #DC143C;
  border-radius: 3px;
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}
.right-thing{
	width: 35%;
	float: right;
	text-align: right;
	font-size: 13px;
}
</style>