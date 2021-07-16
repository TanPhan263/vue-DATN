<template>
  <div>
    <WidgetsDropdown/>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol sm="5">
            <strong style="font-size: 18px">Lượng truy cập</strong>
             <div>
                  <i class="fas fa-circle" style="font-size:15px;color:#1E90FF"></i> {{lableBlue}}
                  <i class="fas fa-circle" style="font-size:15px;color:#4dbd74"></i> {{lableGreen}}
                  <i class="fas fa-circle" style="font-size:15px;color:#f86c6b"></i> {{lableRed}}
              </div>
          </CCol>
          <CCol sm="5">
            <CRow>
            <CCol sm="3">
            <strong>Chọn ngày</strong>
            </CCol>
            <CCol sm="8">
             <date-picker v-model="date" valueType="format"></date-picker>
            </CCol>
            </CRow>
          </CCol>
          <CCol sm="2" class="d-none d-md-block">
            <CButtonGroup class="float-right mr-3">
              <CButton
                color="outline-secondary"
                v-for="(value, key) in ['Day', 'Month', 'Year']"
                :key="key"
                class="mx-0"
                :pressed="value === selected ? true : false"
                @click="optionChanged(value)"
              >
                {{value}}
              </CButton>
            </CButtonGroup>
          </CCol>
        </CRow>
        <MainChartExample style="height:300px;margin-top:40px;" v-if="loaded"
        v-bind:dataBlue="dataBlue" :dataGreen="dataGreen" :dataRed="dataRed" v-bind:lable="lable"
        :lableBlue="lableBlue" :lableGreen="lableGreen" :lableRed="lableRed"/>
        <div v-else  style="margin: 0 auto;" class="loader"></div>
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol md sm="4" class="mb-sm-2 mb-0">
            <div class="text-muted">Tổng lượt truy cập</div>
            <strong>{{totalView }}</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="success"
              :value="100"
            />
          </CCol>
          <CCol md sm="4" class="mb-sm-2 mb-0">
            <div class="text-muted">Truy cập hôm nay</div>
            <strong>Total: {{totalDay}}</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="info"
              :value="100"
            />
          </CCol>
          <CCol md sm="4" class="mb-sm-2 mb-0">
            <div class="text-muted">Truy cập tháng này</div>
            <strong>Total: {{totalMonth }}</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="warning"
              :value="100"
            />
          </CCol>
          <CCol md sm="4" class="mb-sm-2 mb-0">
            <div class="text-muted">Truy cập năm nay</div>
            <strong>Total: {{totalYear }}</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="danger"
              :value="100"
            />
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
    <ComfirmStore/>
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { CChartPie } from '@coreui/vue-chartjs'
import { CChartBar } from '@coreui/vue-chartjs'
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'
import ComfirmStore from './stores/ConfirmStore.vue'
import AnalystService from '@/services/AnalystService.js'
import StoreService from '@/services/StoreService.js'
import CommentService from '@/services/CommentService.js'
import UserService from '@/services/UserService.js'
import AuthService from '@/services/AuthService.js'

export default {
   beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand,
    CChartPie,
    CChartBar,
    ComfirmStore,
    DatePicker
  },
  created(){
    //  this.getDate();
     this.optionChanged(this.selected);
     this.getStorePerProvince();
     this.getStorePerDistrict();
     this.getTotalView();
  },
  data () {
    return {
      date: null,
      selected: 'Day',
      loaded: false,
      dataBlue: [],
      dataGreen:[],
      dataRed:[],
      lable:[],
      lableBlue:'Hôm nay',
      lableGreen: 'Hôm qua',
      lableRed: '2 ngày trước',
      lableProvince:[],
      storePerProvince:[],
      lableDistrict:[],
      storePerDistrict:[],
      totalView:0,
      totalDay:0,
      totalMonth:0,
      totalYear:0,
    }
  },
  watch:{
    date(){
      if(this.date != null){
        this.optionChanged('Day');
        this.getData_date();
      }
    }
  },
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color;
    },
    optionChanged(value){
      this.selected=value;
      if(value == 'Day'){
        if(this.date != null)
        {
          var d = new Date(this.date);
          this.lableBlue = d.toJSON().slice(0,10).split('-').reverse().join('/')
          d.setDate(d.getDate() - 1)
          this.lableGreen = d.toJSON().slice(0,10).split('-').reverse().join('/')
          d.setDate(d.getDate() - 1)
          this.lableRed = d.toJSON().slice(0,10).split('-').reverse().join('/')
        }
        else{
          var d = new Date();
          this.lableBlue = d.toJSON().slice(0,10).split('-').reverse().join('/')
          d.setDate(d.getDate() - 1)
          this.lableGreen = d.toJSON().slice(0,10).split('-').reverse().join('/')
          d.setDate(d.getDate() - 1)
          this.lableRed = d.toJSON().slice(0,10).split('-').reverse().join('/')
        }
        this.getData_date();
      }
      else if(value == 'Month')
      {
        if(this.date != null)
        {
          var d = new Date(this.date);
          this.lableBlue = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)
          this.lableGreen = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)
          this.lableRed = d.toJSON().slice(0,7).split('-').reverse().join('/')
        }
        else{
          var d = new Date();
          this.lableBlue = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)
          this.lableGreen = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)
          this.lableRed = d.toJSON().slice(0,7).split('-').reverse().join('/')
        }
        this.getData_month();
      }
      else
      {
        if(this.date != null)
        {
          var d = new Date(this.date);
          this.lableBlue = d.getFullYear();
          this.lableGreen = d.getFullYear()-1;
          this.lableRed =d.getFullYear()-2;
        }else{
          var d = new Date();
          this.lableBlue = d.getFullYear();
          this.lableGreen = d.getFullYear()-1;
          this.lableRed =d.getFullYear()-2;
        }
        this.getData_year();
      }
    },
    async getData_date(){
      this.loaded = false;
      if(this.date == null){
        var d = new Date();
      }
      else d= new Date(this.date);
      this.dataBlue = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear());
      d.setDate(d.getDate() - 1)
      this.dataGreen = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear());
      d.setDate(d.getDate() - 1)
      this.dataRed = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length)
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length))
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_month(){
      this.loaded = false;
      if(this.date == null){
        var d = new Date();
      }
      else d= new Date(this.date);
      this.dataBlue = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());
      d.setMonth(d.getMonth() - 1);
      this.dataGreen = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());
      d.setMonth(d.getMonth() - 1);
      this.dataRed = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length)
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length))
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_year(){
      this.loaded = false;
      if(this.date == null){
        var d = new Date();
      }
      else d= new Date(this.date);
      this.dataBlue = await AnalystService.getYear(d.getFullYear());
      this.dataGreen = await AnalystService.getYear(d.getFullYear()-1);
      this.dataRed = await AnalystService.getYear(d.getFullYear()-2);
      this.setLable(this.dataBlue);
    },
    setLable(data)
    {
      this.lable=[];
      for (let i = 1; i <= data.length; i++) {
        this.lable.push(i)
      };
      this.loaded = true;
    },
    async getStorePerProvince(){
      var storePerPro = await AnalystService.getStorePerProvince();
      storePerPro.forEach(element => {
        this.lableProvince.push(element.provinceName);
        this.storePerProvince.push(element.soQuan);
      });
    },
    async getStorePerDistrict(){
      var storePerDis = await AnalystService.getStorePerDistrict('-MO5b_1K2_tF_C4GVDo3');
      storePerDis.forEach(element => {
        this.lableDistrict.push(element.districtName);
        this.storePerDistrict.push(element.soQuan);
      });
    },
    async getTotalView(){
      this.totalView = await AnalystService.getAllView();
      var d = new Date();
      let total = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear());
      total.forEach(element =>{
        this.totalDay += parseInt(element);
      })
      total = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());
      total.forEach(element =>{
        this.totalMonth += parseInt(element);
      });
      total = await AnalystService.getYear(d.getFullYear());
      total.forEach(element =>{
        this.totalYear += parseInt(element);
      });
    }
  }
}
</script>
<style>
.loader {
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #ec1c24;
  width: 80px;
  height: 80px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
