<template>
  <CRow>
    <CModal
      title="Quản lý khuyến mãi"
      :show.sync="active2"
      color="primary">
    <CRow>
    <CCol sm="12">
    <CCard>
      <CCardHeader>
        <strong>Thêm khuyến mãi của website</strong>
      </CCardHeader>
      <CCardBody>
        <CRow v-for="(discount,index) in discountAdmin" v-bind:key="index" >
          <CCol style="padding: 5px;" sm="11"> <span class="fa fa-tag" style="font-size: 17px; color: red"></span>
            {{discount.discountTypeName}} 
          </CCol> 
          <CCol  v-if="checkRegisteredDiscount(discount.discountTypeID)" style="padding: 5px;" sm="1">
            <i @click="addStoreToDiscount(discount.discountTypeID)" class="fa fa-plus-circle" style="font-size: 20px;color:green;"></i>
          </CCol>
        </CRow>
      </CCardBody>
      </CCard>
      </CCol>
      </CRow>
    </CModal>
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
      <div v-if="status === '2'" class="alert-red">
            <div class="row">
              <div style="width: 100%">
              <h4>Quán này đang bị chặn</h4> <p>Nhấn để bỏ chặn</p>
                <CButton  @click="unBanStore()" style="margin-right: 20px" class="btn_left" type="submit" size="sm" color="warning"><CIcon name="cil-check-circle"/>Bỏ chặn</CButton>
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
        <CCardHeader style="font-weight: bold;">
          <CIcon name="cil-justify-center"/>
          <strong> Hình ảnh đại diện cửa hàng</strong>
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
           <CCol>
            <input id="files" type="file"  @change="previewImage">
          </CCOL>
        
         <h4 style="text-align: center; height: 50px"> {{storeName}}</h4>
          <CCardBody style="display: flex;
              justify-content: center;
              align-items: center;">
            <CButtonGroup  size="sm">
              <CButton @click="openChat" color="info">Nhắn tin</CButton>
              <CButton @click="unBanStore" v-if="status === '2'" color="danger">Bỏ chặn</CButton>
              <CButton @click="banStore" v-else color="danger">Chặn</CButton>
            </CButtonGroup>
            </CCardBody>
        </CCardBody>
        <CCardFooter>
          <CRow form class="form-group" style="float:right;">
            <CButton class="btn_left" color="danger" @click="goBack">Back</CButton>
           </CRow>
           <CRow form class="form-group" style="float:left;">
            <CButton class="btn_right" color="primary" @click="updateStore">Update</CButton>
           </CRow>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol col="12" lg="8">
      <CCard>
        <CCardHeader style="font-weight: bold;">
          THÔNG TIN QUÁN
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CRow>
                <CCol sm="4">
              <CInput
                label="Store ID"
                :value ="storeID"
                disabled
              />
                </CCol>
                <CCol sm="8">
              <CInput
                label="Tên quán"
                autocomplete="name"
                v-model="storeName"
              />
                </CCol>
              </CRow>
             <CRow style="margin-bottom: 20px">
               <CCol sm="6">
                <p>Chủ quán</p>
                <select v-if="users"
                    id="storeOwner"
                    style="width:100%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-top: -10px"
                    class="country fl_left"
                    vertical
                    v-model="storeOwner"
                    placeholder="Chủ quán"
                    >
                    <option v-for="(user, index) in users" v-bind:key="index" :value="user.userID">
                        {{user.userName}}
                    </option>
                </select>
                <p style="color:red" v-if="storeOwnerName.status === '-1'"> Tài khoản hiện chưa được xác nhận! <a :href="'/manage/users/'+storeOwnerName.userID"><strong>Đi đến tài khoản</strong></a></p>
               </CCol>
                <CCol sm="6">
                <p> Loại</p>
                <select
                  id="storeType"
                  style="width:100%;height:35px;border-radius:4px; border: 1px solid #D3D3D3;margin-top: -10px;"
                  class="country fl_left"
                  vertical
                  v-model="storeStype"
                  placeholder="Địa điểm"
                  >
                  <option v-for="busi in bussinessType" v-bind:key="busi.businessTypeID" :value="busi.businessTypeID">
                      {{busi.businessTypeName}}
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
                label="Giờ mở cửa"
                v-model="openTime"
              />
                 </CCol>
                  <CCol sm="4">
               <CInput
                label="Giờ đóng cửa"
                v-model="closeTime"
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
          <CCardHeader style="margin-top: -20px;font-weight: bold;">
          KINH ĐỘ VÀ VĨ ĐỘ CỦA QUÁN <div @click="active= !active" style="width: 30px; height: 30px; border: 2px solid black; border-radius: 50%; float: right;"><i style="margin-left: 5px;margin-top: 3px;  font-size: 20px;" class="fa fa-question"></i></div>
          </CCardHeader>
         <CCardBody>
            <CForm>
              <CRow>
                <CCol sm="6">
              <CInput
                label="Longtitude"
                v-model="storeLat"
              ></CInput>
                </CCol>
                 <CCol sm="6">
              <CInput
                label="Latitude"
                v-model="storeLong"
              ></CInput>
                 </CCol>
              </CRow>
            </CForm>
          </CCardBody>
      </CCard>
    </CCol>
    <CCol md="12">
      <CCard>
         <CCardHeader>
          <strong style="font-size: 25px">Khuyến mãi</strong>
            <CButton style="float: right" color="primary" @click="openAddDiscount">Thêm Khuyến mãi</CButton>
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

     <CCard>
       <CCardHeader>
          <strong style="font-size: 25px">Comments</strong>
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
     <ChatAdmin style="display: none"/>
  </CRow>
</template>

<script>
import StoreService from '@/services/StoreService'
import AuthService from '@/services/AuthService'
import UserService from '@/services/UserService'
import CommentService from '@/services/CommentService.js';
import DiscountService from '@/services/DiscountService.js';
import ChatAdmin from '../chat/chatAdmin.vue'
export default {
  beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'Store',
  components:{
    ChatAdmin
  },
  data () {
    return {
      discounts:[],               //danh sách tất cả khuyến mãi
      discountAdmin:[],           //danh sách khuyến mãi của website(admin tạo)
      discountList:[],            //danh sách khuyến mãi của quán
      bussinessType: '',          //danh sách loại quán
      active: false,              //biến mở modal kinh độ vĩ độ
      active2: false,             //biến mở modal thêm khuyến mãi
                                  //các thuộc tính của quán
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
      commentList: [],            //danh sách comments
      activePage: 1,
      users: [],                  //danh sách người dùng
    }
  },
   watch: {
    $route: {
      immediate: true,
      handler (route) {           //hàm thay đổi danh sách quán khi đổi trang trong bảng
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
    previewImage(event){ //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
      this.storePicture=null;
      this.imageData= event.target.files[0];
    },
    async addStoreToDiscount(id){//thêm quán vào khuyến mãi
      const discount = {          //tạo một đối tượng chứa id quán và id của khuyến mãi
          iDStore: this.storeID,
          iDDiscountType: id
      }
      //gọi api thêm mới 
      const response = await DiscountService.addStoreToDiscount(discount,localStorage.getItem('isAuthen'));
      alert(response);//thông báo kết quả
      this.getDisCount(this.storeID)//loại thông tin 
    },
    async removeStoreToDiscount(id){//xóa liên kêt giữa quán và khuyến mãi
      //gọi api xóa liên kết
      const response = await DiscountService.removeStoreToDiscount(this.storeID,id,localStorage.getItem('isAuthen'));
      this.getDisCount(this.storeID);
      alert(response);
    },
    goBack() { //trở về trang /store
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/store'})
    },
    async updateStore(){                        //cập nhật thông tin của  quán
      const id = this.$route.params.id          //tạo một đối tượng quán với dữ liệu người dùng nhập
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
        status: this.status.toString(),
        lat: this.storeLat,
        long: this.storeLong
      };
      const response = await StoreService.updateStore(id, store, localStorage.getItem('isAuthen'));//gọi api cập nhật thông tin của quán
      alert(response);                                                                              //thông báo kết quả
    },
    getStoreOwner() {                                                                               //lấy thông tin của chủ quán
      this.$http.get('https://api.viefood.info/api/User/GetByID?id='+this.storeOwner,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.storeOwnerName = response.data[0];
      })
    },
    async getComments(index){                                                                        //lấy danh sách comment của quán
			try{
				this.commentList = await CommentService.getCommentByStore(index);
			}
			catch{}
		},
    async getDisCount(id){                                                                            //lấy danh sách khuyến mãi của quán
      this.discountList = await DiscountService.getDiscountbyStore(id);
    },
    getDiscountName(id){                                                                              //lấy tên của khuyến mãi theo id
      let temp = ''
      this.discounts.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    async getDiscounts(){                                                                             //lấy danh sách tất cả khuyến mãi
      this.discounts = await DiscountService.getAll();
      this.discountAdmin = await DiscountService.getByAdmin();
    },
    checkRegisteredDiscount(id){                                                                   //kiểm tra khuyến mãi đã có trong món hay chưa
      for(var i =0 ; i< this.discountList.length;i++){
        if(this.discountList[i].idDiscountType == id)
          return false;                                                                           //return false nếu đã có 
      }
      return true;
    },
    openAddDiscount(){                                                                                 //mở hộp thoại thêm khuyến mãi
      this.active2=true;
      this.getDiscounts();
    },
    // rowClicked (item) {
    //   this.$router.push({path: `store/${item.storeID}`})
    // },
    // pageChange (val) {
    //   this.$router.push({ query: { page: val }})
    // },
    async onInit(){                                                               
      this.users = await UserService.getAll(localStorage.getItem('isAuthen')); //lấy danh sách người dùng
    },
    async confirmStore(){                                                      //hàm kích hoạt quán
      try{
        if(this.storeOwner != ''){
          const id = this.$route.params.id;
          const responseStore =  await StoreService.changeStatus(localStorage.getItem('isAuthen'), '1', id);     //gọi api kích hoạt quán
          const responseOwner =  await UserService.block(localStorage.getItem('isAuthen'), this.storeOwner, '1');//gọi api kích hoạt tài khoản chủ quán
          alert(responseStore);                                                                                  //thông báo kết quả
          this.$router.go();
        }
      }
      catch{
      }
    },
    async unBanStore(){                                                       //hàm hủy chặn quán
      try{
        if(this.storeOwner != ''){
          const id = this.$route.params.id;
          const responseStore =  await StoreService.changeStatus(localStorage.getItem('isAuthen'), '1', id);//gọi api kích hoạt quán
          alert(responseStore);                                                                              //thông báo kết quả
          this.$router.go();
        }
      }
      catch{
      }
    },
    async banStore(){                                                        //hàm chặn quán               
      try{
        if(this.storeOwner != ''){
          const id = this.$route.params.id;
          const responseStore =  await StoreService.changeStatus(localStorage.getItem('isAuthen'), '2', id);//gọi api chặn quán
          alert(responseStore);                                                                              //thông báo kết quả
          this.$router.go();
        }
      }
      catch{
      }
    },
    async deleteStore(){                                                    //hàm chặn quán  
      try{
        if(confirm('Bạn chắc chắn muốn xóa')){
          const id = this.$route.params.id;
          const response = await StoreService.delete(id,localStorage.getItem('isAuthen'))//gọi api chặn quán
          alert(response);                                                               //thông báo kết quả
          this.$router.push("/manage/confirmstore");                                     //trở về trang xác nhận quán
        }
      }
      catch{}
    },
    async deleteComment(id){                                                  //hàm xóa bình luận
      if(confirm('Bạn chắc muốn xóa bình luận này?')){
        const response = await CommentService.deleteCommentAdmin(id,localStorage.getItem('isAuthen'));//gọi api xóa bình luận
        alert(response);
      }
    },
    openChat(){                                                                                       //hàm chuyển đến trang chat 
      this.$router.push('/manage/chats')
      this.$root.$refs.chatAdmin.createInbox(this.storeID, this.storeName,this.storePicture,this.storeOwner);//gọi hàm tạo inbox mới ở component chatAdmin
    }
  },
   mounted(){
      const id = this.$route.params.id
      //lấy thông tin quán thông qua id
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
            this.getStoreOwner();                           //lấy thông tin chủ quán
            this.getComments(this.storeID)                  //lấy danh sách comments             
    });
     this.onInit();
      this.getDiscounts();
     this.getDisCount(id);                                  //lấy danh sach khuyến mãi của quán
     this.$http.get('https://api.viefood.info/api/BusinessType/GetAll').then(response => {//lấy danh sách loại quán
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
