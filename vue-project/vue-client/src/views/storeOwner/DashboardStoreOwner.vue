<template>
  <div>
    <!-- <WidgetsDropdown/> -->
    <div class="popup" @click="openPopup">{{storeName}}
        <i class="fa fa-chevron-down" style="font-size: 16px;"></i>
    <span class="popuptext" id="myPopup">
        <div class="'container'">
        <div class="inbox_store" style="background: white;border:none; direction: rtl;width: 100%">
            <div class="headind_srch">
                <div class="recent_heading">
                <h4>Store</h4>
                </div>
                <div class="srch_bar">
                <div class="stylish-input-group">
                    <input  v-model="keywordStore" type="text" class="search-bar"  placeholder="Search"   v-on:keyup="onChangeStore(keywordStore)" >
                    <span class="input-group-addon">
                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                    </span> </div>
                </div>
          </div>
          <div class="inbox_chat" v-if="resultStore" style="direction: ltr;">
            <div v-for="(store,index) in resultStore" v-bind:key="index" :class="[storeID === store.storeID? 'chat_list active_chat':'chat_list']" @click="storeClicked(store.storeID,store.storeName)">
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
    <CCard>
      
      <CCardBody>
        
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" class="card-title mb-0">Thống kê lượng truy cập</h4>
          </CCol>
          <CCol sm="7" class="d-none d-md-block">
            <CButton color="primary" class="float-right">
              <CIcon name="cil-cloud-download"/>
            </CButton>
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
        <MainChartExample style="height:300px;margin-top:40px;" v-bind:data="data" v-bind:lable="lable"/>
        <CCol sm="5">
            <h4 id="traffic" class="card-title mb-0">Đánh giá quán</h4>
        </CCol>
        <CChartBarExample v-if="loadPoint" style="height:500px;margin-top:40px;" v-bind:data="point" />
      </CCardBody>
      <CCardFooter>
        <!-- <CRow class="text-center">
          <CCol md sm="12" class="mb-sm-2 mb-0">
            <div class="text-muted">Visits</div>
            <strong>29.703 Users (40%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="success"
              :value="40"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">Unique</div>
            <strong>24.093 Users (20%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="info"
              :value="20"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0">
            <div class="text-muted">Pageviews</div>
            <strong>78.706 Views (60%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="warning"
              :value="60"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0">
            <div class="text-muted">New Users</div>
            <strong>22.123 Users (80%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              color="danger"
              :value="80"
            />
          </CCol>
          <CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">Bounce Rate</div>
            <strong>Average Rate (40.15%)</strong>
            <CProgress
              class="progress-xs mt-2"
              :precision="1"
              :value="40"
            />
          </CCol>
        </CRow> -->
      </CCardFooter>
    </CCard>
    <!-- <WidgetsBrand/> -->
  </div>
</template>

<script>
import CChartBarExample from '../admin/charts/CChartBarExample'
import MainChartExample from '../admin/charts/MainChartExample'
import WidgetsDropdown from '../admin/widgets/WidgetsDropdown'
import WidgetsBrand from '../admin/widgets/WidgetsBrand'
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
    CChartBarExample
  },
  created(){
     this.optionChanged(this.selected);
  },
  mounted() {
      this.fetchStore();
      this.getDate();
      this.onScroll();
  },
  data () {
    return {
      loadPoint: false,
      point:[],
      scroll:'',
      store:[],
      resultStore: [],
      storeID:'',
      storeName:'',
      keywordStore:'',
      selected: 'Day',
      data: [],
      lable:[],
      day: 0,
      month: 0,
      year: 0,
      user:'',
      store:'',
      comments:'',
      dishes:''
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
    getDate(){
      var d = new Date();
      this.day= d.getDate();
      this.month = d.getMonth() + 1;
      this.year = d.getFullYear();
    },
    optionChanged(value){
      this.selected=value;
      if(value == 'Day')
      this.getData_date();
      else if(value == 'Month')
        this.getData_month();
      else 
        this.getData_year();
    },
    async getData_date(){
      this.data = await AnalystService.getDateStore(this.storeID,this.day,this.month,this.year);
      console.log(this.data);
      this.setLable(this.data.length);
    },
    async getData_month(){
      this.data = await AnalystService.getMonthStore(this.storeID,this.month,this.year);
      console.log(this.data);
      this.setLable(this.data.length);
    },
    async getData_year(){
      this.data = await AnalystService.getYearStore(this.storeID,this.year);
      console.log(this.data);
      this.setLable(this.data.length);
    },
    setLable(length)
    {
      this.lable=[];
      for (let i = 1; i <= length; i++) {
        this.lable.push(i)
      };
    },
    fetchStore(){
        const url = 'http://KLTN.somee.com/api/Store/GetAllManage'
        this.$http.get(url,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.store = response.data;
            this.resultStore= this.store;
            this.storeID=this.store[0].storeID;
            this.storeName=this.store[0].storeName;
            this.getComments();
        });
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
    storeClicked(id,name){
        this.storeID = id;
        this.storeName = name;
        this.selected = 'Day'
        this.getData_date();
        this.getComments();
    },
    onScroll(){
        window.onscroll = () => {
            if (document.documentElement.scrollTop > 100) {
                this.scroll= 'sticky';
            } else {
                this.scroll= '';
            }
        };
    },
    openPopup() {
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
	},
    async getComments(){
			try{
                this.loadPoint = false;
                let commentList = [];
                this.point = [0,0,0,0,0];
				commentList = await CommentService.getCommentByStore(this.storeID);
                console.log(commentList)
				let rate = 0;
				commentList.forEach(element => {
						rate+=parseInt(element.ratePoint)
						switch(parseInt(element.ratePoint)){
							case 1: this.point[0] +=1; break;
							case 2: this.point[1] +=1; break;
							case 3: this.point[2] +=1; break;
							case 4: this.point[3] +=1; break;
							case 5: this.point[4] +=1; break;
						}
						});
				this.averageRate=rate/commentList.length;
                console.log(this.point);
                this.loadPoint = true;
			}
			catch(err){console.log(err)}
		},
  }
}
</script>
<style>
@import url('../../assets/css/chat.css');
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