<template>
  <CRow>
    <CModal
      title="Kinh độ và vĩ độ của quán"
      :show.sync="latLngModal"
      color="info">
      Nhằm lấy được tọa độ quán ăn của bạn để thực hiện tính khoảng cách<br>
      Nhấn vào link dưới đây để lấy tọa độ quán ăn online:
      <a href="https://www.latlong.net/" target="_blank">https://www.latlong.net/</a>
    </CModal>
    <CModal
      title="Quản lý khuyến mãi"
      :show.sync="addDiscountModal"
      color="primary"
      size="lg">
    <CRow>
    <CCol sm="6">
    <CCard>
      <CCardHeader>
        <strong>Thêm khuyến mãi của website</strong>
      </CCardHeader>
      <CCardBody>
        <CRow v-for="(discount,index) in discountAdmin" v-bind:key="index" >
          <CCol style="padding: 5px;" sm="10"> <span class="fa fa-tag" style="font-size: 17px; color: red"></span>
            {{discount.discountTypeName}} 
          </CCol> 
          <CCol style="padding: 5px;" v-if="checkRegisteredDiscount(discount.discountTypeID)" sm="1">
            <i @click="addStoreToDiscount(discount.discountTypeID)" class="fa fa-plus-circle" style="font-size: 20px;color:green;"></i>
          </CCol>
        </CRow>
      </CCardBody>
      </CCard>
      </CCol>
      <CCol sm="6">
      <CCard>
        <CCardHeader>
          <strong>Khuyến mãi của riêng quán</strong>
        </CCardHeader>
        <CCardBody>
            <CRow v-for="(discount,index) in discountOwner" v-bind:key="index" style="padding: 5px;">
            <CCol sm="10"> <span class="fa fa-tag" style="font-size: 17px; color: red"></span>
                  {{discount.discountTypeName}} </CCol> 
            <CCol sm="1"><i @click="deleteDiscount(discount.discountTypeID)" class="fa fa-times" style="font-size: 20px;color:red;"></i>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      </CCol>
      </CRow>
      <CRow>
        <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Tạo khuyến mãi cho riêng quán của bạn</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
            <CCol sm="4">
              <CInput
              label="Tên Khuyến mãi"
               placeholder="Giảm giá 20%"
               v-model="discountTypeName"
              />
              <input type="file" @change="previewImage">
            </CCol>
            <CCol sm="8">
              <CTextarea
                label="Nội dung"
                placeholder="Mừng khai trương giảm giá 20%"
                rows="3"
                v-model="discountTypeDecripts"/>
            </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton @click="onUpload" style="float:right" color="primary">Tạo mới</CButton>
          </CCardFooter>
        </CCard>
        </CCol>
      </CRow>
    </CModal>
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
    <!-- <transition v-if="active">
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
		</transition> -->

     <!-- <transition v-if="active2">
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
		</transition> -->
    <CCol md="4">
      <CCard>
        <CCardHeader>
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
           <!-- <CRow form class="form-group" style="margin-top: 50px;">
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
          </CRow> -->
          <div class="row">
          <label for="files" class="btn">Select Image</label>
          <input id="files" type="file"  @change="previewImage">
          </div>
        </CCardBody>
        <CCardFooter>
          <CButton style="float:right" color="danger" @click="goBack">Back</CButton>
          <CButton color="primary" @click="onUpload">Update</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol col="12" lg="8">
      <CCard>
        <CCardHeader>
         <strong>THÔNG TIN QUÁN</strong> 
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CRow>
                <CCol sm="8">
              <CInput
                label="Tên quán"
                v-model="storeName"
                autocomplete="name"
              />
                </CCol>
               <CCol sm="4">
              <p style="margin-right: 55px;">Loại quán</p>
                    <select
                        style="width:100%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;margin-top: -10px; color: grey;"
                        class="country fl_left"
                        vertical
                        v-model="storeStype"
                        placeholder="Loại món ăn"
                        >
                        <option>Loại quán ăn</option>
                        <option v-for="dish in type" v-bind:key="dish.businessTypeID" :value="dish.businessTypeID">
                            {{dish.businessTypeName}}
                        </option>
                    </select>
              </CCol>
              </CRow>
              <CInput
                label="Địa chỉ"
                v-model="storeAddress"
              ></CInput>
              <CRow>
                <CCol sm="4">
              <CInput
              v-model="openTime"
                label="Giờ mở cửa"
              />
              </CCol>
              <CCol sm="4">
              <CInput
               v-model="closeTime"
                label="Giờ đóng cửa"
              />
              </CCol>
              <CCol sm="4">
              <CInput
              disabled
              label="Rating"
              v-model="storeRate"
              />
              </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        <CCardHeader style="font-weight: bold;">
          KINH ĐỘ VÀ VĨ ĐỘ CỦA QUÁN <div @click="latLngModal = true" style="width: 30px; height: 30px; border: 2px solid black; border-radius: 50%; float: right;"><i style="margin-left: 5px;margin-top: 3px;  font-size: 20px;" class="fa fa-question"></i></div>
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CRow>
                <CCol sm="6">
              <CInput
                label="Longtitude"
                horizontal
                v-model="storeLat"
              ></CInput>
                </CCol>
                <CCol sm="6">
              <CInput
                label="Latitude"
                horizontal
                v-model="storeLong"
              ></CInput>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
      </CCard>
    </CCol>
    <CCol md="12">
      <CCard class="center_div" style="padding:20px; margin-bottom: 20px">
         <CCardHeader>
            <div class="row" style="float:left;">
            <h2>Khuyến mãi</h2> 
          </div>
          <div class="row" style="float:right;">
            <CButton color="primary" @click="openAddDiscount">Quản lý khuyến mãi</CButton>
          </div>
          
         </CCardHeader>
         <CCardBody>
            <div class="res-common-minmaxprice"  v-if="discountList">
              <span v-for="(discount,index) in discountList" v-bind:key="index" style="border: 1px solid red; margin-right: 5px; padding: 3px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"> {{getDiscountName(discount.idDiscountType)}}</span>
               	<i @click="removeStoreToDiscount(discount.idDiscountType)" class="fa fa-window-close" style="font-size: 20px;margin: 0 0 0 5px"></i>  </span>
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
    AuthService.checkUser(localStorage.getItem('isAuthen'));//kiểm tra có đăng nhập hay không
    AuthService.checkStoreOwner(localStorage.getItem('isAuthen'));//kiểm tra có phải chủ quán không
    next();
  },
  name: 'manageStore',
  components:{
    MangeMenu
  },
  data () {
    return {
      addDiscountModal: false,        //mở hộp thoại quản lý khuyến mãi
      latLngModal: false,             //mở hộp thoại latlng
      isAddDiscount: false,           //biến xác định là đang thêm khuyến mãi
      //thuộc tính của khuyến mãi
      discountTypeName:'',            
      discountTypePicture:null,
      discountTypeDecripts:'',
      discounts:[],                   //danh sách tất cả khuyến mãi
      discountList:[],                //khuyến mãi của quán
      discountOwner:[],               //khuyến mãi của chủ quán tạo
      discountAdmin:[],               //khuyến mãi do admin tạo
      commentList: [],                //danh sách bình luận
      type: [],                       //danh sách loại quán
      user: '',                       //thông tin của người dùng
      //thuộc tính cuả quán
      menuID: '',
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
      status : '',
    }
  },
  methods: {
    async addStoreToDiscount(id){ //thêm quán vào khuyến mãi sau khi thêm thì trang chi tiết của quán sẽ có khuyến mãi này
      const discount = {          //tạo một đối tượng khuyến mãi chứa id quán và id loại khuyến mãi
          iDStore: this.storeID,
          iDDiscountType: id
      }
      const response = await DiscountService.addStoreToDiscount(discount,localStorage.getItem('isAuthen'));//gọi api thêm quán vào khuyến mã
      alert(response);                                                                                     //thông báo kết quả
      this.getDisCount(this.storeID);                                                                      //load lại khuyến mãi
    },
    async removeStoreToDiscount(id){                                                                       //xóa quán khỏi khuyến mãi
      if(confirm('Bạn chắc chắn muốn xóa???')){                                                            
        const response = await DiscountService.removeStoreToDiscount(this.storeID,id,localStorage.getItem('isAuthen'));//gọi api xóa quán ra khỏi khuyến mãi hiện tai
        this.getDisCount(this.storeID);
        alert(response);
      }
    },
    async getComments(index){                     //lấy danh sách bình luận của quán
			try{
				this.commentList = await CommentService.getCommentByStore(index);
			}
			catch{}
		},
    getmenuID(){
      alert(this.menuID);
      return this.menuID;
    },
    goBack() {//trở về trang quản lý quán
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/manage/managestores'})
    },
    async getStore(id){                     //lấy thông tin quán
      this.type = await StoreService.getAllBussinessType();//lấy danh sách loại quán
      this.discounts = await DiscountService.getAll();     //lấy danh sách tất cả khuyến mãi
      var storeOpened = await StoreService.getByID(id);     
      this.menuID = storeOpened[0].menuID;                 //gán thông tin quán vao các biến
      this.storeName =  storeOpened[0].storeName; 
      this.storeAddress =  storeOpened[0].storeAddress;
      this.storePicture =  storeOpened[0].storePicture;
      this.storeProvince =  storeOpened[0].provinceID;
      this.storeRate =  storeOpened[0].ratePoint;
      this.storeStype =  storeOpened[0].businessTypeID;
      this.storeOwner =  storeOpened[0].userID;
      this.openTime =  storeOpened[0].openTime;
      this.closeTime =  storeOpened[0].cLoseTime;
      this.storeID =   storeOpened[0].storeID;
      this.storeLat = storeOpened[0].lat;
      this.storeLong = storeOpened[0].long;
      this.status = storeOpened[0].status;
      // if(this.storeOpened[0].status == '1') this.check == false;
      //         else this.check = true;
      if(this.storeRate == null || this.storeRate == 'NaN' ) this.storeRate = 0;
    },
    previewImage(event){                                //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
      this.imageData= event.target.files[0];
    },
    onUpload(){
      if(this.imageData == null)                         //nếu không có hình ảnh 
      {
        if(this.isAddDiscount)                            //đang mở hộp thoại quản lý khuyến mãi
          this.createStoreDiscount();                     //tạo khuyến mãi mới
        else this.updateStore();                          //nếu không thì update quán
      }
      else{
        const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);//tải ảnh lên firebase
        storageRef.on(`state_change`, snapshot => {
        },error =>{console.log(error.message)},
        ()=> {
          storageRef.snapshot.ref.getDownloadURL().then((url) => {//trả về url của ảnh
            if(this.isAddDiscount)                                //nếu đang thêm khuyến mãi
            {
                this.discountTypePicture = url;                   //gán url vào hình ảnh của khuyến mãi
                this.createStoreDiscount();                       //tạo khuyến mãi mới
            }
            else {
              this.storePicture=url;                              //nếu thông thì gán url vào ảnh của quán
              this.updateStore();                                 //update quán
            }
            })
          }
        )
      }
    },
    async updateStore(){                                         //hàm update quán
      // if(this.check == true) this.status = '2';
      //     else this.status = '1';
      const id = this.$route.params.id
      const store ={                                             //tạo một đối tượng quán với dữ liệu người dùng nhập
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
      const response = await StoreService.updateStore(id, store, localStorage.getItem('isAuthen')); //gọi api cập nhật thông tin của quán
      alert(response)                                                                               //thông báo kết quả
    },
    async getDisCount(id){                                                                          //lấy danh sách khuyến mãi của quán
      this.discountList = await DiscountService.getDiscountbyStore(id);                             //lấy danh sách khuyến mãi của quán theo id
      this.discountOwner =  await DiscountService.getByOwner(id);                                   //lấy danh sách khuyến mãi quán tạo
      this.discountAdmin =  await DiscountService.getByAdmin();                                     //lấy danh sách khuyến mãi của admin tạo
    },
    getDiscountName(id){                                                                            //lấy tên của khuyến mãi theo id
      let temp = ''
      this.discounts.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    // async getDiscounts(){
    //   this.discounts = await DiscountService.getAll();
    // },
    openAddDiscount(){                                                                              //mở hộp thoại thêm khuyến mãi
      this.isAddDiscount = true;
      this.addDiscountModal= true;
      this.discountTypePicture = null;                                                              //set các biến thuộc tính của khuyến mãi
      this.discountTypeDecripts = '';
      this.discountTypeName = '';
      //this.getDiscounts();
    },
    checkRegisteredDiscount(id){                                                                   //kiểm tra khuyến mãi đã có trong món hay chưa
      for(var i =0 ; i< this.discountList.length;i++){
        if(this.discountList[i].idDiscountType == id)
          return false;                                                                           //return false nếu đã có 
      }
      return true;
    },
    async createStoreDiscount(){                                                                  //tạo khuyến mãi mới
      const discount = {                                                                          //tạo đối tượng khuyến mãi với dữ liệu người dùng nhập vào
        discountTypeID: "",
        discountTypeName: this.discountTypeName,
        discountTypePicture: this.discountTypePicture,
        discountRule: "",
        content: this.discountTypeDecripts
      }
      //gọi api tạo khuyến mãi mới của riêng quán
      const response = await DiscountService.createDiscountOwner(this.storeID,discount,localStorage.getItem('isAuthen'));
      alert(response);//thông báo kết quả
      this.getDisCount(this.storeID);//load lại thông tin
      //reset các biến
      this.isAddDiscount = false;
      this.discountTypePicture = null;
      this.discountTypeDecripts = '';
      this.discountTypeName = '';
    },
    async deleteDiscount(id){//xóa khuyến mãi do owner tạo
      try {
      if(confirm('Bạn chắc chắn muốn xóa???')){
        //gọi api xóa khuyến mãi
        const response = await DiscountService.deleteDiscount(id,localStorage.getItem('isAuthen'));
        this.getDisCount(this.storeID);//load lại thông tin
        alert(response);//thông báo kết quả
        }
      }
      catch(err){
        console.log(err);
      }
    },
    previewImage(event){  //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
      this.imageData= event.target.files[0];
    },
  },
  created(){
    const id = this.$route.params.id;
    this.getStore(id);//lấy thông tin quán
    this.getComments(id);//lấy danh sách bình luận
    this.getDisCount(id);//lấy danh sách khuyến mãi
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
