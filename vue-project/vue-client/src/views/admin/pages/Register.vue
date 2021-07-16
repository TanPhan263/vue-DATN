<template>
  <div class="d-flex align-items-center min-vh-100">
   <transition v-if="loading">
       	<div class="modal-mask">
          <div class="loading" >
            <span class="fa fa-spinner fa-spin"></span>
          </div>
        </div>
    </transition>
    <CContainer class="justify-content-center" >
      <CAlert
            color="danger"
            closeButton
            :show.sync="showErr">
           {{ msg }}
      </CAlert>
      <CAlert
            color="success"
            closeButton
            :show.sync="showSuccess">
           {{ msg }}
      </CAlert>
       <!-- <div v-if="show == 1" class="alert-red" style="margin-bottom: 20px;margin-top: 20px;">
        <span class="closebtn" @click="show=0">&times;</span> {{ msg }}
      </div>
       <div v-if="show == 2" class="alert-blue" style="margin-bottom: 20px;margin-top: 20px;">
        <span class="closebtn" @click="show=0">&times;</span> {{ msg }}
      </div> -->
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                 <img class="imglogo" :src="logo" alt="viefood.info">
                <p class="text-muted">Already have an account?<a href="/login"><strong>Login</strong></a></p>
                <CInput
                  placeholder="Username"
                  autocomplete="username"
                  v-model ="name"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  type="email"
                  placeholder="Email"
                  autocomplete="email"
                  prepend="@"
                  v-model="mail"
                />
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  v-model="pass"
                >
                <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CInput
                  placeholder="Repeat password"
                  type="password"
                  invalid-feedback="Your password is not correct"
                  autocomplete="new-password"
                  class="mb-4"
                  v-model="retypepass"
                  >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton v-on:click="signUp" color="success" block>Create Account</CButton>
              </CForm>
            </CCardBody>
            <CCardFooter style="text-align:center" class="p-4">
              <p class="text-muted">or login with</p>
              <CRow>
                <CCol col="6">
                  <CButton  @click="loginFacebook()" block color="facebook">
                    Facebook
                  </CButton>
                </CCol>
                <CCol col="6">
                  <CButton @click="loginGoogle()" block style="background: red; color: white">
                    Google
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService.js';
import axios from 'axios';
export default {
  beforeRouteEnter (to, from, next) {
    var isAuthen = localStorage.getItem('isAuthen');
    if( isAuthen != null)
    {
      next('/userinformation');
      return;
    }
    else {next();}
  },
  name: "Register",
  data() {
    return {
      loading: false,
      msg:'plaplaspl',
      showErr: false,
      showSuccess: false,
      id: '',
      name: '',
      address: '',
      phone: '',
      birth: '',
      mail: '',
      avt: '',
      pass: '', 
      retypepass:'',
      sex: '',
      type: '-MO5VYNnWIjXtvJO4AXi',
      logo:'',
    };
  },
  mounted() {
    this.getLogo();
  },
  methods: {
    signUp() {
      try {
        this.showErr=false;
        this.showSuccess= false;
        if(!this.ValidateEmail(this.mail)){
          this.msg="Email không hợp lệ";
          this.showErr = true;
          return;
        }
        if(this.check())
        {
          this.loading = true;
          const credentials = {
          userName: this.name,
          phone: this.phone,
          address: this.address,
          password: this.pass,
          email: this.mail,
          picture: this.avt,
          sex: this.sex,
          birthday: this.birth,
          userTypeID: this.type
          };
          axios.post("https://api.viefood.info/api/User/RegisterUser", credentials).then(respone =>{ 
              this.msg="Bạn đã đăng kí thành công, vui lòng đăng nhập"
              this.showSuccess = true;
            })
          this.reset();
        }else{
          this.loading=false;
          this.showErr = true;
        }
      }catch (error) {
        this.loading=false;
        this.msg = error.response.data.msg;
        this.showErr = true;
      }
    },
    check(){
      if(this.name == '' || this.mail == '' || this.pass =='' || this.retypepass =='')
      {
        this.msg='Vui lòng nhập đầy đủ thông tin';
        return false;
      }
      else{   
        if(this.pass == this.retypepass) return true;
        else{
          this.msg = 'Password không trùng khớp, vui lòng nhập lại';
          return false;
        }
      }
    },
    reset(){
      this.name='';
      this.phone='';
      this.address='';
      this.pass='';
      this.mail='';
      this.avt='';
      this.sex='';
      this.birth='';
      this.retypepass = '';
      this.loading=false;
    },
    ValidateEmail(mail) 
    {
       var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (mail.match(validRegex)) {
            return true;
          } else {
            return false;
        }
    },
     loginGoogle(){
      AuthService.loginGoogle();
      this.loading=false;
    },
    loginFacebook(){
       AuthService.loginFacebook();
       this.loading=false;
    },
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
  }
};
</script>
<style>
  @import url('../../../assets/css/alert.css');
a{
  text-decoration: none;
  color: black;
}
a:hover{
  text-decoration: none;
  color: Red;
}
.imglogo{
  margin: 0 auto;
  width: 40% ;
}
</style>
