<template>
  <CRow>
    <CCol >
      <CCard class="center_div">
        <CCardHeader>
          <div class="row">
            <h2>Registered Stores</h2>
             <CInput class="col-4"
                v-model="keyword"
                placeholder="Tìm quán"
                v-on:keyup="onChange(keyword)"
              />
          </div>
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
import firebase from 'firebase';
import ProvinceService from '@/services/ProvinceService';
import StoreService from '@/services/StoreService';
const url = 'https://localhost:44398/api/Store/GetAllManage'
export default {
  name: 'Stores',
  data () {
    return {
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
        { key: 'openTime', label: 'Ngày đăng kí', _classes: 'font-weight-bold' },
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
      const token = localStorage.getItem('isAuthen');
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
    onInit(){
      this.$http.get(url,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
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
</style>