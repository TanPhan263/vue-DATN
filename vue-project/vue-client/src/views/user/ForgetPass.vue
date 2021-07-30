<template>
<div style="font-family: 'Dosis', sans-serif !important;">
<Navbar style="padding-bottom: 5px"/>
<div class="c-app flex-row align-items-center">
  <CRow class="center_div col-md-4">
       <CAlert
       style="width: 100%"
            color="danger"
            closeButton
            :show.sync="showErr">
           {{ msg }}
      </CAlert>
      <CAlert
       style="width: 100%"
            color="success"
            closeButton
            :show.sync="showSuccess">
           {{ msg }}
    </CAlert>
  <CCard v-if="!page2" class="col-md-12">
    <CCardHeader> <strong>Đổi mật khẩu</strong>
    <div class="card-header-actions">
      <a 
        href="/login" 
        class="card-header-action" 
        rel="noreferrer noopener" 
      >
        <small class="text-muted">Go to <strong>Login</strong></small>
      </a>
    </div>
    </CCardHeader>
    <CForm novalidate class="animation" >
      <CCardBody>
        <CInput
          type="email"
          autocomplete="email"
          label="Email"
          placeholder="Enter Email..."
          v-model="email"
        />
      </CCardBody>
      <CCardFooter>
        <CButton @click="sendCode" class="center_div" size="sm" color="primary"
          ><CIcon name="cil-check-circle"/>Send code</CButton>
      </CCardFooter>
    </CForm>
  </CCard>
  <CCard v-if="page2"  class="col-md-12">
     <CCardHeader> <strong>Đổi mật khẩu</strong>
      <div class="card-header-actions">
        <a 
          href="/login" 
          class="card-header-action" 
          rel="noreferrer noopener" 
        >
          <small class="text-muted">Go to <strong>Login</strong></small>
        </a>
      </div>
    </CCardHeader>
    <CForm  class="animation" >
     <CCardBody>
        <CInput
            label="Enter the code that send to your email"
            valid-feedback="Input is valid."
            invalid-feedback="Please provide at least 4 characters."
            placeholder="Valid value"
            v-model="code"
            />
          <CInput
            type="password"
            description="Please enter your password."
            autocomplete="current-password"
            label="New password"
            placeholder="Enter Password..."
            v-model="pass"
          />
        <CInput
          type="password"
          description="Retype your password."
          autocomplete="current-password"
          label="Retype password"
          placeholder="Enter Password..."
          v-model="retypepass"
        />
      </CCardBody>
      <CCardFooter>
        <CButton @click="isValid" color="primary">
          Change</CButton>
        <CButton @click="gotoHome" style="float:right" color="danger">
         Cancle </CButton>
      </CCardFooter>
    </CForm>
  </CCard>
</CRow>
</div>
<Footer/>
</div>
</template>

<script>
import axios from 'axios';
import Navbar from './navBar/Navbar'
import Footer from './footer/Footer'
import AnalystService from '@/services/AnalystService.js';
export default {
  components:{
    Navbar,
    Footer
  },
    data(){
        return{
          msg: '',                  //biến tin nhắn
          showErr: false,           //hiện msg error khi có lỗi         
          showSuccess: false,       //hiện msg success      
          email:'',                 //email người dùng  
          pass: '',                 
          retypepass:'',
          code: '',                 //code người dùng nhập sau khi nhận mail
          page2: false,             //hiện page tiếp theo sau khi đã gửi mail
        }
    },
  mounted(){
    AnalystService.addVisitView();//gọi api tăng lượt truy cập
    document.title = "Đổi mật khẩu";
  },
  methods: {
    validator(val) {                
      return val ? val.length >= 4 : false
    },
    //kiểm tra độ dài mật khẩu trên 8
    validator_pass (val) {
      return val ? val.length >= 8 : false
    },
    //kiểm tra email đúng định dạng chưa
    ValidateEmail(mail) 
    {
       var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (mail.match(validRegex)) {
            return true;
          } else {
            return false;
        }
    },
    //kiểm tra thông tin trước khi goi api đổi mật khẩu
    check(){
      if(this.pass=='' || this.retypepass == ''|| this.code =='')
      {
        this.msg='Bạn chưa nhập đầy đủ thông tin!'
        return false;
      }
      else{
        if(this.validator_pass(this.pass))
        {
          this.msg = 'Mật khẩu quá ngắn!';
          return false;
        }
        else{
          if(this.pass == this.retypepass){
          return true;
          } 
          else {
            this.msg='Mật khẩu mới và mật khẩu nhập lại không trùng nhau, vui lòng kiểm tra lại'
            return false;
          }
        }
      }
    },
    sendCode(){//gọi api gữi mã code cho email
      try{
        if(this.ValidateEmail(this.email))
        {
          axios.post("https://api.viefood.info/api/User/ForgetPass?Email="+ this.email).then(respone =>{ 
            this.page2 = true;//hiển thị page tiếp theo
          });
        }
        else {
          this.msg = 'email không hợp lệ';
          this.showErr=true;
        }
      }catch(err){
        console.log(err);
      }
    },
    isValid(){ //gọi api đổi mật khẩu
      this.showErr=false;
      this.showSuccess= false;
      if(this.check())//nếu check không có lỗi 
          { 
            try{ 
              axios.post("https://api.viefood.info/api/User/ResetPass?Email=" + this.email +"&Password="+ this.pass + "&code=" + this.code);
              this.showSuccess=true;
              this.msg='Đổi mật khẩu thành công';
            }
            catch(e)
            {
              this.showErr=true;
              this.msg='Lỗi rồi';
            }
          }
          else{
            this.showErr=true;
      }
    },
    gotoHome(){//về trang chủ
      this.$router.push('/');
    }
  }
}
</script>

<style>
@import url('../../assets/css/comments.css');
@import url('../../assets/css/alert.css');
.center_div{
  margin: 0 auto;
  width:100%;
}
.btn_left{
  width:100px;
}
.btn_right{
  width: 100px;
  float: right;
}
ul{
  padding-left: 20px;
}
.cancle{
  color: white;
  text-decoration: none;
}
.cancle:hover{
   text-decoration: none;
   color: white;
}
</style>