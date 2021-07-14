<template>
<div style="font-family: 'Dosis', sans-serif !important; 	background-color:#f6f6f6; ">
   <transition v-if="loading">
       	<div class="modal-mask">
          <div class="loading" >
            <span class="fa fa-spinner fa-spin"></span>
          </div>
         </div>
    </transition>
    <Navbar/>
   <div class="container light-style flex-grow-1 container-p-y" style="margin-bottom: 50px;">
      <h4 class="font-weight-bold py-3 mb-1 titl">
        Account settings
      </h4>
      <div id="app" class="card overflow-hidden">
        <div class="row no-gutters row-bordered row-border-light">
          <div class="col-md-3 pt-0">
            <div class="list-group list-group-flush account-settings-links">
              <a v-bind:class="'list-group-item list-group-item-action ' + active1"  v-on:click="changeTabs('generals')"    data-toggle="list">General</a>
              <a  v-bind:class="'list-group-item list-group-item-action ' + active2"  v-on:click="changeTabs('info')"        data-toggle="list">Info</a>
              <a class="list-group-item list-group-item-action"   href="/forgetpass"       data-toggle="list">Đổi mật khẩu</a>
            </div>
          </div>
          <div class="col-md-9">
            <div class="tab-content">
              <div class="tab-pane fade active show" id="account-general" v-if="tabSelected ==='generals'">
                <div class="card-body media align-items-center">
                  <img :src="picture" alt="" class="d-block ui-w-80">
                  <div class="media-body ml-4">
                    <label class="btn btn-outline-primary">
                      Upload new photo
                      <input  type="file"
                        v-on:change="previewImage" class="account-settings-fileinput">
                    </label> &nbsp;
                    <button type="button" v-on:click="onInit" class="btn btn-default md-btn-flat">Reset</button>
                  </div>
                </div>
                <hr class="border-light m-0">
  
                <div class="card-body">
                  <div class="form-group">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control mb-1" v-model="userName">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-control" v-model="address">
                  </div>
                  <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="text" class="form-control mb-1" v-model="email">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Sex</label>
                    <input type="text" class="form-control mb-1" v-model="sex">
                  </div>
                </div>

              </div>
              <div class="tab-pane fade active show" id="account-info" v-if="tabSelected ==='info'">
                <div class="card-body pb-2">
                  <div class="form-group">
                    <label class="form-label">Birthday</label>
                    <input type="text" class="form-control" v-model="birthday">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Country</label>
                    <select class="custom-select">
                      <option selected >Việt Nam</option>
                    </select>
                  </div>
                </div>
                <hr class="border-light m-0">
                <div  class="card-body pb-2">
  
                  <h6 class="mb-4">Contacts</h6>
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="text" class="form-control" v-model="phone">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="text" class="form-control" v-model="email">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-right mt-3">
        <button type="button" v-on:click="onUpload" class="btn btn-primary">Save changes</button>&nbsp;
      </div>
    </div>
    <Footer/>
</div>
</template>

<script>
import firebase from '@/firebase/init.js';
import Navbar from '../navBar/Navbar'
import Footer from '../footer/Footer'
import axios from 'axios';
import UserService from '@/services/UserService.js';
import AuthService from '@/services/AuthService.js';
import AnalystService from '@/services/AnalystService.js';
export default {
    beforeRouteEnter(to, from, next) {
    next(vm => {
      AuthService.checkUser(localStorage.getItem('isAuthen'));
      next();
    })
  },
  components:{
    Navbar,
    Footer
  },
  name:'UserInfor',
    data(){
        return{
          loading: false,
          active1: 'active',
          active2: false,
          tabSelected: 'generals',
          imageData: null,
          id: '',
          userName: '',
          phone: '',
          address: '',
          password: '',
          email: '',
          picture:null,
          sex: '',
          birthday: '',
          userTypeID: ''
        }
    },
    mounted(){
      this.onInit();
      AnalystService.addVisitView();
    },
    methods: {
          async onInit(){
            try{
            document.title = 'Thông tin cá nhân';
            this.user = await UserService.getInfo(localStorage.getItem("isAuthen"));
            this.userName = this.user[0].userName;
            this.phone = this.user[0].phone;
            this.email = this.user[0].email;
            this.address = this.user[0].address;
            this.picture = this.user[0].picture;
            this.sex = this.user[0].sex;
            this.birthday = this.user[0].birthday;
            this.userTypeID = this.user[0].userTypeID;
            }
            catch{
              this.$router.push('/');
            }
          },
          changeTabs(tab){
            this.tabSelected=tab;
            switch(tab){
              case 'generals' : 
                this.active1 = 'active';
                this.active2 = '';
                break;
              case 'info' : 
                this.active1 = '';
                this.active2 = 'active';
                break;
            }
          },
          previewImage(event){
              this.picture=null;
              this.imageData= event.target.files[0];
          },
          onUpload(){
            this.loading = true;
            if (this.imageData == null){
               this.update();
               return;
            }
            this.picture=null;
            const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
            storageRef.on(`state_change`, snapshot => {
            },error =>{console.log(error.message)},
            ()=> {
              storageRef.snapshot.ref.getDownloadURL().then((url) => {
                this.picture=url;
                this.update();
              })
            }
            )
          },
          async update(){
            try{
              const credentials = {
              userID: this.id,
              userName: this.userName,
              phone: this.phone,
              address: this.address,
              password: null,
              email: this.email,
              picture: this.picture,
              sex: this.sex,
              birthday: this.birthday,
              userTypeID: this.userTypeID
              };
              localStorage.setItem('userInfor',credentials.toString())
              axios.post("https://api.viefood.info/api/User/EditByID" , credentials ,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(respone =>{ 
                this.loading= false;
                alert(respone.data)
              });
              const response2 = await UserService.getInfo(localStorage.getItem("isAuthen"));
              localStorage.setItem('userInfor',JSON.stringify(response2[0]));
              this.onInit();
            }
            catch(err){console.log(err)}
          }
      }
    }
</script>

<style scoped>
body{
    background: #f6f6f6;
}
.titl{
  text-align: center;
}
.ui-w-80 {
    width: 80px !important;
    height: 100px;
}

.btn-default {
    border-color: rgba(24,28,33,0.1);
    background: rgba(0,0,0,0);
    color: #4E5155;
}

label.btn {
    margin-bottom: 0;
}

.btn-outline-primary {
    border-color: #26B4FF;
    background: transparent;
    color: #26B4FF;
}

.btn {
    cursor: pointer;
}

.text-light {
    color: #babbbc !important;
}
.card {
    background-clip: padding-box;
    box-shadow: 0 1px 4px rgba(24,28,33,0.012);
}
.row-bordered {
    overflow: hidden;
}
.account-settings-fileinput {
    position: absolute;
    visibility: hidden;
    width: 1px;
    height: 1px;
    opacity: 0;
}
.account-settings-links .list-group-item.active {
    font-weight: bold !important;
}
html:not(.dark-style) .account-settings-links .list-group-item.active {
    background: transparent !important;
}
.account-settings-multiselect ~ .select2-container {
    width: 100% !important;
}
.light-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}
.light-style .account-settings-links .list-group-item.active {
    color: #4e5155 !important;
}
.material-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}
.material-style .account-settings-links .list-group-item.active {
    color: #4e5155 !important;
}
.dark-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(255, 255, 255, 0.03) !important;
}
.dark-style .account-settings-links .list-group-item.active {
    color: #fff !important;
}
.light-style .account-settings-links .list-group-item.active {
    color: #4E5155 !important;
}
.light-style .account-settings-links .list-group-item {
    padding: 0.85rem 1.5rem;
    border-color: rgba(24,28,33,0.03) !important;
}
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    border-radius: 10px;
  }
  .loading {
  text-align: center;
  position: fixed;
  color:  #fff;
  z-index: 9;
  font-size: 80px;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(50% - 65px);
  top: calc(50% - 30px);
}
</style>