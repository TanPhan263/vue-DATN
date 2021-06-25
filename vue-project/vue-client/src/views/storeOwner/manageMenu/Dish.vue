<template>
  <CRow>
    <transition v-if="active">
		  <div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
				<div class="modal-header">
					<slot name="header">
					<h3>DANH SÁCH KHUYẾN MÃI</h3>
					</slot>
				</div>

			<div class="modal-body" style="height:200px;overflow:scroll">
            <div class="res-common-minmaxprice"  v-if="discountAll">
              <span v-for="(discount,index) in discountAll" v-bind:key="index" style="width:100%;border: 1px solid green; margin-right: 5px; padding: 5px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"></span>
               	{{discount.discountTypeName}}<i @click="addDiscount(discount.discountTypeID)" class="fa fa-plus-circle" style="font-size: 20px;margin-top: 7px; color:green"></i> <br></span>
            </div>
				</div>

				<div class="modal-footer">
					<slot name="footer">
					<button class="btn btn-danger" @click="active=false">
						Close
					</button>
          
					</slot>
				</div>
				</div>
			</div>
			</div>
		</transition>
       <CCol md="6">
        <CCard>
          <CCardHeader>
            <strong>Thông tin món ăn</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
              disabled
                label="ID"
                horizontal
                v-model="dishID"
              />
              <CInput
                label="Tên món"
                horizontal
                autocomplete="name"
             v-model="dishName"
              />
              <CInput
             v-model="dishPrice"
                label="Giá"
                horizontal
              />
              <div class="row" style="margin-left: 0px;">
              </div>
            </CForm>
          </CCardBody>
          <CCardFooter>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol md="6">
        <CCard>
          <CCardBody>
            <CForm>
                <div class="center_div">
                <img
                   :src="dishPicture" height="200px" width="470px"
                />
                </div>
            </CForm>
            <input type="file"  @change="previewImage" style="margin-top: 20px;">
          </CCardBody>
          <CCardFooter>
      
            <CRow form class="form-group" style="float:right;">
              <CButton @click="deleteDish()"  class="btn_left" type="submit" size="sm" color="danger"><CIcon name="cil-check-circle"/> Delete</CButton>
            </CRow>
            <CRow form class="form-group" style="float:left;">
            <CButton  @click="onUpload"  class="btn_right" type="reset" size="sm" color="warning"><CIcon name="cil-ban"/> Update</CButton>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
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
            <div class="res-common-minmaxprice"  v-if="dishDiscountList">
              <span v-for="(discount,index) in dishDiscountList" v-bind:key="index" style="border: 1px solid red; margin-right: 5px; padding: 3px;"><span  class="fa fa-tag" style="font-size: 17px; color: red"> {{getDiscountName(discount.dishcountTypeID)}}</span>
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
      active: false,
      dishTypes:[],
      imageData: null,
      dishName:'',
      dishID: '',
      dishPrice:'',
      dishPicture:null,
      dishType_ID:'',
      dishType_Name:'',
      dishDiscountList:[],
      discountAll:[]
    }
  },
  mounted(){
     const id = this.$route.params.id;
     this.getDishInfor(id);
     this.getDisCount(id)
  },
  methods:{
    async getDishInfor(id){
      const dishOpened = await StoreService.getDishByID(id);
      this.dishName = dishOpened[0].dishName;
      this.dishID = dishOpened[0].dish_ID;
      this.dishPrice = dishOpened[0].dishPrice;
      this.dishPicture = dishOpened[0].dishPicture;
      this.dishType_ID = dishOpened[0].dishType_ID;
      // this.getType(this.dishType_ID)
    },
    async updateDish()
    {
      try{
        const dish = {
          dishID : this.dish_ID,
          dishName : this.dishName,
          dishPrice : this.dishPrice,
          dishPicture : this.dishPicture,
          dishType_ID : this.dishType_ID,
        }
        const response = await StoreService.updateDish(this.$route.params.id, dish, localStorage.getItem('isAuthen'))
        alert(response)
      }
      catch(err){
        console.log(err)
      }
    },
    async deleteDish(){
       if(confirm("Bạn chắc chắn muốn xóa???")){
         const response  = await StoreService.deleteDish(this.$route.params.id)
         alert(response);
         this.$router.go(-1)
      }
    },
      previewImage(event){
        this.dishPicture=null;
        this.imageData= event.target.files[0];
      },
      onUpload(){
        try{
          this.dishPicture= null;
          const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
          storageRef.on(`state_change`, snapshot => {
          },error =>{console.log(error.message)},
          ()=> {
            storageRef.snapshot.ref.getDownloadURL().then((url) => {this.dishPicture=url;
              this.updateDish();})
            }
          )
        }
        catch(err){
          console.log(err);
        }
      
      },
      // getType(index){
      //   this.$http.get('https://api.viefood.info/api/DishType/GetAll').then(response => {this.dishTypes=response.data});
      //   this.dishTypes.forEach(element => {
      //     if(element.dishType_ID==index)
      //     {
      //       this.dishType_Name = element.dishyTypeName;
      //     }
      //   });
      // },
      openAddDiscount(){
        this.active=true;
      },
      async getDisCount(id){
        try{
        this.discountAll =  await DiscountService.getAll();
        this.dishDiscountList =  await DiscountService.getDishDiscounts(id);
        }
        catch(err){console.log(err)}
      },
      async addDiscount(id){
        try{
        const discount = {
            DishcountTypeID: id,
            DishID:this.dishID,
            StoreID: this.storeID
        }
        const response = await DiscountService.addDishDiscount(discount,localStorage.getItem('isAuthen'));
        alert(response);
        this.getDisCount(this.dishID);
        }
        catch{}
      },
      async removeDiscount(id){
        try{
          if(confirm("Bạn chắc chắn muốn xóa???")){
          const response = await DiscountService.removeDishDiscount(id,localStorage.getItem('isAuthen'));
          this.getDisCount(this.storeID);
          alert(response);
        }
        else return;
        }
        catch(err){console.log(err)}
      },
      getDiscountName(id){
      let temp = ''
      this.discountAll.forEach(element => {
        if(element.discountTypeID == id)
          temp = element.discountTypeName;
      });
      return temp;
    },
  }
}
</script>

<style>
@import url('../../../assets/css/dialog.css');
</style>