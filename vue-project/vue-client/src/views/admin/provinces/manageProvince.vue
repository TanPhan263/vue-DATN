<template>
  <CRow>
    <CCol col="12" md="4">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-justify-center"/>
          <strong>Provinces   </strong>
          <CButton color="primary" style="float:right;margin-bottom: 10px" @click="primaryModal = true" class="mr-1">
                Thêm tỉnh
          </CButton>
          <CInput
            style="margin-left: 0px;"
              v-model="keyword"
              placeholder="Tìm tỉnh"
              v-on:keyup="onProvinceSearch(keyword)"/>
          <CModal
            title="Thêm tỉnh"
            :show.sync="primaryModal"
            color="primary"
            @update:show="closeModal">
        <CInput label="Tên tỉnh" v-model="provinceName"/>
        </CModal>
        </CCardHeader>
        <CCardBody v-if="provinces" style="height:450px; overflow: scroll">
          <div v-for="(province, index) in result" v-bind:key="index">
          <CButton @click="onProvinceClicked(province.provinceID,province.provinceName)" color="primary" class="provinceName mb-2" style="width: 100%;text-align: left">
            {{province.provinceName}}
          </CButton>
          <CCollapse :show="collapse === province.provinceID" :duration="400">
            <CCard body-wrapper>
              <CInput v-model="provinceName"></CInput>
               <CButtonGroup style="float:right" size="sm">
                <CButton @click="onUpdateProvince()" color="primary">Save</CButton>
                  <CButton @click="onDelete(province.provinceID)" color="warning">Delete</CButton>
                  <CButton @click="collapse = ''" style="float:left" size="sm" color="danger">Close</CButton>
              </CButtonGroup>
            </CCard>
          </CCollapse>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol col="12" md="8">
      <CCard>
        <CCardHeader>
          <strong>Districts</strong>
          <CButton color="primary" style="float:right" @click="primaryModalDistrict = true" class="mr-1">
                Thêm quận/huyện
          </CButton>
          <CModal
            title="Thêm quận/huyện"
            :show.sync="primaryModalDistrict"
            color="primary"
            @update:show="closeModalDistrict"
          >
          <p>Tỉnh</p>
            <select
                id="province"
                class="country fl_left selectBox"
                vertical
                v-model="provinceSelected"
                placeholder="chọn tỉnh">
                <option v-for="province in provinces" v-bind:key="province.provinceID" :value="province.provinceID">
                    {{province.provinceName}}
                </option>
            </select>
          <CInput label="Tên tỉnh" v-model="districtName"/>
        </CModal>
        </CCardHeader>
        <CCardBody style="height:490px; overflow: scroll">
          <div v-for="(district, index) in districts" v-bind:key="index">
            <CCard class="mb-0">
              <CButton  v-if="district"
                block 
                color="link" 
                class="text-left shadow-none card-header" 
                @click="onDistrictClicked(district.districtName,district.districtID)" 
              >
                <h5 class="m-0">{{district.districtName}}</h5>
              </CButton>
              <CCollapse v-if="district" :show="accordion === district.districtID">
                <CCard body-wrapper>
                <CInput v-model="districtName"></CInput>
                <CButtonGroup style="float:right" size="sm">
                  <CButton @click="onUpdateDistrict()" color="primary">Save</CButton>
                  <CButton @click="onDeleteDistrict(district.districtID)" color="warning">Delete</CButton>
                  <CButton @click="accordion = ''" style="float:left" size="sm" color="danger">Close</CButton>
                </CButtonGroup>
              </CCard>
              </CCollapse>
            </CCard>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>

import AuthService from '@/services/AuthService.js'
import ProvinceService from '@/services/ProvinceService.js'
export default {
    beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'manageNavBar',
  data(){
      return{
        keyword: '',                //keywork tìm kiếm quán
        token: '',                  //token của người dùng
        provinces: [],              //danh sách quán
        result:[],                  //danh sách kết quả các quán sau khi lọc 
        districts:[],               //danh sách quận/huyện
        provinceSelected: '',       //id của tỉnh được chọn
        districtSelected:'',        //id của quận được chọn
        provinceName:'',            //tên tỉnh được chọn
        districtName:'',            //tên quận được chọn
        collapse: false,            //biến hiển thị hộp thoại chỉnh sửa tỉnh
        accordion: 0,               //biến hiển thị hộp thoại chỉnh sửa quận huyện
        primaryModal: false,        //biến hiển thị modal thêm tỉnh 
        primaryModalDistrict: false //biến hiển thị modal thêm quận 
      }
  },
  methods:{
    async onInit(){                  //hàm khởi tạo
      this.token = localStorage.getItem('isAuthen')         //lấy token từ localStorage
      this.provinces = await ProvinceService.getAll();      //lấy danh sách tỉnh
      this.result = this.provinces;                         //gán danh sách tỉnh sang biến result để lọc 
      this.provinceSelected= this.provinces[0].provinceID;  //lấy id của tỉnh đầu tiên để hiển thị
      this.getDistrict(this.provinceSelected);              //lấy danh sách quận theo id của tỉnh đầu tiên
    },
    async getDistrict(id){                                  //lấy danh sách quận theo id của tỉnh
      this.districts = await ProvinceService.getDistrictByID(id);
    },
    onProvinceClicked(id,name){                             //hàm hiển thị thông tin của tỉnh  
      this.collapse = id;
      this.provinceName = name;
      this.provinceSelected = id;
      this.getDistrict(id);                                 //lấy danh sách quận theo id của tỉnh
    },
    onDistrictClicked(name,id){                             //hàm hiển thị thông tin của quận 
      this.accordion = id;
      this.districtName = name;
      this.districtSelected = id;
    },
    async onUpdateProvince(){                                //cập nhật thông tin của tỉnh
      const province = {                                     //tạo một đối tượng tỉnh với dữ liệu người dùng nhập
        provinceID: this.provinceSelected,
        provinceName: this.provinceName,
      }                                                         
      const response = await ProvinceService.updateProvince(this.token,province,this.provinceSelected);//gọi api cập nhật thông tin của tỉnh
      alert(response);                                        //thông báo kết quả
      this.onInit();                                          //load lại thông tin
    },
    async onUpdateDistrict(){                                  //cập nhật thông tin của quận
      const district = {                                       //tạo một đối tượng quận với dữ liệu người dùng nhập
        districtID: this.districtSelected,
        districtName: this.districtName,
        provinceID: this.provinceSelected
      }
      const response = await ProvinceService.updateProvince(this.token,district,this.districtSelected);//gọi api cập nhật thông tin của quận
      alert(response);                                        //thông báo kết quả
      this.getDistrict(this.provinceSelected);                //load lại thông tin
    },
    async onDelete(id){                                         //xóa tỉnh theo id và token
      try{
        if(confirm("Bạn chắc chắn muốn xóa???")){
          const response = await ProvinceService.deleteProvince(id,this.token);//gọi api xóa tỉnh 
          alert(response);                                                     //thông báo kết quả
          this.onInit();                                                       //load lại thông tin
        }
        else return;
      }
      catch{}
    },
    async onDeleteDistrict(id){                                //xóa quận theo id và token
      try{
        if(confirm("Bạn chắc chắn muốn xóa???")){
        const response = await ProvinceService.deleteDistrict(id,this.token);//gọi api xóa quận 
        alert(response);                                                     //thông báo kết quả
        this.getDistrict(this.provinceSelected);                             //load lại thông tin
        }
        else return;
      }
      catch{}
    },
    async onAddDistrict(){                                      //hàm thêm quận 
      const district = {                                         //tạo một đối tượng quận với dữ liệu người dùng nhập
        districtName: this.districtName,
        provinceID: this.provinceSelected
      }
      const response = await ProvinceService.addDistrict(this.token,district);//gọi api thêm mới quận
      alert(response);                                                        //thông báo kết quả
      this.getDistrict(this.provinceSelected);                                //load lại thông tin
    },
    async onAddProvince(){                                       //hàm thêm tỉnh
        const province = {                                       //tạo một đối tượng tỉnh với dữ liệu người dùng nhập
        provinceName: this.provinceName,
      }
      const response = await ProvinceService.addProvince(this.token,province);//gọi api thêm mới tỉnh
      alert(response);                                                         //thông báo kết quả
    },
    async onProvinceSearch(key){                                              //tìm kiếm tỉnh theo từ khóa
      if(key == '' || key == null)                                            //nếu từ khóa rỗng thì không tìm 
        return this.result=this.provinces;
      else {
        this.result = this.provinces.filter(function(item){                   //lọc những tỉnh có tên chứa từ khóa
        return item.provinceName.toLowerCase().includes(key.toLowerCase());
      })
    }
    },
    closeModal(status, evt, accept) { if (accept) {                           //hàm đóng modal thêm tỉnh
      this.onAddProvince();                                                   //nếu nhấn ok thì sẽ thêm tỉnh 
      } 
    },
    closeModalDistrict(status, evt, accept) { if (accept) {                   //hàm đóng modal thêm quận
      this.onAddDistrict();                                                   //nếu nhấn ok thì sẽ thêm quận 
    } }
  },
  mounted() {
    this.onInit();
  },
  
}
</script>

<style>
.selectBox{
height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;
}
.provinceName{
  font-size: 17px;
}
</style>