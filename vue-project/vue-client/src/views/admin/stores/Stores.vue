<template>
  <CRow>
    <CModal
      title="Thêm Quán"
      :show.sync="primaryModal"
      color="primary"
      @update:show="closeModal"
    >
    <CRow>
       <CCol sm="7">
    <CInput
      label="Tên Quán"
      v-model ="storeName"
    />
   </CCol>
  <CCol sm="5">
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
  </CCol>
    </CRow>
    <CInput
      label="Địa chỉ"
    v-model="storeAddress"
  />
  <CRow>
    <CCol sm="6">
    <p>Tỉnh</p>
    <select
        id="province"
        class="country fl_left selectBox"
        vertical
        v-model="provinceSelected"
        @change="getDistrict(provinceSelected)"
        placeholder="chọn tỉnh"
        >
        <option v-for="(province,index) in provinces" v-bind:key="index" :value="province.provinceID">
            {{province.provinceName}}
        </option>
    </select>
    </CCol>
    <CCol sm="6">
    <p>Quận/huyện</p>
    <select
        id="district"
        class="country fl_left selectBox"
        vertical
        v-model="districSelected"
        placeholder="chọn quận/huyện"
        >
        <option v-for="(district,index) in districts" v-bind:key="index" :value="district.districtID">
            {{district.districtName}}
        </option>
    </select>
    </CCol>
  </CRow>
  <CRow>
    <CCol sm="6">
  <CInput
      label="Open time"
    v-model="openTime"
      placeholder="07:00"
  />
    </CCol>
     <CCol sm="6">
    <CInput
      label="Close time"
    v-model="closeTime"
    placeholder="21:30"
  />
     </CCol>
  </CRow> 
  <p>Loại Quán</p>
  <select
      id="province"
      class="country fl_left selectBox"
      vertical
      v-model="businessTypeSelected"
      placeholder="Loại món ăn"
      >
      <option >Loại quán</option>
      <option v-for="(business,index) in businessTypes" v-bind:key="index" :value="business.businessTypeID">
          {{business.businessTypeName}}
      </option>
  </select>
  <CRow>
    <CCol>
      <p>Hình đại diện quán</p>
      <input type="file"  @change="previewImage">
    </CCol>
  </CRow>
  </CModal>
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
           <!-- <transition v-if="active" >
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
            </transition> -->
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
      primaryModal: false,              //biến mở modal thêm quán
      users: [],                        //danh sách người dùng
      keyword: '',                      //từ khóa để tim kiếm quán
      result: null,                     //danh sách quán sau khi lọc bằng từ khóa
      provinces:[                       //danh sách tỉnh
        {
          provinceID: String,
          provinceName: String
        }
      ],
      districts:[],                     //danh sách quận
      businessTypes:[                   //danh sách loại quán
        {
          businessTypeID: String,
          businessTypeName: String
        }
      ],
      items: null,                      //danh sách quán 
      fields: [                         //các trường trong bảng quán
        { key: 'storeName', label: 'Tên quán', _classes: 'font-weight-bold' },
        { key: 'storeAddress', label: 'Địa chỉ', _classes: 'font-weight-bold' },
        { key: 'openTime', label: 'Giờ mở cửa', _classes: 'font-weight-bold' },
        { key: 'cLoseTime', label: 'Giờ đóng cửa', _classes: 'font-weight-bold' },
        { key: 'ratePoint', label: 'Đánh giá', _classes: 'font-weight-bold' },
        { key: 'status', label: 'Trạng thái' },
      ],
      //thuộc tính của quán
      storeName: '',
      storeAddress: '',
      storeOwner: '',
      openTime: '',
      closeTime: '',
      imageData: null,
      storePicture: null,
      storeLat:'',
      storeLong:'',
      provinceSelected: '',
      districSelected:'',
      businessTypeSelected: '',
      activePage: 1,                          //trang hiển thị của bảng
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {       //hàm thay đổi danh sách quán khi đổi trang trong bảng
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
    getBadge(status) {      //hiện trạng thái quán 
      switch (status) {
        case '2': return 'danger'   //bị ban
        case '1': return 'primary'   //bình thường
      }
    },
    rowClicked (item) {         //đến trang chi tiết quán
      this.$router.push({path: `store/${item.storeID}`})
    },
    pageChange (val) {          //thay đổi giá trị trang của bảng
      this.$router.push({ query: { page: val }})
    },
    previewImage(event){        //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
          this.storePicture=null;
          this.imageData= event.target.files[0];
    },
    onUpload(){                   //thêm quán mới 
      if(this.imageData == null)
      {
        this.addStore();           //nếu không có hình thì tiến hành thêm quán không cần ảnh
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);//tải ảnh lên firebase
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => {  //trả về url của ảnh
          this.storePicture=url;                                  //gán url mới nhận vào hình ảnh của quán
          this.addStore();                                        //tiến hành thêm quán
        })
        }
      )
    },
    async getProvince(){                                          //lấy danh sách tỉnh
      this.provinces = await ProvinceService.getAll();
    },
     async getDistrict(id){                                       //lấy danh sách quận
      this.districts = await ProvinceService.getDistrictByID(id);
    },
    async getBussinessType(){                                      //lấy danh sách loại quán
      this.businessTypes = await StoreService.getAllBussinessType();
    },
    async addStore(){                                               //hàm thêm quán
      const token =  Storage.getItem('isAuthen');
      let response = await StoreService.createMenu();               //tạo menu của quán
      const store = {                                               //tạo một đối tượng quán với dữ liệu người dùng nhập vào             
        storeAddress: this.storeAddress,  
        storeName:this.storeName,
        storePicture: this.storePicture,
        openTime: this.openTime,
        cLoseTime: this.closeTime,
        userID: this.storeOwner,
        provinceID: this.provinceSelected,
        districtID: this.districSelected,
        menuID: response.toString(),
        businessTypeID: this.businessTypeSelected,
        ratePoint: '0',
        khoangcach: '0'
      }
      const response2 = await StoreService.addStore(store, token);//gọi api thêm quán
      alert(response2);                                           //thông báo kết quả
      this.onInit();                                              //load lại thông tin
    },
    onChange(key){                                                //tìm kiếm quán theo từ khóa
      if(key == '' || key == null)                          
        return this.result=this.items;                            //nếu từ khóa rỗng thì không tìm trả về danh sách ban đầu
      else {
        this.result = this.items.filter(function(item){           //lọc những quán có tên chứa từ khóa
        return item.storeName.toLowerCase().includes(key.toLowerCase());
      })
      console.log(this.result)}
    },
    async openAddStore(){                                         //hàm mở của sổ thêm quán               
      this.storeAddress = ''                                      //set các giá trị thành rỗng trước khi mở                                
      this.storeName = ''
      this.storePicture = ''
      this.openTime = ''
      this.closeTime = ''
      this.storeOwner = ''
      this.provinceSelected = ''
      this.districSelected = ''
      this.businessTypeSelected = ''
      this.primaryModal = true;                                   //mở hộp thoại thêm
      this.users = await UserService.getAll(localStorage.getItem('isAuthen'));//lấy danh sách người dùng
    },
    onInit(){
      //lấy danh sách quán 
      this.$http.get(url,{ headers: {'Content-Type': 'application/json' ,"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
        this.items = response.data;
        this.result= this.items;
      }); 
    },
    closeModal(status, evt, accept) { if (accept) { //hàm đóng modal thêm quán
      this.onUpload();                              //nếu nhấn ok thì sẽ thêm quán
      } 
    },
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
  width:100%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;margin-top: -11px;
}
</style>