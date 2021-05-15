<template>
  <CRow>
    <CCol >
      <CCard class="center_div">
        <CCardHeader >
          <div class="row" style="width: 100%">
            <h2  style="margin-left: 12px; width: 80%">Stores</h2>
            <CInput
                      v-model="keyword"
                      placeholder="Tìm quán"
                      v-on:keyup="onChange(keyword)"
              />
          </div>
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
                    <CInput
                    label="Chủ quán"
                      v-model ="storeOwner"
                      placeholder="Nhập email chủ quán"
                    />
                     <CInput
                       label="Địa chỉ"
                      v-model="storeAddress"
                    />
                    <p>Tỉnh</p>
                    <select
                        id="province"
                        style="width:490px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;"
                        class="country fl_left"
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
                    />
                     <CInput
                       label="Close time"
                      v-model="closeTime"
                    />
                    <p>Loại Quán</p>
                    <select
                        id="province"
                        style="width:490px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;"
                        class="country fl_left"
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
            <template #status="data">
              <td>
                <CBadge :color="getBadge(data.item.status)">
                  {{data.item.status}}
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
import firebase from 'firebase';
import ProvinceService from '@/services/ProvinceService';
import StoreService from '@/services/StoreService';
export default {
  name: 'OwnerStores',
  data () {
    return {
      user: null,
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
    async onInit(){
        this.user=localStorage.getItem('userInfor');
        this.user=JSON.parse(this.user)
        const token = localStorage.getItem('isAuthen');
        this.items = await StoreService.getByUser(this.user.userID,token);
        this.result=this.items;
        console.log(this.items);
        this.getProvince();
        this.getBussinessType();
    },
    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },
    rowClicked (item) {
      this.$router.push({path: `manageStores/${item.storeID}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    previewImage(event){
          this.storePicture=null;
          this.imageData= event.target.files[0];
    },
    onUpload(){
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { 
          this.active=false;
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
      const token = localStorage.getItem('isAuthen');
      const store = {
        storeAddress: this.storeAddress,
        storeName:this.storeName,
        storePicture: this.storePicture,
        openTime: this.openTime,
        cLoseTime: this.closeTime,
        userID: this.storeOwner,
        provinceID: this.provinceSelected,
        menuID: '',
        businessTypeID: this.businessTypeSelected,
        ratePoint: '0'
      }
      const response = await StoreService.addStore(store, token);
      alert(response);

    },
    onChange(key){
      if(key == '' || key == null)
        return this.result=this.items;
      else {
        this.result = this.items.filter(function(item){
        return item.storeName.toLowerCase().includes(key.toLowerCase());
      })
      console.log(this.result)}
    }
  },
  mounted() {
      this.onInit();
  },
}
</script>
<style>
@import url('../../../assets/css/dialog.css');
  .center_div{
  margin: 0 auto;
  width:100% /* value of your choice which suits your alignment */
}
</style>