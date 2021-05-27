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
    <CCol col="12" lg="5">
      <CCard>
        <CCardHeader style="font-weight: bold;">
          THÔNG TIN QUÁN
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CInput
                label="Store ID"
                horizontal
                :value ="storeID"
                disabled
              />
              <CInput
                label="Tên quán"
                horizontal
                autocomplete="name"
                v-model="storeName"
              />
              <CInput
                label="Chủ quán"
              disabled
                horizontal
                autocomplete="name"
                v-model="storeOwnerName"
              />
              <CInput
                label="Địa chỉ"
                horizontal
                v-model="storeAddress"
              ></CInput>
              <CInput
                label="Giờ mở cửa"
                horizontal
                v-model="openTime"
              />
               <CInput
               
                label="Giờ đóng cửa"
                horizontal
                v-model="closeTime"
              />
              <!-- <CInput
             
                label="Loại hình quán"
                horizontal
                v-model="storeStype"
              /> -->
               <div class="row" style="margin-left: 0px;">
                <p style="margin-right:42px;"> Loại</p>
                <select
                      id="storeType"
                      style="width:275px;height:35px;border-radius:4px;margin-left: 28px; border: 1px solid #D3D3D3; margin-bottom: 10px;"
                      class="country fl_left"
                      vertical
                      v-model="storeStype"
                      placeholder="Địa điểm"
                      >
                      <option v-for="busi in bussinessType" v-bind:key="busi.businessTypeID" :value="busi.businessTypeID">
                          {{busi.businessTypeName}}
                      </option>
                  </select>
               </div>
               <CInput
              disabled
                label="Rating"
                horizontal
               v-model="storeRate"
              />
            
            </CForm>
          </CCardBody>
          <CCardHeader style="margin-top: -20px;font-weight: bold;">
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
    <CCol md="7">
      <CCard>
        <CCardHeader style="font-weight: bold;">
          <CIcon name="cil-justify-center"/>
          <strong> Hình ảnh của cửa hàng</strong>
        </CCardHeader>
        <CCardBody>
          <CCarousel
            indicators
            animate
            height="450px"
          >
            <CCarouselItem
              style="height:450px"
              :image="storePicture"
             
            />
          </CCarousel>
        </CCardBody>
        <CCardFooter>
          <CRow form class="form-group" @click="check=!check">
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
          <CRow form class="form-group" style="float:right;">
            <CButton class="btn_left" color="danger" @click="goBack">Back</CButton>
           </CRow>
           <CRow form class="form-group" style="float:left;">
            <CButton class="btn_right" color="primary" @click="updateStore">Update</CButton>
           </CRow>
        </CCardFooter>
      </CCard>
    </CCol>
    <!-- <CCol col="12" lg="6">
      <CCard>
        <CCardHeader style="margin-top: -50px;font-weight: bold;">
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
    </CCol> -->
    <CDataTable
            style="margin-left: 15px;width: 97%"
            hover
            border
            striped
            small
            fixed
            :items="commentList"
            :fields="fields"
            :items-per-page="5"
            clickable-rows
            :active-page="activePage"
            @row-clicked="rowClicked"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <!-- <template #status="{item}">
              <td>
                <CBadge v-if="item.status === '1'" :color="getBadge(item.status)">
                 OK
                </CBadge>
                <CBadge v-else :color="getBadge(item.status)">
                  Banned
                </CBadge>
              </td>
            </template> -->
          </CDataTable>
  </CRow>
</template>

<script>
import { loadOptions } from '@babel/core'
import StoreService from '@/services/StoreService'
import CommentService from '@/services/CommentService.js';
import storeData from './StoreData'
export default {
  name: 'Store',
  data () {
    return {
      bussinessType: '',
      active: false,
      check: false,
      status: '',
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
      storeRate: '',
      commentList: [],
      fields: [
        { key: 'commentID', label: 'ID Comment', _classes: 'font-weight-bold' },
        { key: 'userName', label: 'Người comment', _classes: 'font-weight-bold' },
        { key: 'content', label: 'Nội dung', _classes: 'font-weight-bold' },
        { key: 'date', label: 'Ngày', _classes: 'font-weight-bold' },
      ],
      activePage: 1
    }
  },
  computed: {
    
    visibleData () {
      return this.userData.filter(param => param.key !== 'username')
    },
    username () {
      return this.userData.filter(param => param.key === 'username').value
    }
  },
   watch: {
    $route: {
      immediate: true,
      handler (route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
    goBack() {
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/store'})
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
        status: this.status,
        lat: this.storeLat,
        long: this.storeLong
      };
      const response = await StoreService.updateStore(id, store, localStorage.getItem('isAuthen'));
      alert(response)
    },
    getStoreOwner() {
      this.$http.get('https://localhost:44398/api/User/GetByID?id='+this.storeOwner,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.storeOwnerName = response.data[0].userName;
            console.log(this.storeOwnerName)
      })
      return this.user
    },
    // async getLatLong(id){
    //   const response = await StoreService.getLatLong(id);
    //   this.storeLat = response[0].lat;
    //   this.storeLong = response[0].long;
    //   console.log(response)
    // },
    async getComments(index){
			try{
        console.log(index);
				this.commentList = await CommentService.getCommentByStore(index);
        console.log(this.commentList);
			}
			catch{}
		},
     rowClicked (item) {
      this.$router.push({path: `store/${item.storeID}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
  },
   mounted(){
      const id = this.$route.params.id
      this.$http.get('https://localhost:44398/api/Store/GetByIDManage?id='+id,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.storeName = response.data[0].storeName;
            this.storeAddress = response.data[0].storeAddress;
            this.storePicture = response.data[0].storePicture;
            this.storeProvince = response.data[0].provinceID;
            this.storeRate = response.data[0].ratePoint;
            this.storeStype = response.data[0].businessTypeID;
            this.storeOwner = response.data[0].userID;
            this.openTime = response.data[0].openTime;
            this.closeTime = response.data[0].cLoseTime;
            this.storeID =  response.data[0].storeID;
            this.storeLat = response.data[0].lat;
            this.storeLong = response.data[0].long;
            if(response.data[0].status == '1') this.check == false;
            else this.check = true;
            this.getStoreOwner();  
            this.getComments(this.storeID)                
    });
     this.$http.get('https://localhost:44398/api/BusinessType/GetAll').then(response => {
            this.bussinessType = response.data
    })
  }
}
</script>
<style>
@import url('../../../assets/css/dialog.css');
.btn_left{
  float: left;
  width:100px;
}
.btn_right{
  width: 100px;
  float: right;
}
</style>
