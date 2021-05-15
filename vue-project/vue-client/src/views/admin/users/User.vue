<template>
<CRow>
       <CCol md="6">
        <CCard>
          <CCardHeader>
            <strong>Thông tin người dùng</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                label="Id user"
                disabled
                horizontal
                :value="userID"
              />
              <CInput
                label="Họ tên"
                horizontal
                autocomplete="name"
                v-model="userName"
              />
              <CInput
                label="Địa chỉ"
               
                horizontal
                v-model="address"
              ></CInput>
              <CInput
            
                label="Số điện thoại"
                horizontal
                v-model="phone"
              />
              <CInput
             
                label="Ngày sinh"
                horizontal
              v-model="birthday"
              />
              <div class="row">
              <p style="margin-left: 15px;">Quyền</p>
                <select
                    id="usertype"
                    style="width:345px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px; margin-left: 75px;"
                    class="country fl_left"
                    vertical
                    v-model="userTypeID"
                    >

                    <option v-for="userType in userTypes" v-bind:key="userType.userTypeID" :value="userType.userTypeID">
                        {{userType.userTypeName}}
                    </option>
                </select>
                </div>
              <CInput
             
                label="Email "
                placeholder="Enter your email"
                type="email"
                horizontal
                autocomplete="email"
                required
                was-validated
               v-model="email"
              />
            
            </CForm>
          </CCardBody>
          <CCardFooter>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol md="6">
        <CCard>
          <CCardBody style="width:100%;">
            <CForm style="width:100%;" class="center_div">
               <div class="center_div">
                <div style="width:100%;" class="profile">
                <img 
                  style="border-radius:50%; height:150px;width:150px;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    width: 40%;"
                    :src="picture"
                />
                </div>
               </div>
              <CCardHeader style="text-align:center; height: 50px;">
              </CCardHeader>
            <CRow form class="form-group" @click="status=!status" style="margin-top:20px">
            <CCol tag="label" sm="10" class="col-form-label">
              Ban acount: 
            </CCol>
           <CSwitch  
              class="mr-1"
              color="danger"
              :checked="status"
              shape="pill"
            /></CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton  @click="onUpload" class="btn_left" type="submit" size="sm" color="primary"><CIcon name="cil-check-circle"/> Update</CButton>
            <CButton  class="btn_right" type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Back</CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
</template>
            
<script>
import axios from 'axios';
import firebase from 'firebase';
const url = 'https://localhost:44398/api/User/GetbyId/';
import UserService from '@/services/UserService.js';
export default {
  name: 'User',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.usersOpened = from.fullPath.includes('users')
    })
  },
  data () {
    return {
        userID: this.userID,
        userTypes: null,
        userID: '',
        userName: '',
        phone: '',
        address: '',
        password: '',
        email: '',
        picture: null,
        imageData: null,
        sex: '',
        birthday: '',
        userTypeID: '',
        status: false
    };
  },
  computed: {
  },
  methods: {
    async onInit(){
      const token = localStorage.getItem('isAuthen');
      const id = this.$route.params.id;
      const userData = await UserService. getUserbyID(id,token);
      this.userTypes = await UserService.getUserType(localStorage.getItem('isAuthen'));
      this.userID = userData[0].userID;
      this.userName = userData[0].userName;
      this.phone = userData[0].phone;
      this.address = userData[0].address;
      this.password = null;
      this.email = userData[0].email;
      this.picture = userData[0].picture;
      this.sex = userData[0].sex;
      this.birthday = userData[0].birthday;
      this.userTypeID = userData[0].userTypeID;
      if(userData[0].status == '1') this.status == false;
      else this.status = true;
    },
    goBack() {
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/users'})
      },
     previewImage(event){
          this.picture=null;
          this.imageData= event.target.files[0];
        },
        onUpload(){
          if(this.imageData != null){
          const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
          storageRef.on(`state_change`, snapshot => {
            this.uploadValue=(snapshot.bytesTransfered/snapshot.totalBytes)*100;
          },error =>{console.log(error.message)},
          ()=> {
            this.uploadValue=100;
            storageRef.snapshot.ref.getDownloadURL().then((url) => {
              this.picture=url;
               this.update();
              })
            }
          )
          }
          else{ this.update();}
        },
        update(){
          if(this.status == true) this.status = '2';
          else this.status = '1';
          const id = this.$route.params.id;
          const credentials = {
          userName: this.userName,
          phone: this.phone,
          address: this.address,
          email: this.email,
          picture: this.picture,
          sex: this.sex,
          birthday: this.birthday,
          userTypeID: this.userTypeID,
          status : this.status.toString()
          };
          console.log(this.status);
          axios.post("https://localhost:44398/api/User/EditByID?id=" + id, credentials ,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(respone =>{ 
            alert(respone.data)})
        }
  },
   
   mounted(){
      this.onInit();
  }
  
}
</script>
<style>
.btn_left{
  float: left;
  width:100px;
}
.btn_right{
  float: right;
  width: 100px;
}
.center_div{
    margin: 0 auto; 
}
.profile{
  background-image: url('../../../assets/imgs/profile.jpg'); 
  padding-top: 30px;
  margin-bottom: -40px;
}

</style>