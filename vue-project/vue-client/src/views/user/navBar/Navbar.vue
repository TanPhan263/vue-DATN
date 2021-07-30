<template>
  	<div class="navbar-fixed">
		<div class="container-header clearfix">
			<div class="logo fl_left">
				<a href="/" title="">
					<img :src="logo" alt="viefood.info" width="112">
				</a>
				<select
				id="province"
				class="country provinces"
				vertical
				v-model="provinceSelected"
				placeholder="Địa điểm"
				@change="getProvince()">
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
					 <div style="color:black;" v-if="user">Xin chào {{ user.userName }}</div>	
					</CHeaderNavLink>
				</CHeaderNavItem>
				<TheHeaderDropdownAccnt v-bind:avt="getAvt"/>
			  </CHeaderNav>
			</div>
			<div v-else id="login" class="fl_right">
				<a href="/login" class="button" style="border-radius: 10px;margin-right: 5px;margin-top: 3px;" >Đăng nhập</a>
				<a  href="/register" class="button" style="border-radius: 10px;margin-right: 5px; width: 90px; text-align:center;">Đăng kí</a>
			</div>
		</div>
	</div>
</template>

<script>
import firebase from '@/firebase/init.js';
const baseUrl='https://api.viefood.info/api/'
import TheHeaderDropdownAccnt from '@/containers/TheHeaderDropdownAccnt'
import Suggest from '../homepage/Suggest'
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
		user: '', 				//thông tin user
		provinceSelected: '',	//tỉnh được chọn
		avt:'',					//hình của user
		provinces: '',			//danh sách 
		isLoggedin: false, 		//biến kiểm tra đăng nhập hay chưa
		logo:'', 
		navItems:[], 			//các items trên thanh menu
      }
	},
	created(){
		this.getUser();//lấy thông tin user 
		this.getLogo();//load Logo từ firebase
		this.getNavItem();//load các items trên thanh menu
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
				localStorage.removeItem("userInfor");
				localStorage.removeItem("isAuthen");
				return;
			}
			this.isLoggedin = true;
			this.user = infor[0];
			return;
        }
		this.isLoggedin = false;
      }
      catch{
		localStorage.removeItem("userInfor");
		localStorage.removeItem("isAuthen");
		this.isLoggedin = false;
	  }
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
	check(){ //kiểm tra 
		if(this.user == 'null'){
			this.isLoggedin = false;return;}
		this.isLoggedin = true;
	},
	getName(){ //lấy tên user
		try{
			return this.user.userName;
		}
		catch{
		}
	},
	getProvince(){ 			//hàm thay đổi tỉnh va load lại trang 
		try{
			localStorage.setItem('provinceId',this.provinceSelected);
			this.$router.go();
		}
		catch(e)
		{}
	},
	getAvt(){ //lấy avt của user
		if(this.user!='null')
			if(this.user.picture =='') return '../assets/imgs/userPic.png';
		return this.user.picture;
	},
	// getProvinceSelected(){		
	// 	if(this.provinces!=''){ 
	// 	this.provinces.forEach(element => {
	// 		if(element.provinceID == localStorage.getItem('provinceId'))
	// 			return element.provinceName
	// 	});
	// 	}
	// 	return 'TP Hồ Chí Minh';
	// },
	viewMore(index){ 					//đi đến trang xem thêm các quán có businessTypeID là index
		RouterService.viewMore(index);
	},
  },
  mounted(){
	try{																//lấy danh sách tỉnh có quán
		this.$http.get(baseUrl + 'Province/GetAllProvinceHaveStore').then(response => {
			this.provinces=response.data				
		})
		if(!localStorage.getItem('provinceId')) 						//nếu localStorage không có Id tỉnh thì mặc định là Id của HCM
		{
			this.provinceSelected='-MO5b_1K2_tF_C4GVDo3';
			localStorage.setItem('provinceId', this.provinceSelected)	//tạo mới item provinceId trong localStorage
		}
		else{ 															//nếu có thì gán vào tỉnh được chọn
			this.provinceSelected=localStorage.getItem('provinceId')
		}
	}
	catch{}
  }
}
</script>

<style>
@import url('../../../assets/css/style-0.css');
@import url('../../../assets/css/reset.css');
/* @import url('../../../assets/css/comments.css'); */
.options{
    width: 100px;
    height: 20px;
}
.provinces{
	height: 32px;
	width: 127px;
	display:inline-block;
	font-size: 16px !important;
	font-weight: bold;
	line-height: 30px;
	color:	#303030; 
	background:#F0F0F0;
	border: none;
	font-family: 'Dosis', sans-serif !important;
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