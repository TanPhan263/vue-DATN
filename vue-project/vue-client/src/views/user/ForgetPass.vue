<template>
<div>
    <Navbar/>
<div
    class="c-app flex-row align-items-center"
  >

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
    <CCardHeader> <strong>Quên mật khẩu</strong>
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
          ><CIcon name="cil-check-circle"/>Send code</CButton
        >
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
            v-model="code2"
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
        <CButton @click="isValid" class="btn_left" size="sm" color="primary"
          ><CIcon name="cil-check-circle" /> Change</CButton>
        <CButton href="/login" class="btn_right" type="reset" size="sm" color="danger">
        <CIcon name="cil-ban"/>Cancle</CButton>
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
export default {
  components:{
    Navbar,
    Footer
  },
    data(){
        return{
          msg: '',
          showErr: false,
          showSuccess: false,
          email:'',
          code: '',
          pass: '',
          retypepass:'',
          code2: '',
          page2: false,
        }
    },
 methods: {
    validator(val) {
      return val ? val.length >= 4 : false
    },
    validator_pass (val) {
      return val ? val.length >= 8 : false
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
    check(){
      if(this.pass=='' || this.retypepass == ''|| this.code2 =='')
      {
        this.msg='Bạn chưa nhập đầy đủ thông tin!'
        return false;
      }
      else{
        if(this.code!=this.code2) {
          this.msg='Mã code không trùng khớp, mời bạn nhập lại'
          return false;
        }
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
    sendCode(){
      try{
        if(this. ValidateEmail(this.email))
        {
          axios.post("https://api.viefood.info/api/User/ForgetPass?Email="+ this.email).then(respone =>{ 
              this.code=respone.data.code;
              this.page2 = true;
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
    isValid(){
      this.showErr=false;
      this.showSuccess= false;
      if(this.check())
          { 
            try{ 
              axios.post("https://api.viefood.info/api/User/ResetPass?Email=" + this.email +"&Password="+ this.pass);
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
  }
}
</script>

<style>
@import url('../../assets/css/comments.css');
@import url('../../assets/css/style-0.css');
@import url('../../assets/css/footer.css');
@import url('../../assets/css/reset.css');
@import url('../../assets/css/alert.css');
.center_div{
    margin: 0 auto;
    width:100%;
}
.btn_left{
  margin-right: 80px;
  width:100px;
}
.btn_right{
  width: 100px;
  float: right;
}
</style>