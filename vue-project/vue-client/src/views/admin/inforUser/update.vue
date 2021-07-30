<template>
    <CRow>
      <CCol md="4">
        <CCard>
          <CCardBody style="width:100%;">
            <CForm style="width:100%;" class="center_div" >
                <div class="center_div">
                <div style="width:100%;" class="profile">
                <img 
                    v-lazy="picture"
                    style="border-radius:50%; height:150px;width:150px;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    width: 60%;"
                />
                </div>
                </div>
            </CForm>
              <CCardHeader style="text-align:center; height: 50px;">
              </CCardHeader>
                <CCardHeader style="text-align:center;">
                    <strong >{{name}}</strong>
              </CCardHeader>
          </CCardBody>
          <CCardFooter >
            <div style="margin-top:20px; width:100%;">
            <input style="float:left;"
                type="file"
                @change="previewImage"
              />
              <CButton style="float:right;" @click="onUpload" type="submit" color="primary">Đổi ảnh</CButton>
              <div class="row">
                <p v-if="uploadValue>0">progress: {{uploadValue.toFixed()+ "%"}}</p>
              </div>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol md="8">
        <CCard>
          <CCardHeader>
            <strong>Thông tin tài khoản</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow>
                <CCol sm="6">
              <CInput
                label="Id user"
                placeholder="Disabled"
                value=''
                v-model="id"
                disabled
              />
                </CCol>
                 <CCol sm="6">
              <CInput
                label="Họ tên"
                value=''
                autocomplete="name"
                 v-model="name"
              />
                 </CCol>
              </CRow>
              <CInput
                label="Địa chỉ"
                value=''
                v-model="address"
              />
                <CRow>
                <CCol sm="4">
              <CInput
                label="Số điện thoại"
                value=''
                v-model="phone"
              />
                </CCol>
                 <CCol sm="8">
              <CInput
                label="Ngày sinh"
                type="text"
              
                :value='birth'
                v-model="birth"
              />
                 </CCol>
                </CRow>
              <CInput
                label="Email "
                description="Please enter your email"
                placeholder="Enter your email"
                type="email"
              
                autocomplete="email"
                required
                was-validated
                value=''
                v-model="mail"
              />
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton v-on:click="update"  class="btn_submit" type="submit" size="sm" color="primary"><CIcon name="cil-check-circle"/> Cập nhật</CButton>
            <CButton class="btn_back" type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Trở về</CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import axios from 'axios';
import UserService from '@/services/UserService.js';
import AuthService from '@/services/AuthService.js';

export default {
    beforeRouteEnter (to, from, next) {
      AuthService.checkUser(localStorage.getItem('isAuthen'))
      next();
  },
    name: 'update',
    data(){
        return{
            uploadValue: 0, //giá trị % trong lúc tải lên
            //các thuộc tính của user
            id: '',
            name: '',
            picture: null,
            imageData: null,
            address: '',
            phone: '',
            birth: '',
            mail: '',
            pass: '', 
            sex: '',
            type: '',
        };
    },
    methods: {
        previewImage(event){ //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
          this.uploadValue=0;
          this.imageData= event.target.files[0];
        },
        onUpload(){
          this.picture=null;
          const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);//tải anh lên firebase
          storageRef.on(`state_change`, snapshot => {
            this.uploadValue=(snapshot.bytesTransfered/snapshot.totalBytes)*100;
          },error =>{console.log(error.message)},
          ()=> {
            this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {this.picture=url;  //trả về url của ảnh
            this.update();                                                              //update thông tin 
            })
            }
          )
          
        },
        update(){
          try{
          const credentials = {   //tạo một đối tượng chứa các thược tính người dùng
            userID: this.id,
            userName: this.name,
            phone: this.phone,
            address: this.address,
            password: this.pass,
            email: this.mail,
            picture: this.picture,
            sex: this.sex,
            birthday: this.birth,
            userTypeID: this.type
          };
          //gọi api update 
          axios.post("https://api.viefood.info/api/User/EditByID" , credentials ,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(respone =>{ 
            alert(respone.data)})
          }
          catch(err){
            console.log(err);
          }
        }
    },
    mounted() {
      try{//api lấy thông tin người dùng bằng token
          this.$http.get("https://api.viefood.info/api/User/GetByID" , { headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(respone =>{
            this.id= respone.data[0].userID //gán các giá trị vào thuộc tính tương ứng của người dùng
            this.name=respone.data[0].userName
            this.phone=respone.data[0].phone
            this.address= respone.data[0].address
            this.mail=respone.data[0].email
            this.birth=respone.data[0].birthday
            this.picture= respone.data[0].picture
            this.pass= respone.data[0].password
            this.type= respone.data[0].userTypeID
            this.sex= respone.data[0].sex
          })
      }
      catch(err){
        console.log('lỗi rồi')
      }
    }
}
</script>

<style>
.center_div{
    margin: 0 auto; 
}
.btn_submit{
  width:100px;
}
.btn_back{
  float:right;
  width: 100px;
}
.profile{
  background-image: url('../../../assets/imgs/profile.jpg'); 
  padding-top: 30px;
  margin-bottom: -40px;
}
</style>