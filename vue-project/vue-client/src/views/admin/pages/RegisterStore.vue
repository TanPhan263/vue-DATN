<template>
 <div class="d-flex align-items-center min-vh-100">
   
  <CContainer >
    <div v-if="registered" class="alert-green">
      <div class="row">
      <i style="font-size: 70px; margin: 0px 20px 0 20px" class="fas fa-check"></i>
      <div style="width: 88%">
      <span class="closebtn" style="float: right; font-size: 20px" @click="registered=false">&times;</span> 
      <h4>Thông tin quán đã được ghi nhận</h4> <p>Bạn vui lòng đợi admin xác nhận thông tin. <br>Cám ơn bạn đãn chọn chúng tôi!!!</p>
    </div>
    </div>
  </div>
      <h2 style="text-align: center;">ĐĂNG KÍ QUÁN</h2>
      <CRow  fluid v-if="page1" class="justify-content-center animation">
        <CCol md="7">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Thông tin của bạn</h1>
                <p class="text-muted">Create your account to manage your store</p>
                <CInput
                  placeholder="Username"
                  autocomplete="username"
                  v-model ="name"
                > </CInput>
                <CInput
                  placeholder="Phone number"
                  autocomplete="phone"
                  v-model ="phone"
                >
                </CInput>
                <CInput
                  placeholder="Email"
                  autocomplete="email"
                  v-model="mail"
                />
                <CButton class="btn_right" v-on:click="page1 = false, page2 = true, page3= false" block>Tiếp theo <i class="fas fa-arrow-right"></i></CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
  <CRow   class="justify-content-center">
    <CCol v-if="page2" col="12" lg="6" class="animation">
      <CCard>
        <CCardHeader>
          <strong>THÔNG TIN QUÁN</strong>
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CInput
                label="Tên quán"
                v-model="storeName"
                horizontal
                autocomplete="name"
               
              />
              <div class="row" style="margin-left: 0px;">
                <p class="lable-select">Khu vực</p>
                <select
                    id="province"
                    class="country fl_left select-template"
                    vertical
                    v-model="districtSelected"
                    placeholder="Địa điểm"
                    >
                    <option v-for="(district,index) in districts" v-bind:key="index" :value="district.provinceID">
                        {{district.districtName}}
                    </option>
                </select>
                </div>
              <CInput
                label="Địa chỉ"
                horizontal
                v-model="Store_address"
              ></CInput>
              <CInput
                label="Giờ mở"
                horizontal
                v-model="openTime"
              />
               <CInput
               
                label="Giờ đóng"
                horizontal
                v-model="closeTime"
              />
             <div class="row" style="margin-left: 0px;">
                <p class="lable-select">Loại</p>
                <select
                    id="province"
                    class="country fl_right select-template"
                    vertical
                    v-model="bussinessTypeSelected"
                    placeholder="Địa điểm"
                    >
                    <option v-for="busi in bussinessType" v-bind:key="busi.businessTypeID" :value="busi.businessTypeID">
                        {{busi.businessTypeName}}
                    </option>
                </select>
                </div>            
            </CForm>
          </CCardBody>
            <CCardFooter>
              <CButton  class="btn_left" @click="page1 = true, page2 = false, page3 = false"  block> <i class="fas fa-arrow-left"></i> Trở lại </CButton>
              <CButton  class="btn_right" @click="page1 = false, page2 = false, page3 = true" block>Tiếp theo <i class="fas fa-arrow-right"></i></CButton>
      </CCardFooter>
      </CCard>
    </CCol>
    <CCol v-if="page3" lg="6" class="animation">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-justify-center"/>
          <strong>CHỌN ẢNH ĐẠI DIỆN QUÁN</strong>
        </CCardHeader>
        <CCardBody>
             <input
                type="file"
                @change="previewImage"
              />
        </CCardBody>
         <CCardFooter>
                <CButton  class="btn_left" @click="page1 = false, page2 = true, page3 = false"  block> <i class="fas fa-arrow-left"></i> Trở lại </CButton>
                <CButton class="btn_right" @click="onUpload" block>Đăng kí <i class="fas fa-check"></i></CButton>
      </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
  </CContainer>
 </div>
</template>

<script>
import firebase from 'firebase';
import AuthService from '@/services/AuthService.js';
import StoreService from '@/services/StoreService.js';
import ProvinceService from '@/services/ProvinceService.js'
import BussinessTypeService from '@/services/BussinessTypeService.js'
export default {
  name: 'Store',
  data () {
    return {
      registered: false,
      page1: true,
      page2: false,
      page3: false,
      districts:'',
      bussinessType:'',
    
//Store
      storeName:'',
      districtSelected:'',
      bussinessTypeSelected:'',
      Store_address:'',
      imageData: null,
      picture:'',
      openTime:'',
      closeTime:'',
      storeType:'',
      id: '',
//User
      name: '',
      address: '',
      phone: '',
      mail: '',
      avt: '',
      type: '-MO5VWchsca2XwktyNAw' ,
    }
  },
  methods: {
    async signUpStore(){
      try {
        if(true)
        {
          const credentials = {
            userName: this.name,
            phone: this.phone,
            address: '',
            password: '1',
            email: this.mail,
            picture: '',
            sex: '',
            birthday: '',
            userTypeID: this.type,
            status:'-1'
          };
          let ownerID = await AuthService.registerOwner(credentials);
          const credentialsStore = {
            storeAddress: this.Store_address,
            storeName: this.storeName,
            storePicture:this.picture,
            openTime: this.openTime,
            cLoseTime: this.closeTime,
            userID: ownerID.toString(),
            provinceID: this.districtSelected,
            businessTypeID: this.bussinessTypeSelected,
            ratePoint: '0',
            khoangcach: '0',
            status:'-1'
          };
          const response = await StoreService.registerStore(credentialsStore)
          alert(response);
          this.registered=true;
        }else 
        alert("Vui long nhap dung password")
      }catch (error) {
        alert(error);
      }
    },
    goBack() {
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/'})
    },
    //  checkPass(){
    //    if(this.pass == this.pass2){
    //     return true}
    //    else {
    //     return false
    //    }
    // },
    previewImage(event){
        this.picture=null;
        this.imageData= event.target.files[0];
    },
    onUpload(){
      this.picture='';
      if(this.imageData == null)
      {
        this.signUpStore();
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { 
          this.picture=url;
          this.signUpStore();
          })
        }
      )
    },
    async onInit(){
      this.next = false;
      this.districts = await ProvinceService.getAllDistrict();
      this.districtSelected = this.districts[0].districtID;
      this.bussinessType = await BussinessTypeService.getAll();
    }
  },
   mounted(){
     this.onInit();
  }
}
</script>
<style>
.alert-green {
    padding: 20px;
    background-color:limegreen;
    color: white;
  }
.btn_left{
  width: 30%; border: 1px solid red; color: red; float: left; margin-top: 8px ;
}
.btn_right{
 width: 30%; border: 1px solid limegreen; color: limegreen; float: right;
}
.btn_left:hover{
  background: red; color: white;
}
.btn_right:hover{
  background: limegreen; color: white;
}
.select-template{
  width:360px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;
}
.lable-select{
  width: 122px;
}
.animation {
  animation-duration: 1.5s;
  animation-name: slidein;
}

@keyframes slidein {
  from {
    margin-left: 20%;
    width: 100%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
</style>
