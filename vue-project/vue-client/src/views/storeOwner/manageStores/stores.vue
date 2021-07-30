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
import ProvinceService from '@/services/ProvinceService';
import StoreService from '@/services/StoreService';
import AuthService from '@/services/AuthService.js';
export default {
   beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'));
    AuthService.checkStoreOwner(localStorage.getItem('isAuthen'));
    next();
  },
  name: 'OwnerStores',
  data () {
    return {
      user: null,                       //thông tin người dùng
      keyword: '',                      //từ khóa để tim kiếm quán
      result: null,                     //danh sách quán sau khi lọc bằng từ khóa
      provinces:[                       //danh sách tỉnh
        {
          provinceID: String,
          provinceName: String
        }
      ],
      businessTypes:[                 //danh sách loại quán
        {
          businessTypeID: String,
          businessTypeName: String
        }
      ],
      items: null,                    //danh sách quán 
      fields: [                       //các trường trong bảng quán
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
      businessTypeSelected: '',    
      activePage: 1,//trang hiển thị của bảng
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {//hàm thay đổi danh sách quán khi đổi trang trong bảng
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
        this.getProvince();
        this.getBussinessType();
    },
    getBadge(status) {      //hiện trạng thái quán 
      switch (status) {
        case '2': return 'danger'   //bị ban
        case '1': return 'primary'   //bình thường
      }
    },
    rowClicked (item) {     //đến trang chi tiết quán
      this.$router.push({path: `managestores/${item.storeID}`})
    },
    pageChange (val) {      //thay đổi giá trị trang của bảng
      this.$router.push({ query: { page: val }})
    },
    previewImage(event){     //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
          this.storePicture=null;
          this.imageData= event.target.files[0];
    },
    onUpload(){              //thêm quán mới
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);//tải ảnh lên firebase
      storageRef.on(`state_change`, snapshot => { 
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => {   //trả về url của ản
          this.storePicture=url;                                   //gán url mới nhận vào hình ảnh của quán
          this.addStore();                                         //tiến hành thêm quán
        })
        }
      )
    },
    async getProvince(){                                            //lấy danh sách tỉnh
      this.provinces = await ProvinceService.getAll();
    },
    async getBussinessType(){                                        //lấy danh sách loại quán
      this.businessTypes = await StoreService.getAllBussinessType();
    },
    async addStore(){                                                  //hàm thêm quán
      const token = localStorage.getItem('isAuthen');         
      const store = {                                                  //tạo một đối tượng quán với dữ liệu người dùng nhập vào             
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
      const response = await StoreService.addStore(store, token);     //gọi api thêm quán
      alert(response);                                                //thông báo kết quả

    },
    onChange(key){                                                    //tìm kiếm quán theo từ khóa
      if(key == '' || key == null)
        return this.result=this.items;                                //nếu từ khóa rỗng thì không tìm trả về danh sách ban đầu
      else {
        this.result = this.items.filter(function(item){               //lọc những quán có tên chứa từ khóa 
        return item.storeName.toLowerCase().includes(key.toLowerCase());
      })
      }
    }
  },
  mounted() {
      this.onInit();//hàm khởi tạo
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