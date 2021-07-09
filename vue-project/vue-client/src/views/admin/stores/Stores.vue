<template>
  <CRow>
    <CCol >
      <CCard class="center_div">
        <CCardHeader>
            <strong style="font-size: 25px">Quản lý quán</strong>
            <CButton @click="openAddStore" style="margin-left: 20px; height: 35px; float:right " color="primary" >Thêm quán</CButton>
            <CInput
              style="float:right"
                      v-model="keyword"
                      placeholder="Tìm quán"
                      v-on:keyup="onChange(keyword)"
              />
           
           <transition v-if="active" >
              <div class="modal-mask">
              <div class="modal-wrapper"  >
                <div class="modal-container" style="width: 600px;
                height: 600px;
                overflow: auto;">

                <div class="modal-header">
                  <slot name="header">
                  <h3>Thêm quán</h3>
                  </slot>
                </div>

                <div class="modal-body">
                  <slot name="body">
                    <CInput
                    label="Tên Quán"
                      v-model ="storeName"
                    />
                    <!-- <CInput
                    label="Chủ quán"
                      v-model ="storeOwner"
                      placeholder="Nhập ID chủ quán"
                    /> -->
                    <div class="row" style="margin-left: 0px;">
                      <p style="margin-right:10px;">Chủ quán</p>
                      <select v-if="users"
                            id="storeOwner"
                            class="country fl_left selectBox"
                            vertical
                            v-model="storeOwner"
                            placeholder="Chủ quán"
                            >
                            <option v-for="(user, index) in users" v-bind:key="index" :value="user.userID">
                                {{user.userName}}
                            </option>
                      </select>
                    </div>
                     <CInput
                       label="Địa chỉ"
                      v-model="storeAddress"
                    />
                    <p>Tỉnh</p>
                    <select
                        id="province"
                        class="country fl_left selectBox"
                        vertical
                        v-model="provinceSelected"
                        placeholder="chọn tỉnh"
                        >
                        <option v-for="province in provinces" v-bind:key="province.provinceID" :value="province.provinceID">
                            {{province.provinceName}}
                        </option>
                    </select>
                    <CInput
                       label="Open time"
                      v-model="openTime"
                       placeholder="07:00"
                    />
                     <CInput
                       label="Close time"
                      v-model="closeTime"
                      placeholder="21:30"
                    />
                    <p>Loại Quán</p>
                    <select
                        id="province"
                        class="country fl_left selectBox"
                        vertical
                        v-model="businessTypeSelected"
                        placeholder="Loại món ăn"
                        >
                        <option >Loại quán</option>
                        <option v-for="business in businessTypes" v-bind:key="business.businessTypeID" :value="business.businessTypeID">
                            {{business.businessTypeName}}
                        </option>
                    </select>
                    <div class="row" style="margin-left: 0px;">
                    </div>
                        <p>Hình đại diện quán</p>
                        <div class="row">
                        <input type="file"  @change="previewImage">
                        </div>
                      </slot>
                    </div>

                <div class="modal-footer">
                  <slot name="footer">
                  <button class="btn btn-danger" @click="active=false">
                    Close
                  </button>
                   <button class="btn btn-primary" @click="onUpload">Add</button>
                  </slot>
                </div>
                </div>
              </div>
              </div>
            </transition>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            class="mb-0 table-outline"
            hover
            border
            striped
            small
            fixed
            :items="result"
            :fields="fields"
            :items-per-page="5"
            clickable-rows
            :active-page="activePage"
            @row-clicked="rowClicked"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #status="{item}">
              <td>
                <CBadge v-if="item.status === '1'" :color="getBadge(item.status)">
                 OK
                </CBadge>
                <CBadge v-else :color="getBadge(item.status)">
                  Banned
                </CBadge>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService'
import UserService from '@/services/UserService'
import ProvinceService from '@/services/ProvinceService';
import StoreService from '@/services/StoreService';
// const url = 'https://api.viefood.info/api/Store/GetAllManage'
const url = 'https://api.viefood.info/api/Store/GetAll'

export default {
  beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'Stores',
  data () {
    return {
      users: [],
      keyword: '',
      result: null,
      provinces:[
        {
          provinceID: String,
          provinceName: String
        }
      ],
      provinceSelected: '',
      businessTypes:[
        {
          businessTypeID: String,
          businessTypeName: String
        }
      ],
      businessTypeSelected: '',
      items: null,
      fields: [
        { key: 'storeName', label: 'Tên quán', _classes: 'font-weight-bold' },
        { key: 'storeAddress', label: 'Địa chỉ', _classes: 'font-weight-bold' },
        { key: 'openTime', label: 'Giờ mở cửa', _classes: 'font-weight-bold' },
        { key: 'cLoseTime', label: 'Giờ đóng cửa', _classes: 'font-weight-bold' },
        { key: 'ratePoint', label: 'Đánh giá', _classes: 'font-weight-bold' },
        { key: 'status', label: 'status' },
      ],
      storeName: '',
      storeAddress: '',
      storeOwner: '',
      openTime: '',
      closeTime: '',
      imageData: null,
      storePicture: null,
      storeLat:'',
      storeLong:'',
      activePage: 1,
      active: false
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
    getBadge(status) {
      switch (status) {
        case '2': return 'danger'
        case '1': return 'primary'
      }
    },
    rowClicked (item) {
      this.$router.push({path: `store/${item.storeID}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    previewImage(event){
          this.storePicture=null;
          this.imageData= event.target.files[0];
    },
    onUpload(){
      if(this.imageData == null)
      {
        this.addStore();
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { 
          this.storePicture=url;
          this.addStore();
        })
        }
      )
    },
    async getProvince(){
      this.provinces = await ProvinceService.getAll();
    },
    async getBussinessType(){
      this.businessTypes = await StoreService.getAllBussinessType();
    },
    async addStore(){
      const token =  Storage.getItem('isAuthen');
      let response = await StoreService.createMenu();
      const store = {
        storeAddress: this.storeAddress,
        storeName:this.storeName,
        storePicture: this.storePicture,
        openTime: this.openTime,
        cLoseTime: this.closeTime,
        userID: this.storeOwner,
        provinceID: this.provinceSelected,
        menuID: response.toString(),
        businessTypeID: this.businessTypeSelected,
        ratePoint: '0',
        khoangcach: '0'
      }
      const response2 = await StoreService.addStore(store, token);
      alert(response2);
      this.active= false;
      this.onInit()
    },
    onChange(key){
      if(key == '' || key == null)
        return this.result=this.items;
      else {
        this.result = this.items.filter(function(item){
        return item.storeName.toLowerCase().includes(key.toLowerCase());
      })
      console.log(this.result)}
    },
    async openAddStore(){
        this.active=true;
        this.users = await UserService.getAll(localStorage.getItem('isAuthen'));
    },
    onInit(){
      this.$http.get(url,{ headers: {'Content-Type': 'application/json' ,"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
              this.items = response.data;
              this.result= this.items;
      }); 
    }
  },
  mounted() {
    this.onInit();
    this.getProvince();
    this.getBussinessType();
  },
}
</script>
<style>
@import url('../../../assets/css/dialog.css');
  .center_div{
  margin: 0 auto;
  width:100% /* value of your choice which suits your alignment */
}
.selectBox{
  width:490px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;
}
</style>