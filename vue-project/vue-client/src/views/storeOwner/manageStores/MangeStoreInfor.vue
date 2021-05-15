<template>
  <CRow>
    <transition v-if="active">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<i v-on:click="active=false" class="fa fa-window-close" style="float: right; font-size: 20px;"></i>
					<i class="fa fa-map-marker" style="font-size: 20px; margin-right: 3px;"></i> <h4 style="text-align: center;">Lấy kinh độ và vĩ độ online</h4>
					<slot name="body">
            Nhằm lấy được tọa độ quán ăn của bạn để thực hiện tính khoảng cách quán ăn
            <p> Nhấn vào link dưới đây để lấy tọa độ quán ăn online:</p>
            <a href="https://www.latlong.net/" target="_blank" >https://www.latlong.net/</a>
					</slot>
					<div style=" width: 90%; color: white; margin: 0 auto">
					</div>
				</div>
			</div>
			</div>
		</transition>
    <CCol col="12" lg="6">
      <CCard>
        <CCardHeader>
          THÔNG TIN QUÁN
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CInput
                label="Ngày đăng kí"
                horizontal
                value="1/1/2020"
              disabled
              />
              <CInput
                label="Tên quán"
                v-model="storeName"
                horizontal
                autocomplete="name"
              />
              <CInput
                label="Địa chỉ"
                v-model="storeAddress"
                horizontal
            
              ></CInput>
              <CInput
              v-model="openTime"
                label="Giờ mở cửa"
                horizontal
                
              />
               <CInput
               v-model="closeTime"
                label="Giờ đóng cửa"
                horizontal
           
              />
              <div class="row" style="margin-left: 0px;">
              <p style="margin-right: 55px;">Loại quán</p>
                    <select
                        style="width:345px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px; color: grey;"
                        class="country fl_left"
                        vertical
                        v-model="storeStype"
                        placeholder="Loại món ăn"
                        >
                        <option >Loại quán ăn</option>
                        <option v-for="dish in type" v-bind:key="dish.businessTypeID" :value="dish.businessTypeID">
                            {{dish.businessTypeName}}
                        </option>
                    </select>
              </div>
            </CForm>
          </CCardBody>
      </CCard>
    </CCol>
    <CCol md="6">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-justify-center"/>
          <strong> Hình ảnh của cửa hàng</strong>
        </CCardHeader>
        <CCardBody>
          <CCarousel
            arrows
            indicators
            animate
            height="252px"
          >
            <CCarouselItem
            style="height: 250px"
            :image="storePicture"
            />
          </CCarousel>
           <CRow form class="form-group" @click="check=!check" style="margin-top: 50px;">
            <CCol tag="label" sm="10" class="col-form-label">
              Ban store: 
            </CCol>
           <CSwitch 
              class="mr-1"
              color="danger"
              :checked="check"
              shape="pill"
            />
          </CRow>
          <div class="row">
          <label for="files" class="btn">Select Image</label>
          <input id="files" type="file"  @change="previewImage">
          </div>
        </CCardBody>
        <CCardFooter>
          <CRow form class="form-group">
          <CButton class="btn_left" color="danger" @click="goBack">Back</CButton>
          <CButton class="btn_right" color="primary" @click="onUpload">Update</CButton>
           </CRow>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol style="margin-top: -220px;" col="12" lg="6">
      <CCard>
        <CCardHeader style="font-weight: bold;">
          KINH ĐỘ VÀ VĨ ĐỘ CỦA QUÁN <div @click="active= !active" style="width: 30px; height: 30px; border: 2px solid black; border-radius: 50%; float: right;"><i style="margin-left: 7px;margin-top: 3px;  font-size: 20px;" class="fa fa-question"></i></div>
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CInput
                label="Longtitude"
                horizontal
                v-model="storeLat"
              ></CInput>
              <CInput
                label="Latitude"
                horizontal
                v-model="storeLong"
              ></CInput>
            </CForm>
          </CCardBody>
      </CCard>
    </CCol>
     <CCol col="12">
     <MangeMenu v-if="menuID" v-bind:menuID="menuID"/>
     </CCol>
  </CRow>
</template>

<script>
import firebase from 'firebase';
import MangeMenu from '../manageMenu/MangeMenu'
import StoreService from '@/services/StoreService.js';
export default {
  name: 'manageStore',
  components:{
    MangeMenu
  },
  data () {
    return {
      check: false,
      type: [],
      status : false,
      active: false,
      user: '',
      menuID: '',
      storeOpened:[],
      storeID: '',
      storeName: '',
      storeAddress: '',
      storeOwner: '',
      storeOwnerName: '',
      openTime: '',
      closeTime: '',
      imageData: null,
      storePicture: null,
      storeLat:'',
      storeLong:'',
      storeProvince:'',
      storeStype: '',
      storeRate: ''
    }
  },
  methods: {
    getmenuID(){
      alert(this.menuID);
      return this.menuID;
    },
    goBack() {
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/manageStores'})
    },
    async getStore(id){
      this.type = await StoreService.getAllBussinessType();
      this.storeOpened = await StoreService.getByID(id);
      this.menuID = this.storeOpened[0].menuID;
      this.storeName =  this.storeOpened[0].storeName;
      this.storeAddress =  this.storeOpened[0].storeAddress;
      this.storePicture =  this.storeOpened[0].storePicture;
      this.storeProvince =  this.storeOpened[0].provinceID;
      this.storeRate =  this.storeOpened[0].ratePoint;
      this.storeStype =  this.storeOpened[0].businessTypeID;
      this.storeOwner =  this.storeOpened[0].userID;
      this.openTime =  this.storeOpened[0].openTime;
      this.closeTime =  this.storeOpened[0].cLoseTime;
      this.storeID =   this.storeOpened[0].storeID;
      if(this.storeOpened[0].status == '1') this.check == false;
              else this.check = true;
    },
     async getLatLong(id){
      const response = await StoreService.getLatLong(id);
      this.storeLat = response[0].lat;
      this.storeLong = response[0].long;
    },
    previewImage(event){
          this.imageData= event.target.files[0];
        },
    onUpload(){
      if(this.imageData == null)
      {
         this.updateStore();
      }
      else{
        const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
        storageRef.on(`state_change`, snapshot => {
        },error =>{console.log(error.message)},
        ()=> {
          storageRef.snapshot.ref.getDownloadURL().then((url) => {this.storePicture=url;})
          }
        )
        this.updateStore();
      }
    },
    async updateStore(){
      if(this.check == true) this.status = '2';
          else this.status = '1';
      const id = this.$route.params.id
      const store ={
        storeAddress: this.storeAddress,
        storeName:this.storeName,
        storePicture: this.storePicture,
        openTime: this.openTime,
        cLoseTime: this.closeTime,
        userID: this.storeOwner,
        provinceID: this.storeProvince,
        businessTypeID: this.storeStype,
        ratePoint: this.storeRate,
        status: this.status
      };
      const latlong = {
        idStore: id,
        lat: this.storeLat,
        long: this.storeLong
      }
      const response = await StoreService.updateStore(id, store, localStorage.getItem('isAuthen'));
      const response2 = await StoreService.updateLatLong(latlong);
      alert('LatLong: ' + response2)
      alert(response)
    },
  },
  created(){
    const id = this.$route.params.id;
    this.getStore(id);
    this.getLatLong(id);
  },
   mounted(){
   
  }
  
}
</script>
<style>
@import url('../../../assets/css/dialog.css');
.btn_left{
  margin-right: 260px;
  width:100px;
}
.btn_right{
  width: 100px;
}
</style>
