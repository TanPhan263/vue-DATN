<template>
  <CRow style="list-style-type:none">
     <CModal
      size="lg"
      title="Thêm Khuyến Mãi"
      :show.sync="primaryModal"
      color="primary"
      @update:show="closeModal"
    >
    <CRow>
    <CCol sm="8">
      <CInput
      label="Tên Khuyến mãi"
      v-model="discountName"
      />
    </CCol>
    <CCol sm="4">
      <p>Hình đại diện</p>
      <input type="file" @change="previewImage">
    </CCol>
    </CRow>
     </CModal>
      <CModal
      size="xl"
      title="Chỉnh sửa Khuyến Mãi"
      :show.sync="successModal"
      color="success"
      @update:show="closeModal"
      >
      <CRow>
      <CCol sm="4">
        <img class="imgBanner" :src="discountPicture" alt="">
        <input type="file" @change="previewImage">
      </CCol>
      <CCol sm="8">
      <CInput
        label="Tên Khuyến mãi"
        v-model="discountName"
        />
      <p>Thêm quán vào khuyến mãi</p>
      <div class="modal-body" style="height:300px;overflow-y:scroll;overflow-x:hidden">
            <div v-for="result in stores" v-bind:key="result.storeID" style=" width: 100%;
                text-align: left; display: flex; border-bottom: 1px solid darkgray;cursor: pointer;padding: 4px;">
                  <img :src="result.storePicture" height="100" class="left-thing" style="border-radius:5px;">
                  <div class="middle-thing" style="margin-left: 3px; height: 100%">
                    <p style="margin-top: 0px; height: 15%; font-weight: bold;">{{result.storeName}}</p>
                    <p style="margin-top: 0px;">{{result.storeAddress}}...</p>
                  </div>
                  <div class="right-thing">
                   	<i @click="addStoreToDiscount(result.storeID)" class="fa fa-plus-circle" style=" color: green;float: right; font-size: 20px; margin-bottom: 10px;"></i>
                  </div>
              </div>
				  </div>
      </CCol>
      </CRow>
      </CModal>
      <CModal
      :title="discountName"
      :show.sync="warningModal"
      color="warning">
      <div class="modal-body" style="height:400px;overflow:scroll">
            <div v-for="result in discountStore" v-bind:key="result.storeID" style=" width: 100%;
                text-align: left; display: flex; border-bottom: 1px solid darkgray;cursor: pointer;padding: 4px;">
                  <img :src="result.storePicture" height="100" class="left-thing" style="border-radius:5px;">
                  <div class="middle-thing" style="margin-left: 3px; height: 100%">
                    <p style="margin-top: 0px; height: 15%; font-weight: bold;">{{result.storeName}}</p>
                    <p style="margin-top: 0px;">{{result.storeAddress}}...</p>
                  </div>
                  <div class="right-thing">
                   	<i @click="removeStoreToDiscount(result.storeID)" class="fa fa-window-close" style=" color: red;float: right; font-size: 20px; margin-bottom: 10px;"></i>
                  </div>
              </div>
				</div>
      </CModal>
    <!-- <transition v-if="active" >
          <div class="modal-mask">
          <div class="modal-wrapper"  >
            <div class="modal-container" style="width: 600px;
            height: 600px;
            overflow: auto;">

            <div class="modal-header">
              <slot name="header">
              <h3>Edit Discount</h3>
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <CInput
                label="Tên Khuyến mãi"
                v-model="discountName"
                />
                <div class="row" style="margin-left: 0px;">
                </div>
                    <p>Hình đại diện</p>
                    <div class="row">
                      <img class="imgBanner" :src="discountPicture" alt="">
                      <input type="file" @change="previewImage">
                    </div>
                </slot>
            </div>

          <div class="modal-body" style="height:400px;overflow:scroll">
          <p>Thêm quán vào khuyến mãi</p>
            <div v-for="result in stores" v-bind:key="result.storeID" style=" width: 100%;
                text-align: left; display: flex; border-bottom: 1px solid darkgray;cursor: pointer;padding: 4px;">
                  <img :src="result.storePicture" height="100" class="left-thing" style="border-radius:5px;">
                  <div class="middle-thing" style="margin-left: 3px; height: 100%">
                    <p style="margin-top: 0px; height: 15%; font-weight: bold;">{{result.storeName}}</p>
                    <p style="margin-top: 0px;">{{result.storeAddress}}...</p>
                  </div>
                  <div class="right-thing">
                   	<i @click="addStoreToDiscount(result.storeID)" class="fa fa-plus-circle" style=" color: green;float: right; font-size: 20px; margin-bottom: 10px;"></i>
                  </div>
              </div>
				  </div>

                <div class="modal-footer">
                  <slot name="footer">
                  <button class="btn btn-danger" @click="isClose()">
                    Close
                  </button>
                   <button class="btn btn-primary" @click="onUpload">Edit</button>
                  </slot>
                </div>
                </div>
              </div>
              </div>
    </transition> -->
    <!-- <transition v-if="active2" >
             <div class="modal-mask">
              <div class="modal-wrapper"  >
                <div class="modal-container" style="
                overflow: auto;">
                <div class="modal-header">
                  <slot name="header">
                  <h3>Xác nhận xóa Khuyến mãi</h3>
                  </slot>
                </div>
                <div class="modal-footer">
                  <slot name="footer">
                   <button class="btn btn-danger" @click="active2=false">
                    Close
                  </button>
                   <button class="btn btn-primary" @click="deleteDiscount()">Delete</button>
                  </slot>
                </div>
                </div>
              </div>
            </div>
  </transition> -->
  <!-- <transition v-if="active3">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
				<div class="modal-header">
					<slot name="header">
					<h3>DANH SÁCH QUÁN</h3>
					</slot>
				</div>
			<div class="modal-body" style="height:400px;overflow:scroll">
            <div v-for="result in discountStore" v-bind:key="result.storeID" style=" width: 100%;
                text-align: left; display: flex; border-bottom: 1px solid darkgray;cursor: pointer;padding: 4px;">
                  <img :src="result.storePicture" height="100" class="left-thing" style="border-radius:5px;">
                  <div class="middle-thing" style="margin-left: 3px; height: 100%">
                    <p style="margin-top: 0px; height: 15%; font-weight: bold;">{{result.storeName}}</p>
                    <p style="margin-top: 0px;">{{result.storeAddress}}...</p>
                  </div>
                  <div class="right-thing">
                   	<i @click="removeStoreToDiscount(result.storeID)" class="fa fa-window-close" style=" color: red;float: right; font-size: 20px; margin-bottom: 10px;"></i>
                  </div>
              </div>
				</div>

				<div class="modal-footer">
					<slot name="footer">
					<button class="btn btn-danger" @click="active3=false">
						Close
					</button>
					</slot>
				</div>
				</div>
			</div>
			</div>
		</transition> -->
    <CCol  v-for="(discount,index) in discounts" v-bind:key="index" sm="6" lg="3" >
      <CWidgetDropdown class="widget_dropdown" style="background: #3c4b64" :text="discount.discountTypeName">
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end">
            <template #toggler-content>
              <CIcon name="cil-settings" />
            </template>
            <CDropdownItem @click="deleteDiscount(discount.discountTypeID)">Xóa</CDropdownItem>
            <CDropdownItem @click="discountClicked(discount.discountTypeID,discount.discountTypeName,discount.discountTypePicture)">Chỉnh sửa</CDropdownItem>
            <CDropdownItem @click="getDiscountStore(discount.discountTypeID)">Danh sách cửa hàng</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
            <img class="img-discount" v-lazy="discount.discountTypePicture">
        </template>
      </CWidgetDropdown>
    </CCol>
    <CCol sm="6" lg="3" @click="isCreate()">
         <CWidgetDropdown style="border:none; border-radius:0px;background: #3c4b64" >
        <template #default>
        </template>
        <template #footer>
           <div style="width: 100%; height:250px; background-color: transparent; float:right; border-radius: 5px;"><p class="center"><span class="fa fa-plus fl-right" style="color:white;"></span></p></div>
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import DiscountService from '@/services/DiscountService.js'
import StoreService from '@/services/StoreService.js'
import AuthService from '@/services/AuthService.js'
export default {
  beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
    data(){
        return{
            primaryModal: false,
            successModal: false,
            warningModal: false,
            stores:[],
            discounts: [],
            token: '',
            imageData: null,
            active: false, 
            // active2: false,
            // active3: false,
            discountID: '',
            discountName: '',
            discountPicture: null,
            create: false,
            // deleteID:'',
            discountStore: [],
            discountStoreID:''
        }
    },
    methods:{
        async getDiscounts(){
            this.discounts = await DiscountService.getAll();
        },
        async deleteDiscount(id){
            try {
            if(confirm('Bạn chắc chắn muốn xóa???')){
              const response = await DiscountService.deleteDiscount(id,this.token);
              this.getDiscounts();
              alert(response);
            // this.active2=false;
              }
            }
            catch(err){
              console.log(err);
            }
        },
        // getDeleteDiscount(id){
        //   this.deleteID = id;
        // },
        isCreate(){
          this.discountID = '';
          this.discountName ='';
          this.discountPicture = '';
          this.create= true;
          // this.active = true;
          this.primaryModal = true;
        },
        isClose(){
          this.create= false;
          // this.active = false;
        },
        previewImage(event){
          this.discountPicture=null;
          this.imageData= event.target.files[0];
        },
        onUpload(){
          if(this.imageData == null) this.submitDiscount();
          else{
            const storageRef = firebase.storage().ref(`image/comment/${this.imageData.name}`).put(this.imageData);
            storageRef.on(`state_change`, snapshot => {
            },error =>{console.log(error.message)},
            ()=> {
              storageRef.snapshot.ref.getDownloadURL().then((url) => {
                this.discountPicture = url;
                this.submitDiscount();
                })
              }
            )
          }
        },
        async submitDiscount(){
          try{
            const discount =  {
              discountTypeID: this.discountID,
              discountTypeName: this.discountName,
              discountTypePicture: this.discountPicture,
              storeID: "",
            };
            if(!this.create){
              const response = await DiscountService.editDitscount(this.discountID,discount,this.token);
              alert(response);
            }
            else{
              const response = await DiscountService.createDiscount(discount,this.token);
              alert(response);
              this.create= false;
            }
            this.getDiscounts();
          }
          catch(err){ console.log(err);}
        },
        discountClicked(id, name, picture){
          this.create = false;
          this.successModal = true;
          this.discountPicture= picture;
          this.discountName=name;
          this.discountID=id;
          this.getAddStore(id);
        },
        async addStoreToDiscount(id){
          try{
          const discount = {
              iDStore: id,
              iDDiscountType: this.discountID
          }
          const response = await DiscountService.addStoreToDiscount(discount,this.token);
          alert(response);
          }
          catch(err){console.log(err);}
        },
        async removeStoreToDiscount(idStore){
          try{
          const response = await DiscountService.removeStoreToDiscount(idStore,this.discountStoreID,this.token);
          this.getDiscountStore(this.discountStoreID);
          alert(response);
          }
          catch(err){
            alert('Lỗi rồi: ' + err)
          }
        },
        async getDiscountStore(id){
          this.discountStoreID = id;
          // this.active3=true;
          this.warningModal = true;
          this.discountStore = await DiscountService.getStore(id);
        },
        async getAddStore(id){
          let array = await StoreService.getAll();
          let array2 = await DiscountService.getStore(id);
          this.stores = array.filter(x => !array2.includes(x));
        },
        closeModal(status, evt, accept) { if (accept) { 
            this.onUpload();
         }
         else{
            this.discountID = '';
            this.discountName ='';
            this.discountPicture = '';
            this.create = false;
         }
        },
    },
    mounted(){
      this.token=localStorage.getItem('isAuthen');
      console.log(this.token)
      this.getDiscounts();
    }
}
</script>

<style>
@import url('../../../assets/css/comments.css');

.left-thing{
	width: 20%; 
}
.middle-thing{
	width: 70%;
	font-size: 13px;
}
.right-thing{
	width: 10%;
	float: right;
	text-align: right;
	font-size: 13px;
}

  .center_div{
  margin: 0 auto;
  width:100% /* value of your choice which suits your alignment */
}
.img-discount{
  height: 200px;
}
.imgBanner{
  margin-bottom: 10px;
  width: 100%;
}
.widget_dropdown{height:270px;
  border:none;border-radius:0px
}
.center{
  position: absolute;
  font-size: 70px;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>