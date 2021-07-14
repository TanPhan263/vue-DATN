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
                <!-- <div class="srch_bar">
                <div class="stylish-input-group">
                    <input  v-model="keywordStore" type="text" class="search-bar"  placeholder="Search"   v-on:keyup="onChangeStore(keywordStore)" >
                    <span class="input-group-addon">
                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                    </span> </div>
                </div> -->
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
          <CCol sm="7" class="d-none d-md-block">
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
    MangeMenu
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
      loadPoint: false,
      loaded: false,
      rate1:0,
      rate2:0,
      rate3:0,
      rate4:0,
      rate5:0,
      averageRate:0,
      store:[],
      resultStore: [],
      storeID:'',
      storeName:'',
      storeChoosed:'',
      keywordStore:'',
      selected: 'Day',
      // day: 0,
      // month: 0,
      // year: 0,
      // user:'',
      // store:'',
      comments:'',
      // dishes:'',
      dataBlue: [],
      dataGreen:[],
      dataRed:[],
      lable:[],
      lableBlue:'Hôm nay',
      lableGreen: 'Hôm qua',
      lableRed: '2 ngày trước',
      totalView:0,
      totalDay:0,
      totalMonth:0,
      totalYear:0,
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
        this.lableBlue = 'Hôm nay';
        this.lableGreen = 'Hôm qua';
        this.lableRed = '2 Ngày trước';
        this.getData_date();
      }
      else if(value == 'Month')
      {
        this.lableBlue = 'Tháng này';
        this.lableGreen = 'Tháng trước';
        this.lableRed = '2 Tháng trước';
        this.getData_month();
      }
      else
      {
        this.lableBlue = 'Năm này';
        this.lableGreen = 'Năm trước';
        this.lableRed = '2 Năm trước'
        this.getData_year();
      }
    },
    async getData_date(){
      this.loaded = false;
      var d = new Date();
      this.dataBlue = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      d.setDate(d.getDate() - 1)
      this.dataGreen = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      d.setDate(d.getDate() - 1)
      this.dataRed = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length)
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length))
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_month(){
      this.loaded = false;
      var d = new Date();
      this.dataBlue = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      console.log(this.dataBlue);
      d.setMonth(d.getMonth() - 1);
      this.dataGreen = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      d.setMonth(d.getMonth() - 1);
      this.dataRed = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      if(this.dataBlue.length >= this.dataGreen.length && this.dataBlue.length >=this.dataRed.length)
          this.setLable(this.dataBlue);
      else if ((this.dataGreen.length >= this.dataBlue.length && this.dataGreen.length >=this.dataRed.length))
          this.setLable(this.dataGreen);
      else this.setLable(this.dataRed);
    },
    async getData_year(){
      this.loaded = false;
      var d = new Date();
      this.dataBlue = await AnalystService.getYearStore(this.storeID,d.getFullYear());
      this.dataGreen = await AnalystService.getYearStore(this.storeID,d.getFullYear()-1);
      this.dataRed = await AnalystService.getYearStore(this.storeID,d.getFullYear()-2);
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
    async fetchStore(){
      var user = localStorage.getItem('userInfor');
      user = JSON.parse(user);
      const token = localStorage.getItem('isAuthen');
      this.store = await StoreService.getByUser(user.userID,token);
      this.storeChoosed = this.store[0];
      this.resultStore = this.store;
      this.storeID = this.store[0].storeID;
      this.storeName=this.store[0].storeName;
      this.totalView = this.store[0].numberView;
      this.getComments(this.storeChoosed.storeID);
      // const url = 'https://api.viefood.info/api/Store/GetAllManage'
      // this.$http.get(url,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
      //     this.store = response.data;
      //     this.storeChoosed = this.store[0];
      //     this.resultStore = this.store;
      //     this.storeID = this.store[0].storeID;
      //     this.storeName=this.store[0].storeName;
      //     this.getComments(this.storeChoosed.storeID);
      // });

    },
    onChangeStore(key){
          if(key == '' || key == null)
            return this.resultStore=this.store;
          else {
            this.resultStore = this.store.filter(function(item){
             return item.storeName.toLowerCase().includes(key.toLowerCase());
          })
        }    
    },
    storeClicked(id,name,store){
        this.storeChoosed = store;
        this.storeID = id;
        this.storeName = name;
        this.selected = 'Day'
        this.getData_date();
        this.getComments(this.storeChoosed.storeID);
        this.$root.$refs.MangeMenu.changeMenus(id);
    },
    openPopup() {
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
	  },
    async getComments(id){
			try{
        this.loadPoint = false;
        this.rate1=0; this.rate2=0; this.rate3=0; this.rate4=0;this.rate5=0;
        this.comments = await CommentService.getCommentByStore(id);
				let rate = 0;
				this.comments.forEach(element => {
						rate+=parseInt(element.ratePoint)
						switch(parseInt(element.ratePoint)){
							case 1: this.rate1 +=1; break;
							case 2: this.rate2 +=1; break;
							case 3: this.rate3 +=1; break;
							case 4: this.rate4 +=1; break;
							case 5: this.rate5 +=1; break;
						}
						});
        if(this.comments.length == 0)
          this.averageRate = 0;
				else this.averageRate = rate/this.comments.length;
        this.loadPoint = true;
			}
			catch(err){console.log(err)}
		},
    async getTotalView(){
      var d = new Date();
      let total = await AnalystService.getDateStore(this.storeID,d.getDate(),d.getMonth() + 1,d.getFullYear());
      total.forEach(element =>{
        this.totalDay += parseInt(element);
      })
      total = await AnalystService.getMonthStore(this.storeID,d.getMonth() + 1,d.getFullYear());
      total.forEach(element =>{
        this.totalMonth += parseInt(element);
      });
      total = await AnalystService.getYearStore(this.storeID,d.getFullYear());
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