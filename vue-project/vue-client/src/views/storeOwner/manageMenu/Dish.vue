<template>
  <CRow>
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
            <i @click="addDiscount(discount.discountTypeID)" class="fa fa-plus-circle" style="font-size: 20px;color:green;"></i>
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
            <CCol sm="9"> <span class="fa fa-tag" style="font-size: 17px; color: red"></span>
                {{discount.discountTypeName}} </CCol> 
            <CCol v-if="checkRegisteredDiscount(discount.discountTypeID)" sm="1">
            <i @click="addDiscount(discount.discountTypeID)" class="fa fa-plus-circle" style="font-size: 20px;color:green;"></i>
            </CCol>
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
    <CCol md="4">
        <CCard>
          <CCardBody>
            <CForm>
                <div class="center_div">
                <img
                  :src="dishPicture" style="width:100%"
                />
                </div>
            </CForm>
            <input type="file"  @change="previewImage" style="margin-top: 20px;">
          </CCardBody>
        </CCard>
      </CCol>
       <CCol md="8">
        <CCard>
          <CCardHeader>
            <strong style="font-size: 20px;">Thông tin món ăn</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
               <CRow>
              <CCol sm="12">
              <CInput
              disabled
                label="ID"
                v-model="dishID"
              />
              </CCol>
               </CRow>
              <CRow>
              <CCol sm="6">
              <CInput
                label="Tên món"
                v-model="dishName"
              />
                </CCol>
              <CCol sm="6">
              <CInput
              v-model="dishPrice"
                  label="Giá"
                />
                 </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CRow form class="form-group" style="float:right;">
            <CButton @click="deleteDish()" type="submit" size="sm" color="danger"><CIcon name="cil-check-circle"/> Delete</CButton>
            </CRow>
            <CRow form class="form-group" style="float:left;">
            <CButton  @click="onUpload" type="reset" size="sm" color="warning"><CIcon name="cil-ban"/> Update</CButton>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
      
       <CCol md="12">
      <CCard>
         <CCardHeader>
         <strong style="font-size: 20px"> Khuyến mãi</strong>
            <CButton style="float:right" color="primary" @click="openAddDiscount">Thêm Khuyến mãi</CButton>
         </CCardHeader>
         <CCardBody>
            <div class="res-common-minmaxprice"  v-if="discountList">
              <span v-for="(discount,index) in discountList" v-bind:key="index" style="border: 1px solid red; margin-right: 5px; padding: 3px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"> {{getDiscountName(discount.dishcountTypeID)}}</span>
               	<i @click="removeDiscount(discount.discountDishID)" class="fa fa-window-close" style="font-size: 20px;"></i>  </span>
            </div>
         </CCardBody>
      </CCard>
     </CCol>
    </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import StoreService from '@/services/StoreService.js';
import AuthService from '@/services/AuthService.js';
import DiscountService from '@/services/DiscountService.js';
export default {
   beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'));
    AuthService.checkStoreOwner(localStorage.getItem('isAuthen'));
    next();
  },
  data(){
    return{
      //dish information
      imageData: null,
      dishName:'',
      dishID: '',
      dishPrice:'',
      storeID:'',
      dishPicture:null,
      //discount
      addDiscountModal:false, //biến mở modal Khuyến mãi
      discounts:[], //danh sách tất cả discount
      discountList:[], //danh sách discount của món ăn
      discountOwner:[], //danh sách discount của quán
      discountAdmin:[],//danh sách discount của website
      //thông tin discount đang xử lý
      discountTypeName:'',
      discountTypePicture:null,
      discountTypeDecripts:'',
    }
  },
  mounted(){
     const id = this.$route.params.id;// lấy id của món ăn
     this.getDishInfor(id);
  },
  methods:{
    async getDishInfor(id){                                   //Lấy thông tin của món ăn
      const dishOpened = await StoreService.getDishByID(id);
      this.discounts = await DiscountService.getAll();        //lấy thông tin tất cả khuyến mãi
      this.dishName = dishOpened[0].dishName;
      this.dishID = dishOpened[0].dish_ID;
      this.dishPrice = dishOpened[0].dishPrice;
      this.dishPicture = dishOpened[0].dishPicture;
      this.storeID = dishOpened[0].store_ID;
      this.getDisCount(this.$route.params.id);                //lấy danh sách khuyến mãi của món 
    },
    async updateDish() //hàm update món ăn
    {
      try{
        const dish = { //dữ liệu truyền vào để update
          dish_ID : this.dish_ID,
          dishName : this.dishName,
          dishPrice : this.dishPrice,
          dishPicture : this.dishPicture,
          store_ID: this.storeID,
        }
        const response = await StoreService.updateDish(this.$route.params.id, dish, localStorage.getItem('isAuthen'))
        alert(response)           //thông báo sau khu update xong 
      }
      catch(err){
        console.log(err)
      }
    },
    async deleteDish(){           //Hàm xóa món ăn
       if(confirm("Bạn chắc chắn muốn xóa???")){
         const response  = await StoreService.deleteDish(this.$route.params.id)
         alert(response);
         this.$router.go(-1);
      }
    },
    previewImage(event){        //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
      this.imageData= event.target.files[0];
    },
    onUpload(){
      try{
        if(this.imageData == null)                                //nếu không có hình ảnh 
        {
          if(this.addDiscountModal)                               //đang mở hộp thoại quản lý khuyến mãi
            this.createStoreDiscount();                           //tạo khuyến mãi mới
          else this.updateDish();                                 //nếu không thì update món ăn
        }
        else{
          const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData); //tải ảnh lên firebase
          storageRef.on(`state_change`, snapshot => {
          },error =>{console.log(error.message)},
          ()=> {
            storageRef.snapshot.ref.getDownloadURL().then((url) => {//trả về url của ảnh
              if(this.addDiscountModal){                            //nếu đang thêm khuyến mãi
                this.discountTypePicture = url;                     //gán url vào hình ảnh của khuyến mãi
                this.createStoreDiscount();                         //tạo khuyến mãi mới
              }
              else
              {
                this.dishPicture=url;                               //nếu thông thì gán url vào ảnh của món ăn
                this.updateDish();                                  //update món ăn
              }
              })
            }
          )
        }
      }
      catch(err){
        console.log(err);
      }
    },
    async createStoreDiscount(){                                    //tạo khuyến mãi mới
      const discount = {                                            //tạo đối tượng khuyến mãi với dữ liệu người dùng nhập vào
        discountTypeID: "", 
        discountTypeName: this.discountTypeName,
        discountTypePicture: this.discountTypePicture,
        discountRule: "",
        content: this.discountTypeDecripts
      }
      //gọi api tạo khuyến mãi mới của riêng quán
      const response = await DiscountService.createDiscountOwner(this.storeID,discount,localStorage.getItem('isAuthen'));
      alert(response);//thông báo kết quả
      this.getDisCount(this.$route.params.id);//tải lại khuyến mãi
      this.discountTypePicture = null;        //reset các biến
      this.discountTypeDecripts = '';
      this.discountTypeName = '';
    },
    openAddDiscount(){                        //mở hộp thoại quản lý khuyến mãi
      this.addDiscountModal= true;
      this.discountTypePicture = null;
      this.discountTypeDecripts = '';
      this.discountTypeName = '';
    },
    async getDisCount(id){                    //lấy khuyến mãi của món ăn, của admin, và của quán
      try{
        this.discountList = await DiscountService.getDishDiscounts(id);       //lấy khuyến mãi của món ăn
        this.discountOwner =  await DiscountService.getByOwner(this.storeID); //lấy khuyến mãi của quán
        this.discountAdmin =  await DiscountService.getByAdmin();             //lấy khuyến mãi của admin
      }
      catch(err){console.log(err)}
    },
    async addDiscount(id){                                                    //thêm khuyến mãi vào món ăn
      try{
      const discount = {                                                        //tạo đói tượng discount gồm id món ăn id quan và id loại khuyến mãi
          DishcountTypeID: id,
          DishID:this.dishID,
          StoreID: this.storeID
      }
      const response = await DiscountService.addDishDiscount(discount,localStorage.getItem('isAuthen'));  //gọi api thêm món ăn vào khuyến mãi
      alert(response);                                                                                    //thông báo kết quả
      this.getDisCount(this.dishID);                                                                      //load lại khuyến mãi
      }
      catch{}
    },
    async deleteDiscount(id){                                                  //hàm xóa khuyến mãi                   
    try {
    if(confirm('Bạn chắc chắn muốn xóa???')){
      const response = await DiscountService.deleteDiscount(id,localStorage.getItem('isAuthen'));//gọi api xóa khuyến mãi
      this.getDisCount(this.$route.params.id);                                                   //tải lại khuyến mãi
      alert(response);                                                                           //thông báo kết quả
      }
    }
    catch(err){
      console.log(err);
      }
    },
    async removeDiscount(id){                                                  //hàm xóa khuyến mãi ra khỏi món 
      try{
        if(confirm("Bạn chắc chắn muốn xóa???")){
        const response = await DiscountService.removeDishDiscount(id,localStorage.getItem('isAuthen'));//gọi api remove khuyến mãi
        this.getDisCount(this.$route.params.id);                                                       //load lại khuyến mãi
        alert(response);                                                                               //thông báo kết quả
      }
      else return;
      }
      catch(err){console.log(err)}
    },
    getDiscountName(id){                                                    //lấy tên của khuyến mãi theo id
      let temp = ''
      this.discounts.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
    checkRegisteredDiscount(id){                                          //kiểm tra khuyến mãi đã có trong món hay chưa
      for(var i =0 ; i< this.discountList.length;i++){
        if(this.discountList[i].dishcountTypeID == id)
          return false;                                                   //return false nếu đã có 
      }
      return true;
    },
  }
}
</script>

<style>
@import url('../../../assets/css/dialog.css');
</style>