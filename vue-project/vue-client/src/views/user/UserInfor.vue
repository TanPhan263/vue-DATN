<template>
   <div class="container light-style flex-grow-1 container-p-y">
     <transition v-if="loading">
       	<div class="modal-mask">
          <div class="loading" >
            <span class="fa fa-spinner fa-spin"></span>
          </div>
         </div>
    </transition>
      <h4 class="font-weight-bold py-3 mb-4 titl">
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
</template>

<script>
import firebase from '@/firebase/init.js';
import axios from 'axios';
import UserService from '@/services/UserService.js';
export default {
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
    },
    methods: {
          async onInit(){
            this.user = await UserService.getInfo(localStorage.getItem("isAuthen"));
            this.userName = this.user[0].userName;
            this.phone = this.user[0].phone;
            this.email = this.user[0].email;
            this.address = this.user[0].address;
            this.picture = this.user[0].picture;
            this.sex = this.user[0].sex;
            this.birthday = this.user[0].birthday;
            this.userTypeID = this.user[0].userTypeID;
            console.log(this.picture)
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
              console.log(this.picture);
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
            }
            catch(err){console.log(err)}
          }
      }
    }
</script>

<style>
body{
    background: #f5f5f5;
    margin-top:20px;
}

.titl{
    text-align: center;
}
.ui-w-80 {
    width: 100px !important;
    height: 120px;
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

.btn-facebook {
    border-color: rgba(0,0,0,0);
    background: #3B5998;
    color: #fff;
}

.btn-instagram {
    border-color: rgba(0,0,0,0);
    background: #000;
    color: #fff;
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
/* chat */
.container-mail{max-width:1170px; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: right;
  overflow: hidden;
  width: 30%; border-left:1px solid #c4c4c4;
}
.inbox_store {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 30%; border:1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}

.recent_heading {float: left; width:30%;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 70%;
}
.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  cursor: pointer;
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { height: 450px; overflow-y: scroll;}

.active_chat{ background:#ebebeb;}

.incoming_msg{
  margin-bottom: 10px;
}
.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg p {
  background: white none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 85%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg { width: 57%;}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 70%;
}

 .sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {border-top: 1px solid #c4c4c4;position: relative;}

.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging { float: right; width: 70%; padding: 0 0 50px 0;}
.msg_history {
  height: 416px;
  overflow-y: auto;
}
</style>