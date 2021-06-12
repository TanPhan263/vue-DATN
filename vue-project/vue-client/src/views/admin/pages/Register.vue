<template>
  <div class="d-flex align-items-center min-vh-100" style="background-image: url('https://wallpaperaccess.com/full/1631410.jpg');">
   <transition v-if="loading">
       	<div class="modal-mask">
          <div class="loading" >
            <span class="fa fa-spinner fa-spin"></span>
          </div>
         </div>
    </transition>
    <CContainer fluid>
       <div v-if="show == 1" class="alert-red" style="margin-bottom: 20px;margin-top: 20px;">
        <span class="closebtn" @click="show=0">&times;</span> {{ msg }}
      </div>
       <div v-if="show == 2" class="alert-blue" style="margin-bottom: 20px;margin-top: 20px;">
        <span class="closebtn" @click="show=0">&times;</span> {{ msg }}
      </div>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
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
                  description="Please enter your email."
                  label="Email"
                  required
                  was-validated
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
                  v-model="pass2"
                  :is-valid="checkPass"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton v-on:click="signUp" color="success" block>Create Account</CButton>
                <br>
                 <a style="float: left" href="/registerStore">Create your own store...</a>
              </CForm>
            </CCardBody>
            <CCardFooter class="p-4">
              <p class="text-muted">or login with</p>
              <CRow>
                <CCol col="6">
                  <CButton block color="facebook">
                    Facebook
                  </CButton>
                </CCol>
                <CCol col="6">
                  <CButton block style="background: red; color: white">
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
// import AuthService from '@/services/AuthService.js';
import axios from 'axios';
export default {
  name: "Register",
  data() {
    return {
      loading: false,
      msg:'plaplaspl',
      show: 0,
      id: '',
      name: '',
      address: '',
      phone: '',
      birth: '',
      mail: '',
      avt: '',
      pass: '', 
      pass2:'',
      sex: '',
      type: '-MO5VYNnWIjXtvJO4AXi' ,
    };
  },
  methods: {
    signUp() {
      try {
        this.loading = true;
        if(this.checkPass())
        {
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
          axios.post("http://KLTN.somee.com/api/User/RegisterUser", credentials).then(respone =>{ 
              this.msg= respone.data
              this.show = 1;
              })
          setTimeout(this.reset(), 2000);
        }else{
          this.loading=false;
           this.msg="Vui lòng nhập đúng password";
           this.show = 1;
        }
      }catch (error) {
        this.loading=false;
        this.msg = error.response.data.msg;
        this.show = 2;
      }
    },
    checkPass(){
      if(this.pass=='') return false;
      else if(this.pass == this.pass2){
        return true;
       } 
        else {
        return false;
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
      this.pass2 = '';
      this.loading=false;
      this.$router.push('/login')
    }
  }
};
</script>
<style>
  @import url('../../../assets/css/alert.css');

</style>
