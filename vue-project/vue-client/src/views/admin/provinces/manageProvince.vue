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
                      v-on:keyup="onProvinceSearch(keyword)"
              />
          <CModal
            title="Thêm tỉnh"
            :show.sync="primaryModal"
            color="primary"
            @update:show="closeModal"
          >
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
                        placeholder="chọn tỉnh"
                        >
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
        keyword: '',
        token: '',
        provinces: [],
        result:[],
        districts:[],
        provinceSelected: '',
        districtSelected:'',
        provinceName:'',
        districtName:'',
        collapse: false,
        cardCollapse: true,
        innerCollapse: false,
        accordion: 0,
        primaryModal: false,
        primaryModalDistrict: false
      }
  },
  methods:{
    async onInit(){
      this.token = localStorage.getItem('isAuthen')
      this.provinces = await ProvinceService.getAll();
      this.result = this.provinces;
      this.provinceSelected= this.provinces[0].provinceID;
      this.getDistrict(this.provinceSelected);
    },
    async getDistrict(id){
      this.districts = await ProvinceService.getDistrictByID(id);
    },
    onProvinceClicked(id,name){
      this.collapse = id;
      this.provinceName = name;
      this.provinceSelected = id;
      this.getDistrict(id);
    },
    onProvinceModalClicked(id,name){
      this.provinceSelected =id;
      this.provinceName = name;
    },
    onDistrictClicked(name,id){
      this.accordion = id;
      this.districtName = name;
      this.districtSelected = id;
    },
    async onUpdateProvince(){
      const province = {
        provinceID: this.provinceSelected,
        provinceName: this.provinceName,
      }
      const response = await ProvinceService.updateProvince(this.token,province,this.provinceSelected);
      alert(response);
      this.onInit();
    },
    async onUpdateDistrict(){
      const district = {
        districtID: this.districtSelected,
        districtName: this.districtName,
        provinceID: this.provinceSelected
      }
      const response = await ProvinceService.updateProvince(this.token,district,this.districtSelected);
      alert(response);
      this.getDistrict(this.provinceSelected);
    },
    async onDelete(id){
      try{
        if(confirm("Bạn chắc chắn muốn xóa???")){
          const response = await ProvinceService.deleteProvince(id,this.token);
          alert(response);
          this.onInit();
        }
        else return;
      }
      catch{}
    },
    async onDeleteDistrict(id){
      try{
        if(confirm("Bạn chắc chắn muốn xóa???")){
        const response = await ProvinceService.deleteDistrict(id,this.token);
        alert(response);
        this.getDistrict(this.provinceSelected);
        }
        else return;
      }
      catch{}
    },
    async onAddDistrict(){
      const district = {
        districtName: this.districtName,
        provinceID: this.provinceSelected
      }
      const response = await ProvinceService.addDistrict(this.token,district);
      alert(response);
      this.getDistrict(this.provinceSelected);
    },
    async onAddProvince(){
        const province = {
        provinceName: this.provinceName,
      }
      const response = await ProvinceService.addProvince(this.token,province);
      alert(response);
    },
    async onProvinceSearch(key){
      if(key == '' || key == null)
        return this.result=this.provinces;
      else {
        this.result = this.provinces.filter(function(item){
        return item.provinceName.toLowerCase().includes(key.toLowerCase());
      })
    }
    },
    closeModal(status, evt, accept) { if (accept) { 
      this.onAddProvince();
      } 
    },
    closeModalDistrict(status, evt, accept) { if (accept) { 
      this.onAddDistrict();
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