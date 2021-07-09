<template>
  <CRow>
    <CCol md="12">
      <CCard>
         <CCardHeader>
          <div class="row" style="width: 100%">
          <h2 style="margin-left: 12px; width: 80%">Xem quán</h2>
          </div>
         </CCardHeader>
         <CCardBody>
            <a :href="'https://viefood.info/'+ storeID" target="_blank">
              <span style="margin-right: 5px; padding: 3px;"><span  class="fa fa-link" style="font-size: 17px; color: blue"> https://viefood.info/{{storeID}}</span>
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
                 <CInput
              disabled
                label="Rating"
                horizontal
               v-model="storeRate"
              />
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
           <CRow form class="form-group" style="margin-top: 50px;">
            <CCol tag="label" sm="10" class="col-form-label">
              Ban store: 
            </CCol>
           <CSwitch 
              class="mr-1"
              color="danger"
              :checked="check"
              shape="pill"
              disabled
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
    <CCol md="12">
      <CCard  class="center_div" style="padding:20px; margin-bottom: 20px">
         <CCardHeader>
            <div class="row" style="float:left;">
            <h2>Khuyến mãi</h2> 
          </div>
          <div class="row" style="float:right;">
            <CButton color="primary" @click="openAddDiscount">Thêm khuyến mãi</CButton>
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
     <MangeMenu style=" margin-bottom: 20px" v-if="storeID" v-bind:menuID="storeID"/>
     <CCard class="center_div" style="padding: 20px;">
       <CCardHeader>
      <div class="row" style="width: 100%">
            <h2  style="margin-left: 12px; width: 80%">Comments</h2>
      </div>
      </CCardHeader>
       <CCardBody>
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
            </tr>
          </tbody>
        </table>   
        </div>
      </div>
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
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import MangeMenu from '../manageMenu/MangeMenu'
import StoreService from '@/services/StoreService.js';
import CommentService from '@/services/CommentService.js';
import DiscountService from '@/services/DiscountService.js';
import AuthService from '@/services/AuthService.js';
export default {
   beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'));
    AuthService.checkStoreOwner(localStorage.getItem('isAuthen'));
    next();
  },
  name: 'manageStore',
  components:{
    MangeMenu
  },
  data () {
    return {
      discounts:[],
      discountList:[],
      discountAll:[],
      commentList: [],
      fields: [
        { key: 'userName', label: 'Người comment', _classes: 'font-weight-bold' },
        { key: 'content', label: 'Nội dung', _classes: 'font-weight-bold' },
        { key: 'date', label: 'Ngày', _classes: 'font-weight-bold' },
      ],
      activePage: 1,
      check: false,
      type: [],
      status : false,
      active: false,
      active2: false,
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
    async addStoreToDiscount(id){
          const discount = {
              iDStore: this.storeID,
              iDDiscountType: id
          }
          const response = await DiscountService.addStoreToDiscount(discount,localStorage.getItem('isAuthen'));
          alert(response);
          this.getDisCount(this.storeID);
        },
    async removeStoreToDiscount(id){
          const response = await DiscountService.removeStoreToDiscount(this.storeID,id,localStorage.getItem('isAuthen'));
          this.getDisCount(this.storeID);
          alert(response);
        },
     pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
     rowClicked (item) {
      // this.$router.push({path: `store/${item.storeID}`})
    },
    async getComments(index){
			try{
        console.log(index);
				this.commentList = await CommentService.getCommentByStore(index);
        console.log(this.commentList);
			}
			catch{}
		},
    getmenuID(){
      alert(this.menuID);
      return this.menuID;
    },
    goBack() {
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/managestores'})
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
      this.storeLat = this.storeOpened[0].lat;
      this.storeLong = this.storeOpened[0].long;
      if(this.storeOpened[0].status == '1') this.check == false;
              else this.check = true;
      if(this.storeRate == null || this.storeRate == 'NaN' ) this.storeRate = 0;
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
        status: this.status,
        lat: this.storeLat,
        long: this.storeLong
      };
      const response = await StoreService.updateStore(id, store, localStorage.getItem('isAuthen'));
      alert(response)
    },
    async getDisCount(id){
      this.discountList = await DiscountService.getDiscountbyStore(id);
      this.discountAll =  await DiscountService.getAll();
      console.log(this.discountAll)
    },
    getDiscountName(id){
      let temp = ''
      console.log(id)
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
    }
  },
  created(){
    const id = this.$route.params.id;
    this.getStore(id);
    this.getComments(id);
    this.getDisCount(id);
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
