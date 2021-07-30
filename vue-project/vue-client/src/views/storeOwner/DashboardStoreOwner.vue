<template>
  <div>
    <div class="popup" @click="openPopup">{{storeName}}
        <i class="fa fa-chevron-down" style="font-size: 16px;"></i>
    <span class="popuptext" id="myPopup">
        <div class="'container'">
        <div class="inbox_store" style="background: white;border:none; direction: rtl;width: 100%">
            <div class="headind_srch">
                <div class="recent_heading">
                <h4>Store</h4>
                </div>
          </div>
          <div class="inbox_chat" v-if="resultStore" style="direction: ltr;">
            <div v-for="(store,index) in resultStore" v-bind:key="index" :class="[storeID === store.storeID? 'chat_list active_chat':'chat_list']" @click="storeClicked(store.storeID,store.storeName,store)">
              <div class="chat_people">
                <div class="chat_img"> <img v-lazy="store.storePicture" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{store.storeName}} <span class="chat_date"></span></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </span>
    </div>
    <CRow v-if="storeChoosed">
      <CCol col="12" sm="6" lg="6" v-if="storeChoosed.status === '1'">
          <CWidgetIcon
            header="TÌNH TRẠNG"
            text="Đang hoạt động"
            color="gradient-success"
            :icon-padding="false"
          >
           <i class="fas fa-check" style="font-size: 25px"></i>
          </CWidgetIcon>
        </CCol>
        <CCol col="12" sm="6" lg="6" v-else>
          <CWidgetIcon
            header="TÌNH TRẠNG"
            text="Quán đã bị chặn"
            color="gradient-danger"
            :icon-padding="false"
          >
          <i class="fas fa-ban" style="font-size: 25px"></i>
          </CWidgetIcon>
        </CCol>
        <CCol col="12" sm="6" lg="6" v-if="averageRate >= 3.5">
          <CWidgetIcon
            :header="averageRate + ' Sao'"
            text="ĐÁNH GIÁ CỦA người dùng"
            color="gradient-success"
            :icon-padding="false"
          >
          <i class="fas fa-laugh" style="font-size: 25px"></i>
          </CWidgetIcon>
        </CCol>
        <CCol col="12" sm="6" lg="6" v-else>
          <CWidgetIcon
            :header="averageRate + ' Sao'"
            text="ĐÁNH GIÁ CỦA QUÁN"
            color="gradient-danger"
            :icon-padding="false"
          >
           <i class="fas fa-frown-open" style="font-size: 25px"></i>
          </CWidgetIcon>
        </CCol>
    </CRow>

    <CRow>
      <CCol md="12">
        <CCard>
          <CCardBody>
            <CRow>
              <CCol sm="12" lg="6">
                <CCardHeader>
                 <strong> Đánh giá </strong>
                </CCardHeader>
                <CCardBody>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-star" class="progress-group-icon"/>
                      <span class="title">1 sao</span>
                       <span class="ml-auto font-weight-bold">
                        {{rate1}} <span class="text-muted small">({{Math.ceil((rate1/comments.length)*100)}} %)</span>
                       </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(rate1/comments.length)*100"
                        color="danger"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-star" class="progress-group-icon"/>
                      <span class="title">2 sao </span>
                        <span class="ml-auto font-weight-bold">
                        {{rate2}} <span class="text-muted small">({{Math.ceil((rate2/comments.length)*100)}} %)</span>
                       </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(rate2/comments.length)*100"
                        color="danger"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-star" class="progress-group-icon"/>
                      <span class="title">3 sao</span>
                        <span class="ml-auto font-weight-bold">
                        {{rate2}} <span class="text-muted small">({{Math.ceil((rate3/comments.length)*100)}} %)</span>
                       </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(rate3/comments.length)*100"
                        color="danger"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-star" class="progress-group-icon"/>
                      <span class="title">4 sao</span>
                        <span class="ml-auto font-weight-bold">
                        {{rate4}} <span class="text-muted small">({{Math.ceil((rate4/comments.length)*100)}} %)</span>
                       </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(rate4/comments.length)*100"
                        color="danger"
                      />
                    </div>
                  </div>
                  <div class="progress-group">
                    <div class="progress-group-header">
                      <CIcon name="cil-star" class="progress-group-icon"/>
                      <span class="title">5 sao</span>
                        <span class="ml-auto font-weight-bold">
                        {{rate5}} <span class="text-muted small">({{Math.ceil((rate5/comments.length)*100)}} %)</span>
                       </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(rate5/comments.length)*100"
                        color="danger"
                      />
                    </div>
                  </div>
                  </CCardBody>
              </CCol>
              <CCol sm="12" lg="6">
                <CCardHeader>
                 <strong>Bình luận</strong>
                </CCardHeader>
                <CCardBody style="overflow: auto;height: 230px">
                  <div v-for="(item, index) in comments" :key="index" class="progress-group" style="border-bottom: 1px solid #eee">
                    <div class="progress-group-header">
                      <img v-lazy="item.userPicture" height="40" width="40" style="border-radius: 50%;">
                     <CCol>
                      <span class="title"><strong>{{item.userName}}</strong></span>
                      <p style="height: 7px">{{item.date}}</p>
                     </CCol>
                      
                      <span class="ml-auto font-weight-bold">
                      {{item.ratePoint}} <CIcon name="cil-star" class="progress-group-icon"/>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                     {{item.content}}
                    </div>
                  </div>
                </CCardBody>
              </CCol>
            </CRow>
            <br/>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CCard>
      <CCardBody> 
        <CRow>
          <CCol sm="5">
            <strong id="traffic" style="font-size: 20px">Thống kê lượng truy cập</strong>
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
            <strong> Total: {{totalView }}</strong>
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
    <MangeMenu style="margin-bottom: 20px" v-if="storeChoosed" v-bind:menuID="storeID"/>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import CChartBarExample from '../admin/charts/CChartBarExample'
import MainChartExample from '../admin/charts/MainChartExample'
import WidgetsDropdown from '../admin/widgets/WidgetsDropdown'
import WidgetsBrand from '../admin/widgets/WidgetsBrand'
import MangeMenu from './manageMenu/MangeMenu'
import AnalystService from '@/services/AnalystService.js'
import StoreService from '@/services/StoreService.js'
import CommentService from '@/services/CommentService.js'
import AuthService from '@/services/AuthService.js'
export default {
   beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkStoreOwner(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'DashboardStoreOwner',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand,
    CChartBarExample,
    MangeMenu,
    DatePicker
  },
  created(){
     this.optionChanged(this.selected);
  },
  mounted() {
      this.fetchStore();
      this.getTotalView();
  },
  data () {
    return {  
      date: null,                   //biến chứa giá trị ngày
      loaded: false,                //biến cờ hiện loading trong khi load dữ liệu cho biểu đồ
      rate1:0,                      //số lượng đánh giá 1 sao
      rate2:0,                      //số lượng đánh giá 2 sao
      rate3:0,                      //số lượng đánh giá 3 sao
      rate4:0,                      //số lượng đánh giá 4 sao
      rate5:0,                      //số lượng đánh giá 5 sao
      averageRate:0,                //điểm trung bình của quán
      store:[],                     //danh sách quán
      resultStore: [],              //danh sách quán sau khi lọc bằng từ khóa
      storeID:'',                   //id quán đang xem
      storeName:'',                 //tên quán dang xem
      storeChoosed:'',              //thông tin quán đang xem 
      keywordStore:'',              //từ khóa để tìm quán
      selected: 'Day',              //biến chứa giá trị chế độ xem(Day,Month,Year)
      comments:'',                  //danh sách bình luận của quán
      dataBlue: [],                 //danh sách dữ liệu cho đường màu xanh nước trong bảng lượng truy cập
      dataGreen:[],                 //danh sách dữ liệu cho đường màu xanh lá trong bảng lượng truy cập
      dataRed:[],                   //danh sách dữ liệu cho đường màu đỏ trong bảng lượng truy cập
      lable:[],                     //nhãn cho các cột trong biểu đồ 
      lableBlue:'Hôm nay',          //nhãn cho đường màu xanh nước
      lableGreen: 'Hôm qua',        //nhãn cho đường màu xanh lá
      lableRed: '2 ngày trước',     //nhãn cho đường màu đỏ
      totalView:0,                  //tổng lượt truy cập của quán
      totalDay:0,                   //tổng lượt truy cập của quán trong ngày
      totalMonth:0,                 //tổng lượt truy cập của quán trong tháng
      totalYear:0,                  //tổng lượt truy cập của quán trong năm
    }
  },
  watch:{
    date(){                         //hàm bắt sự kiện khi giá trị biến date thay đổi
      if(this.date != null){        //nếu biến date khác null
        this.optionChanged('Day');  //tải dữ liệu lượng truy cập theo ngày với giá trị của biến date
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
    optionChanged(value){         //hàm tải dữ liệu lượng truy cập thi thay đổi chế độ xem (Day,Month ,Year)
      this.selected=value; 
      if(value == 'Day'){         //chế độ xem là Day
        if(this.date != null)
        {
          var d = new Date(this.date);                      //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
          this.lableBlue = d.toJSON().slice(0,10).split('-').reverse().join('/');//chuyển sang định dạng dd/mm/yyyy
          d.setDate(d.getDate() - 1);                                             //lui về một ngày 
          this.lableGreen = d.toJSON().slice(0,10).split('-').reverse().join('/');
          d.setDate(d.getDate() - 1);                                             //lui về một ngày nữa
          this.lableRed = d.toJSON().slice(0,10).split('-').reverse().join('/');
        }
        else{
          var d = new Date();                               //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
          this.lableBlue = d.toJSON().slice(0,10).split('-').reverse().join('/')
          d.setDate(d.getDate() - 1)
          this.lableGreen = d.toJSON().slice(0,10).split('-').reverse().join('/')
          d.setDate(d.getDate() - 1)
          this.lableRed = d.toJSON().slice(0,10).split('-').reverse().join('/')
        }
        this.getData_date();                              //tải dữ liệu lượng truy cập theo ngày
      } 
      else if(value == 'Month')                               //chế độ xem là Month
      {
        if(this.date != null)
        {
          var d = new Date(this.date);                       //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
          this.lableBlue = d.toJSON().slice(0,7).split('-').reverse().join('/');//chuyển sang định dạng /mm/yyyy
          d.setMonth(d.getMonth() - 1);                                         //lui về 1 tháng
          this.lableGreen = d.toJSON().slice(0,7).split('-').reverse().join('/');
          d.setMonth(d.getMonth() - 1);                                         //lui về 1 tháng nữa
          this.lableRed = d.toJSON().slice(0,7).split('-').reverse().join('/');
        }
        else{
          var d = new Date();                                 //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
          this.lableBlue = d.toJSON().slice(0,7).split('-').reverse().join('/');
          d.setMonth(d.getMonth() - 1);
          this.lableGreen = d.toJSON().slice(0,7).split('-').reverse().join('/');
          d.setMonth(d.getMonth() - 1);
          this.lableRed = d.toJSON().slice(0,7).split('-').reverse().join('/');
        }
        this.getData_month();                                 //tải dữ liệu lượng truy cập theo tháng
      }
      else
      {
        if(this.date != null)
        {
          var d = new Date(this.date);                        //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
          this.lableBlue = d.getFullYear();                   //năm hiện tại
          this.lableGreen = d.getFullYear()-1;                //lui về 1 năm
          this.lableRed =d.getFullYear()-2;                   //lui về 2 năm
        }else{
          var d = new Date();                                  //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
          this.lableBlue = d.getFullYear();
          this.lableGreen = d.getFullYear()-1;
          this.lableRed =d.getFullYear()-2;
        }
        this.getData_year();                                  //tải dữ liệu lượng truy cập theo năm
      }
    },
    async getData_date(){
      this.loaded = false;
      if(this.date == null){
        var d = new Date();                                   //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
      }
      else d= new Date(this.date);                            //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
      this.dataBlue = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear()); //lấy dữ liệu lượng truy cập theo ngày
      d.setDate(d.getDate() - 1);                                                                                   //lui về một ngày
      this.dataGreen = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      d.setDate(d.getDate() - 1);                                                                                   //lui về một ngày nữa
      this.dataRed = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length)
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length))
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_month(){
      this.loaded = false;
      if(this.date == null){
        var d = new Date();                                   //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
      }
      else d= new Date(this.date);                            //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
      this.dataBlue = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());//lấy dữ liệu lượng truy cập theo tháng
      d.setMonth(d.getMonth() - 1);                                                                     //lui về một tháng
      this.dataGreen = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      d.setMonth(d.getMonth() - 1);                                                                     //lui về một tháng nữa
      this.dataRed = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length)   //kiểm tra tháng nào có nhiều ngày nhất nhất sẽ lấy tháng đó làm nhãn cho các cột trong biểu đồ (vì độ dài các tháng không bằng nhau 28 30 31) 
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length))
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_year(){                                               
      this.loaded = false;
      if(this.date == null){
        var d = new Date();                                   //khi biến date chưa có dữ liệu thì sẽ lấy ngày hôm nay
      }
      else d= new Date(this.date);                            //tạo một giá trị Date với dữ liệu người dùng chọn từ datepicker
      this.dataBlue = await AnalystService.getYearStore(this.storeID,d.getFullYear());    //lấy dữ liệu lượng truy cập theo năm hiện tại
      this.dataGreen = await AnalystService.getYearStore(this.storeID,d.getFullYear()-1); //lấy dữ liệu lượng truy cập lui về 1 năm
      this.dataRed = await AnalystService.getYearStore(this.storeID,d.getFullYear()-2);   //lấy dữ liệu lượng truy cập lui về 2 năm
      this.setLable(this.dataBlue);                                                       //chọn năm đầu tiên làm nhãn cho các cột trong biểu đồ vì năm nào cũng có 12 tháng
    },
    setLable(data)                                             //hàm tạo danh sách lable cho các cột trong  biểu đồ 
    {
      this.lable=[];
      for (let i = 1; i <= data.length; i++) { //VD tháng 2 lable = [1,2,3,...,28]
        this.lable.push(i)
      };
      this.loaded = true;                       //set lable xong thì hoàn thành tải dữ liệu và show biểu đồ 
    },
    async fetchStore(){                         //tải danh sách quán của user
      var user = localStorage.getItem('userInfor');                 //lấy thông tin người dùng
      user = JSON.parse(user);                
      const token = localStorage.getItem('isAuthen');               //lấy token
      this.store = await StoreService.getByUser(user.userID,token); //lấy danh sách quán của người dùng
      this.storeChoosed = this.store[0];                            //set quán đang chọn la quán đầu tiên
      this.resultStore = this.store;                                //danh sách kết quả tìm quán = danh sách quán vì lúc này người dùng chưa tìm kiếm
      this.storeID = this.store[0].storeID;                         //gán dữ liệu id quán
      this.storeName=this.store[0].storeName;                       //gán dữ liệu tên quán
      this.totalView = this.store[0].numberView;                   //gán dữ liệu tổng lượt view của quán
      this.averageRate = this.store[0].ratePoint;                   //lấy điểm của quán
      this.getComments(this.storeChoosed.storeID);                  //lấy danh sách bình luận
    },
    onChangeStore(key){                                             //tìm kiếm quán theo từ khóa
        if(key == '' || key == null)                              
          return this.resultStore=this.store;                       //nếu từ khóa rỗng thì không tìm trả về danh sách ban đầu
        else {
          this.resultStore = this.store.filter(function(item){      //lọc những quán có tên chứa từ khóa 
            return item.storeName.toLowerCase().includes(key.toLowerCase());
        })
      }    
    },
    storeClicked(id,name,store){                                    //hàm thay đổi dữ liệu Khi nhấn vào một quán trong inbox
      this.storeChoosed = store;                                    //gán quán vừa chọn vào biến storeChoosed
      this.storeID = id;                                            //Lấy id quán
      this.storeName = name;                                        //lấy tên quán
      this.averageRate = store.ratePoint;                           //lấy điểm quán
      this.selected = 'Day'                                         //set lại chế độ xem lượng truy cập là ngày
      this.getData_date();                                          //lấy thông tin lượng truy cập theo ngày
      this.getComments(this.storeChoosed.storeID);                  //lấy danh sách comment
      this.$root.$refs.MangeMenu.changeMenus(id);                   //gọi hàm thay đổi menu ở component MangeMenu
    },
    openPopup() {                                                   //hiện popup danh sách quán
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
	  },
    async getComments(id){                                          //lấy danh sách các comment và tính toán đánh giá
			try{
        this.rate1=0; this.rate2=0; this.rate3=0; this.rate4=0;this.rate5=0; //đưa các biến đếm về 0 trước khi tính 
        this.comments = await CommentService.getCommentByStore(id);          //lấy danh sách tất cả comments
				let rate = 0;
				this.comments.forEach(element => {                                   //đếm số lượng từng loại đánh giá trong danh sách
						rate+=parseInt(element.ratePoint)
						switch(parseInt(element.ratePoint)){
							case 1: this.rate1 +=1; break;
							case 2: this.rate2 +=1; break;
							case 3: this.rate3 +=1; break;
							case 4: this.rate4 +=1; break;
							case 5: this.rate5 +=1; break;
						}
						});
			}
			catch(err){console.log(err)}
		},
    async getTotalView(){                   //thống kê lượt view của quán
      var d = new Date();
      //lấy thống view trong ngày của quán
      let total = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      //tính tổng view trong ngày 
      total.forEach(element =>{
        this.totalDay += parseInt(element);
      })
      //lấy thống view trong tháng của quán
      total = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      //tính tổng view trong tháng
      total.forEach(element =>{
        this.totalMonth += parseInt(element);
      });
      //lấy thống view trong năm của quán
      total = await AnalystService.getYearStore(this.storeID,d.getFullYear());
      //tính tổng view trong năm
      total.forEach(element =>{
        this.totalYear += parseInt(element);
      });
    }
  }
}
</script>
<style>
@import url('../../assets/css/chat.css');
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
/* Popup container */
.popup {
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #B8B8B8;
    font-size: 30px;
    position: relative;
    display: inline-block;
    cursor: pointer;
}

/* The actual popup (appears on top) */
.popup .popuptext {
  border: 1px solid #B8B8B8;
  visibility: hidden;
  width: 400px;
  height: 550px;
  background-color: #fff;
  color: #fff;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  top: 125%;
  left: 50%;
  margin-left: -80px;
}

/* Toggle this class when clicking on the popup container (hide and show the popup) */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 1;}
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity:1 ;}
}

</style>