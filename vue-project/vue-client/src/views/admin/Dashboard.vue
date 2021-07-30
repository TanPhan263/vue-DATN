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
      date: null,                 //biến chứa giá trị ngày 
      selected: 'Day',            //biến chứa giá trị chế độ xem(Day,Month,Year)
      loaded: false,              //biến cờ hiện loading trong khi load dữ liệu cho biểu đồ
      dataBlue:[],                //danh sách dữ liệu cho đường màu xanh nước trong bảng lượng truy cập
      dataGreen:[],               //danh sách dữ liệu cho đường màu xanh lá trong bảng lượng truy cập
      dataRed:[],                 //danh sách dữ liệu cho đường màu đỏ trong bảng lượng truy cập
      lable:[],                   //nhãn cho các cột trong biểu đồ 
      lableBlue:'Hôm nay',        //nhãn cho đường màu xanh nước
      lableGreen: 'Hôm qua',      //nhãn cho đường màu xanh lá
      lableRed: '2 ngày trước',   //nhãn cho đường màu đỏ
      lableProvince:[],           //danh sách tên các tỉnh           
      storePerProvince:[],        //danh sách quán mỗi tỉnh     
      lableDistrict:[],           //danh sách tên các quận
      storePerDistrict:[],        //danh sách quán mỗi quận
      totalView:0,                //tổng lượt truy cập của website
      totalDay:0,                 //tổng lượt truy cập của website trong ngày
      totalMonth:0,               //tổng lượt truy cập của website trong tháng
      totalYear:0,                //tổng lượt truy cập của website trong năm
    }
  },
  watch:{
    date(){                       //hàm bắt sự kiện khi giá trị biến date thay đổi
      if(this.date != null){      //nếu biến date khác null
        this.optionChanged('Day');//tải dữ liệu lượng truy cập theo ngày với giá trị của biến date
        // this.getData_date();
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
    optionChanged(value){                           //hàm tải dữ liệu lượng truy cập thi thay đổi chế độ xem (Day,Month ,Year)
      this.selected=value; 
      if(value == 'Day'){                           //chế độ xem là Day
        if(this.date != null)
        {
          var d = new Date(this.date);              //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
          this.lableBlue = d.toJSON().slice(0,10).split('-').reverse().join('/');//chuyển sang định dạng dd/mm/yyyy
          d.setDate(d.getDate() - 1);               //lui về một ngày 
          this.lableGreen = d.toJSON().slice(0,10).split('-').reverse().join('/');
          d.setDate(d.getDate() - 1);               //lui về một ngày nữa
          this.lableRed = d.toJSON().slice(0,10).split('-').reverse().join('/');
        }
        else{
          var d = new Date();                       //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
          this.lableBlue = d.toJSON().slice(0,10).split('-').reverse().join('/');
          d.setDate(d.getDate() - 1);
          this.lableGreen = d.toJSON().slice(0,10).split('-').reverse().join('/');
          d.setDate(d.getDate() - 1);
          this.lableRed = d.toJSON().slice(0,10).split('-').reverse().join('/');
        }
        this.getData_date();                        //tải dữ liệu lượng truy cập theo ngày
      }
      else if(value == 'Month')                     //chế độ xem là Month
      {
        if(this.date != null)
        {
          var d = new Date(this.date);              //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
          this.lableBlue = d.toJSON().slice(0,7).split('-').reverse().join('/')//chuyển sang định dạng /mm/yyyy
          d.setMonth(d.getMonth() - 1)              //lui về 1 tháng
          this.lableGreen = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)              //lui về 1 tháng nữa
          this.lableRed = d.toJSON().slice(0,7).split('-').reverse().join('/')
        }
        else{                                       
          var d = new Date();                       //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
          this.lableBlue = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)
          this.lableGreen = d.toJSON().slice(0,7).split('-').reverse().join('/')
          d.setMonth(d.getMonth() - 1)
          this.lableRed = d.toJSON().slice(0,7).split('-').reverse().join('/')
        }
        this.getData_month();           //tải dữ liệu lượng truy cập theo tháng
      }
      else                              //chế độ xem là Year
      {
        if(this.date != null)
        {
          var d = new Date(this.date);  //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
          this.lableBlue = d.getFullYear();   //năm hiện tại
          this.lableGreen = d.getFullYear()-1;//lui về 1 năm
          this.lableRed =d.getFullYear()-2;   //lui về hai năm
        }else{
          var d = new Date();           //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
          this.lableBlue = d.getFullYear();
          this.lableGreen = d.getFullYear()-1;
          this.lableRed =d.getFullYear()-2;
        }
        this.getData_year();            //tải dữ liệu lượng truy cập theo năm
      }
    },
    async getData_date(){                
      this.loaded = false;
      if(this.date == null){
        var d = new Date();       //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
      }
      else d= new Date(this.date);//tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
      this.dataBlue = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear());//lấy dữ liệu lượng truy cập theo ngày
      d.setDate(d.getDate() - 1)                                                                 //lui về một ngày 
      this.dataGreen = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear());
      d.setDate(d.getDate() - 1)                                                                 //lui về một ngày nữa
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
        var d = new Date();        //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
      }
      else d= new Date(this.date); //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
      this.dataBlue = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());//lấy dữ liệu lượng truy cập theo tháng
      d.setMonth(d.getMonth() - 1);                                                   //lui về một tháng
      this.dataGreen = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());
      d.setMonth(d.getMonth() - 1);                                                   //lui về một tháng nữa
      this.dataRed = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length) //kiểm tra tháng nào có nhiều ngày nhất nhất sẽ lấy tháng đó làm nhãn cho các cột trong biểu đồ (vì độ dài các tháng không bằng nhau 28 30 31) 
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length)) 
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_year(){
      this.loaded = false;
      if(this.date == null){
        var d = new Date();       //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
      }
      else d= new Date(this.date); //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
      this.dataBlue = await AnalystService.getYear(d.getFullYear());    //lấy dữ liệu lượng truy cập theo năm hiện tại
      this.dataGreen = await AnalystService.getYear(d.getFullYear()-1); //lấy dữ liệu lượng truy cập lui về 1 năm
      this.dataRed = await AnalystService.getYear(d.getFullYear()-2);   //lấy dữ liệu lượng truy cập lui về 2 năm
      this.setLable(this.dataBlue);                                     //chọn năm đầu tiên làm nhãn cho các cột trong biểu đồ vì năm nào cũng có 12 tháng
    },
    setLable(data)                                                      //hàm tạo danh sách lable cho các cột trong  biểu đồ 
    {
      this.lable=[];
      for (let i = 1; i <= data.length; i++) {//VD tháng 2 lable = [1,2,3,...,28]
        this.lable.push(i)
      };
      this.loaded = true;                     //set lable xong thì hoàn thành tải dữ liệu và show biểu đồ 
    },
    async getStorePerProvince(){             //gọi api lấy danh sách thống kê quán theo từng tỉnh
      var storePerPro = await AnalystService.getStorePerProvince();
      storePerPro.forEach(element => {
        this.lableProvince.push(element.provinceName);
        this.storePerProvince.push(element.soQuan);
      });
    },
    async getStorePerDistrict(){             //gọi api lấy danh sách thống kê quán theo từng quận ở tp hồ chí minh
      var storePerDis = await AnalystService.getStorePerDistrict('-MO5b_1K2_tF_C4GVDo3');
      storePerDis.forEach(element => {
        this.lableDistrict.push(element.districtName);
        this.storePerDistrict.push(element.soQuan);
      });
    },
    async getTotalView(){                                     
      this.totalView = await AnalystService.getAllView();   //lấy tổng view của website 
      var d = new Date();
      let total = await AnalystService.getDate(d.getDate(),d.getMonth() + 1,d.getFullYear()); //lấy lượng truy cập theo giờ của ngày hôm nay
      total.forEach(element =>{ 
        this.totalDay += parseInt(element);                                                   //tính tổng lượng truy câp
      })
      total = await AnalystService.getMonth(d.getMonth() + 1,d.getFullYear());                //lấy lượng truy cập theo ngày của tháng này
      total.forEach(element =>{
        this.totalMonth += parseInt(element);                                                 //tính tổng lượng truy câp
      });
      total = await AnalystService.getYear(d.getFullYear());                                  //lấy lượng truy cập theo tháng của năm nay
      total.forEach(element =>{
        this.totalYear += parseInt(element);                                                  //tính tổng lượng truy câp
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
