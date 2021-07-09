<template>
  <CRow>
    <CCol md="12">
      <div v-if="status === '-1'" class="alert-red" >
            <div class="row">
              <div style="width: 100%">
              <h4>Quán hiện chưa được kích hoạt</h4> <p>Nhấn để kích hoạt </p>
                <CButton style="margin-right: 20px"  @click="confirmStore()" class="btn_left" type="submit" size="sm" color="warning"><CIcon name="cil-check-circle"/> Kích hoạt</CButton>
                 <CButton @click="deleteStore()"  class="btn_left" type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Xóa</CButton>
            </div>
          </div>
      </div>
    </CCol>
    <CCol md="12">
      <CCard>
         <CCardHeader>
          <div class="row" style="width: 100%">
          <h2 style="margin-left: 12px; width: 80%">Xem quán</h2>
          </div>
         </CCardHeader>
         <CCardBody>
            <a :href="'http://viefood.info/'+ storeID" target="_blank">
              <span style="margin-right: 5px; padding: 3px;"><span  class="fa fa-link" style="font-size: 17px; color: blue"> http://viefood.info/{{storeID}}</span>
              </span>
            </a>
         </CCardBody>
      </CCard>
     </CCol>
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

     <transition v-if="active2">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
				<div class="modal-header">
					<slot name="header">
					<h3>DANH SÁCH KHUYẾN MÃI</h3>
					</slot>
				</div>

			<div class="modal-body" style="height:200px;overflow:scroll">
            <div class="res-common-minmaxprice"  v-if="discounts">
              <span v-for="(discount,index) in discounts" v-bind:key="index" style="width:100%;border: 1px solid green; margin-right: 5px; padding: 5px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"></span>
               	{{discount.discountTypeName}}<i @click="addStoreToDiscount(discount.discountTypeID)" class="fa fa-plus-circle" style="font-size: 20px;margin-top: 7px; color:green"></i> <br></span>
            </div>
				</div>

				<div class="modal-footer">
					<slot name="footer">
					<button class="btn btn-danger" @click="active2=false">
						Close
					</button>
          
					</slot>
				</div>
				</div>
			</div>
			</div>
		</transition>

    <CCol col="12" lg="6">
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
              <!-- <CInput
                label="Chủ quán"
                horizontal
                autocomplete="name"
                :value="storeOwnerName.userName"
              /> -->
             
              <div class="row" style="margin-left: 0px;">
                <p style="margin-right:10px;">Chủ quán</p>
                <select v-if="users"
                      id="storeOwner"
                      style="width:72%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px; margin-left: 48px"
                      class="country fl_left"
                      vertical
                      v-model="storeOwner"
                      placeholder="Chủ quán"
                      >
                      <option v-for="(user, index) in users" v-bind:key="index" :value="user.userID">
                          {{user.userName}}
                      </option>
                </select>
               </div>
                <p style="color:red" v-if="storeOwnerName.status === '-1'"> Tài khoản hiện chưa được xác nhận! <a :href="'/manage/users/'+storeOwnerName.userID"><strong>Đi đến tài khoản</strong></a></p>
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
                      style="width:72%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px; margin-left: 48px"
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
    <CCol md="6">
      <CCard>
        <CCardHeader style="font-weight: bold;">
          <CIcon name="cil-justify-center"/>
          <strong> Hình ảnh của cửa hàng</strong>
        </CCardHeader>
        <CCardBody>
          <CCarousel
            indicators
            animate
            height="252px"
          >
            <CCarouselItem
              style="height:250px"
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
           <div class="row">
          <label for="files" class="btn">Select Image</label>
          <input id="files" type="file"  @change="previewImage">
          </div>
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
    <CCol md="12">
      <CCard>
         <CCardHeader>
          <div class="row" style="width: 100%">
          <h2 style="margin-left: 12px; width: 80%">Khuyến mãi</h2>
          <div class="row" style="float:right;">
            <CButton color="primary" @click="openAddDiscount">Thêm Khuyến mãi</CButton>
          </div>
          </div>
         </CCardHeader>
         <CCardBody>
            <div class="res-common-minmaxprice"  v-if="discountList">
              <span v-for="(discount,index) in discountList" v-bind:key="index" style="border: 1px solid red; margin-right: 5px; padding: 3px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"> {{getDiscountName(discount.idDiscountType)}}</span>
               	<i @click="removeStoreToDiscount(discount.idDiscountType)" class="fa fa-window-close" style="font-size: 20px;"></i>  </span>
            </div>
         </CCardBody>
      </CCard>
     </CCol>
     <CCol col="12">

     <CCard class="center_div" style="padding: 20px;">
       <CCardHeader>
      <div class="row" style="width: 100%">
            <h2  style="margin-left: 12px; width: 80%">Comments</h2>
      </div>
      </CCardHeader>
      <CCardBody>
        <!-- <CDataTable
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
          :pagination="{ doubleArrows: false, align: 'center'}"
          @page-change="pageChange"
          >
          </CDataTable> -->
          <div class="row" >
            <div class="col-12" >
              <table class="table table-image" >
                <thead>
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Ảnh</th>
                    <th scope="col">Tên người bình luận</th>
                    <th scope="col">Nội dung</th>
                    <th scope="col">Đánh giá</th>
                    <th scope="col">Ngày</th>
                    <th scope="col" class="manage">Manage</th>
                  </tr>
                </thead>
                <tbody v-if="commentList">
                  <tr v-for="(comment,index) in commentList" v-bind:key="index">
                    <th scope="row">{{index + 1}}</th>
                    <td>
                      <img v-lazy="comment.image" style="height: 120px;width:120px">
                    </td>
                    <td>  
                      {{comment.userName}}
                      </td>
                    <td>
                  {{comment.content}}
                    </td>
                    <td>
                    {{comment.ratePoint}}
                    </td>
                    <td>
                      {{comment.date}}
                    </td>
                    <td>
                      <CButtonGroup style="float:left" size="sm">
                        <CButton @click="deleteComment(comment.commentID)" color="danger">Delete</CButton>
                      </CButtonGroup>
                    </td>
                  </tr>
                </tbody>
              </table>   
              </div>
            </div>
          </CCardBody>
      </CCard>
     </CCol>
  </CRow>
</template>

<script>
import StoreService from '@/services/StoreService'
import AuthService from '@/services/AuthService'
import UserService from '@/services/UserService'
import CommentService from '@/services/CommentService.js';
import DiscountService from '@/services/DiscountService.js';
export default {
  beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'Store',
  data () {
    return {
      discounts:[],
      discountList:[],
      discountAll:[],
      bussinessType: '',
      active: false,
      active2: false,
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
      activePage: 1,
      users: [],
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
    previewImage(event){
          this.storePicture=null;
          this.imageData= event.target.files[0];
    },
    async addStoreToDiscount(id){
          const discount = {
              iDStore: this.storeID,
              iDDiscountType: id
          }
          const response = await DiscountService.addStoreToDiscount(discount,localStorage.getItem('isAuthen'));
          alert(response);
          this.getDisCount(this.storeID)
        },
    async removeStoreToDiscount(id){
          console.log(this.storeID);
          console.log(id);
          const response = await DiscountService.removeStoreToDiscount(this.storeID,id,localStorage.getItem('isAuthen'));
          this.getDisCount(this.storeID);
          alert(response);
        },
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
      this.$http.get('https://api.viefood.info/api/User/GetByID?id='+this.storeOwner,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.storeOwnerName = response.data[0];
      })
    },
    async getComments(index){
			try{
        console.log(index);
				this.commentList = await CommentService.getCommentByStore(index);
			}
			catch{}
		},
    async getDisCount(id){
      this.discountList = await DiscountService.getDiscountbyStore(id);
      this.discountAll =  await DiscountService.getAll();
    },
    getDiscountName(id){
      let temp = ''
      this.discountAll.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    async getDiscounts(){
      this.discounts = await DiscountService.getAll();
    },
    openAddDiscount(){
      this.active2=true;
      this.getDiscounts();
    },
    rowClicked (item) {
      this.$router.push({path: `store/${item.storeID}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    async onInit(){
      this.users = await UserService.getAll(localStorage.getItem('isAuthen')); 
    },
    async confirmStore(){
      try{
        if(this.storeOwner != ''){
          const id = this.$route.params.id;
          const responseStore =  await StoreService.changeStatus(localStorage.getItem('isAuthen'), '1', id);
          const responseOwner =  await UserService.block(localStorage.getItem('isAuthen'), this.storeOwner, '1');
          alert(responseStore);
        }
      }
      catch{

      }
    },
    async deleteStore(){
      try{
        if(confirm('Bạn chắc chắn muốn xóa')){
          const id = this.$route.params.id;
          const response = await StoreService.delete(id,localStorage.getItem('isAuthen'))
          alert(response);
          this.$router.push("/confirmstore");
        }
      }
      catch{}
    },
    async deleteComment(id){
      if(confirm('Bạn chắc muốn xóa bình luận này?')){
        const response = await CommentService.deleteCommentAdmin(id,localStorage.getItem('isAuthen'));
        alert(response);
      }
    }
  },
   mounted(){
      const id = this.$route.params.id
      this.$http.get('https://api.viefood.info/api/Store/GetByIDManage?id='+id,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
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
            this.status = response.data[0].status;
            if(response.data[0].status == '1') this.check == false;
            else this.check = true;
            this.getStoreOwner();  
            this.getComments(this.storeID)                
    });
     this.onInit();
     this.getDisCount(id);
     this.$http.get('https://api.viefood.info/api/BusinessType/GetAll').then(response => {
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
.alert-red {
    padding: 20px;
    background-color:#CD5C5C;
    color: white;
  }
</style>
