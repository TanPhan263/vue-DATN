<template>
  	<div :class="'navbar-fixed ' + scroll">
		<div class="container-header clearfix">
			<div class="logo fl_left">
				<a href="/" title="">
					<img :src="logo" alt="viefood.info" width="112">
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
					<li v-for="(nav,index) in navItems" v-bind:key="index">
						<a @click="viewMore(nav.id)">{{nav.lable}}</a>
					</li>
					<!-- <li>
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
					</li> -->
				</ul>
			</div>
			<div v-if="isLoggedin==true" class="fl_right">
			  <CHeaderNav class="mr-4">
				<CHeaderNavItem class="d-md-down-none mx-2">
					<CHeaderNavLink>
					<i @click="search=true" style="font-weight: 300;font-size:20px; padding-right: 10px; float: right;color:black;" class="fa fa-search"/>
					 <div style="color:black;" v-if="user">Xin chào {{ user.userName }}</div>	
					</CHeaderNavLink>
				</CHeaderNavItem>
				<TheHeaderDropdownAccnt style="" v-bind:avt="getAvt"/>
			  </CHeaderNav>
			</div>
			<div v-else id="login" class="fl_right">
				<i  @click="search=true" style="font-size:20px; padding-right: 10px; float:left;color:black; margin-top:8px" class="fa fa-search"/>
				<a href="/login" class="button" style="border-radius: 10px;margin-right: 5px;margin-top: 3px;" >Đăng nhập</a>
				<a  href="/register" class="button" style="border-radius: 10px;margin-right: 5px; width: 90px; text-align:center;">Đăng kí</a>
			</div>
		</div>
		<transition v-if="search">
		  <div class="modal-mask">
				<div class="modal-container2" style="width: 618px;overflow: auto;
                height: 550px; padding: 5px;"> 
			    <i @click="search=false" style="font-size:20px; float:right; color:white;" class="fa fa-times"></i>
				<img src="" alt="">
			    <input v-model="keyword" style="width: 600px;display: block;
					margin-right: auto;
					margin-left: auto;;padding:5px; font-size: 20px;color: white;background-color: transparent;border: none;border-bottom: 2px solid white;height:40px;box-sizing: border-box;" type="text"  v-on:keyup="onkeychange(keyword)" >
				<div v-show="loading && keyword !== ''" name="fade" mode="out-in" style="text-align:center;width:600px; background-color: #fff; border-radius:7px;">
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
import firebase from '@/firebase/init.js';
const baseUrl='https://api.viefood.info/api/'
import TheHeaderDropdownAccnt from '@/containers/TheHeaderDropdownAccnt'
import Suggest from './Suggest'
import AuthService from '@/services/AuthService.js';
import UserService from '@/services/UserService.js';
import RouterService from '@/services/RouterService.js';
export default {
name: 'navbars',
components:{
	TheHeaderDropdownAccnt,
	Suggest
},
data(){
    return{
		user: '',
		provinceSelected: '',
		avt:'',
		provinces: '',
		search: false,
		scroll: '',
		keyword:'',
		results: [],
		loading: false,
		isLoggedin: false,
		logo:'',
		navItems:[],
    }
},
created(){
	this.getUser();
	this.getLogo();
	this.getNavItem();
},	
computed:{
  },
  methods:{
	  getLogo(){
		  try{
      		const socialRef = firebase.database().ref("Footer/logo/");
            socialRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){
              let logo = [];
              Object.keys(data).forEach(key => {
                    logo.push({
                      id: key,
                      picture: data[key].picture,
                    });
                });
                this.logo = logo[0].picture;
            }
            else{
             this.logo='';
            }
          });
		}
		catch(err){}
      },
	  async getUser(){
      try{
        if(localStorage.getItem('isAuthen')){
          	let infor = await UserService.getInfo(localStorage.getItem('isAuthen'));
           	if(infor[0] == "Bạn cần đăng nhập"){
				this.isLoggedin = false;
				AuthService.logout();
				return;
          	}
		 	this.isLoggedin = true;
			this.user = infor[0];
			return;
        }
		this.isLoggedin = false;
      }
      catch(err){console.log(err)}
    },
	getNavItem(){
		try{
      const navRef = firebase.database().ref("Nav");
            navRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){
              let items = [];
              Object.keys(data).forEach(key => {
                    items.push({
                    navId: key,
                    id:  data[key].id,
                    lable: data[key].lable,
                    });
                });
                this.navItems = items;
            }
            else{
             this.navItems =[];
            }
          });
		}
		catch{}
    },
	check(){
		if(this.user == 'null'){
			this.isLoggedin = false;return;}
		this.isLoggedin = true;
	},
	  getName(){
		  try{
		   	return this.user.userName;
		  }
		  catch{
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
		  if(this.user!='null')
			  if(this.user.picture =='') return '../assets/imgs/userPic.png';
		  return this.user.picture;
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
		storeClicked(item){
        	RouterService.storeClicked(item);
			this.$router.go();
    	},
		dishClicked(index){
			RouterService.dishClicked(index);
		},
		onkeychange(key){
			try{
			this.isDropdown=true;
			this.loading = true;
			this.$http.get('https://api.viefood.info/api/Dish/Search?dishname=' + key).then(response => {
				if(response.data !='Không có kết quả tìm kiếm')
				{
					this.results = response.data;
					this.loading = false;
				}});
			}
			catch(err){console.log(err)}
		},
		viewMore(index){
			RouterService.viewMore(index);
			this.$router.go();
		},
		viewMore_bussinessType(index){
			RouterService.viewMore_Search(index);
		},
  },
  mounted(){
	  try{
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
		catch{}
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