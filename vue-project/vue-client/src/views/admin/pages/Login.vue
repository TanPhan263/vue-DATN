<template>
  <div
    class="c-app flex-row align-items-center"
    style="
      background-image: url('https://wallpaperaccess.com/full/1631410.jpg');
    ">
   <transition v-if="loading">
       	<div class="modal-mask">
          <div class="loading" >
            <span class="fas fa-circle-notch fa-spin"></span>
          </div>
         </div>
    </transition>
    <CContainer>
      <CAlert
            color="danger"
            closeButton
            :show.sync="show"
          >
           {{ mgs_err }}
      </CAlert>
  <!-- <div v-if="show" class="alert-red">
  <span class="closebtn" @click="show=false">&times;</span> {{ mgs_err }}
  </div> -->
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                 <a href="/"> <img class="imglogo" :src="logo" alt="viefood.info"></a>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    type="email"
                    placeholder="Email"
                    autocomplete="email"
                    v-model="username"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model="password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton
                        @click="login"
                        color="primary"
                        class="px-4"
                        >Login</CButton
                      >
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0" href="/forgetpass"
                      >Forgot password?</CButton
                      >
                      <CButton color="link" class="d-lg-none"
                        >Register now!</CButton
                      >
                    </CCol>
                  </CRow>
                  <br />
                  <p class="px-0">or login with:</p>
                  <CButton class="btnBrand" color="facebook" @click="loginFacebook()"
                    ><i class="fab fa-facebook-f" style="font-size:20px;" />
                  </CButton
                  >
                   <CButton class="btnBrand" style="float:right"  color="danger" @click="loginGoogle()"
                    ><i class="fab fa-google" style="font-size:20px;"></i>
                  </CButton
                  >
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              style="background: #321fdb"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Sign up</h2>
                <p>
                  Tạo tài khoản mới để cập nhật những quán ăn mới nhất cũng như
                  những trải nghiệm tốt nhất!!!
                </p>
                <CButton href="/register" color="light" variant="outline" size="lg">
                  Register Now!
                </CButton>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService.js';
export default {
  name: "Login",
  data() {
    return { 
      loading: false,
      show: false,
      username: "",
      password: "",
      mgs_err:'',
      role: [],
      logo:'',
    }
  },
  mounted() {
    this.getLogo();
  },
  methods: {
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
      async login() {
        if(!this.ValidateEmail(this.username)) {
          this.show=true;
          this.mgs_err = 'Email không hợp lệ!!!';
          return;
        }
      if(this.check()){
        try {
          this.loading=true;
          const credentials = {
            email: this.username,
            password: this.password
          };
          const login = await AuthService.login(credentials);
          if(login.token == 'Đăng nhập thất bại') 
            {
              this.loading=false;
              this.show=true;
              this.mgs_err = 'Sai tên đăng nhập hoặc mật khẩu!!!';
              return;
            }
          // const token=response;
          //   if(token.token == 'Đăng nhập thất bại') 
          //   {
          //     this.loading=false;
          //     this.show=true;
          //     this.mgs_err = 'Sai tên đăng nhập hoặc mật khẩu';
          //     return;
          //   }
            // const response2 = await UserService.getInfo(token.token);
            // localStorage.setItem('isAuthen',token.token);
            // localStorage.setItem('userInfor',JSON.stringify(response2[0]));
            // this.checkRole();
            // const role = await AuthService.getRole(token.token);
            // switch(role){
            //   case '-MO5VBnzdGsuypsTzHaV':  this.loading=false;
            //                                 this.$router.push('/manage/dashboard'); break;
            //   case '-MO5VWchsca2XwktyNAw':  this.loading=false;
            //                                 this.$router.push('/manage/dashboard'); break;
            //   case '-MO5VYNnWIjXtvJO4AXi':  this.loading=false;
            //                                 this.$router.push('/'); break;  
            //   default: this.loading = false;                                                         
            // }
            // if(role == '-MO5VBnzdGsuypsTzHaV' || role == '-MO5VWchsca2XwktyNAw')
            // {
            //   this.loading=false;
            //   this.$router.push('/manage/dashboard');
            // }else if(role.userTyleID == '-MO5VYNnWIjXtvJO4AXi' ){
            //   this.loading=false;
            //   this.$router.push('/');
            // }
            // else{
            //   this.loading=false;
            // } 
        } catch (error) {
          this.loading=false;
          this.show=true;
          this.mgs_err = 'Sai tên đăng nhập hoặc mật khẩu!!!';
        }
      }
      else{
        this.show=true;
        this.mgs_err='Bạn chưa nhập password hoặc email!!!';
        return;
      }
    },
    check(){
      if(this.username == '' || this.password == '')
        return false;
      return true;
    },
    reset(){
      this.username= "";
      this.password= "";
    },
    loginGoogle(){
      AuthService.loginGoogle();
      this.loading=false;
    },
    loginFacebook(){
       AuthService.loginFacebook();
       this.loading=false;
    },
    ValidateEmail(mail) 
    {
      if(mail == '') return false;
       var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (mail.match(validRegex)) {
            return true;
          } else {
            return false;
        }
    }
  }
};
</script>
<style>
@import url('../../../assets/css/alert.css');
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
.btnBrand{
  width: 110px;
  margin-right:20px ;
}
.imglogo{
  margin: 0 auto;
  width: 40% ;
}
</style>
