<template>
<div>
  <CRow v-if="ready">
     <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="user.length.toString()"
          text="NGƯỜI DÙNG"
          color="gradient-primary"
          :icon-padding="false"
        >
        <i class="fas fa-user-friends" style="font-size: 25px"></i>
        </CWidgetIcon>
      </CCol>
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="store.length.toString()"
          text="QUÁN"
          color="gradient-info"
          :icon-padding="false"
        >
         <i class="fas fa-store-alt" style="font-size: 25px"></i>
        </CWidgetIcon>
      </CCol>
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="dishes.length.toString()"
          text="MÓN ĂN"
          color="gradient-warning"
          :icon-padding="false"
        >
         <i class="fas fa-utensils" style="font-size: 25px;padding-right: 5px"></i>
        </CWidgetIcon>
      </CCol>
      <CCol col="12" sm="6" lg="3">
        <CWidgetIcon
          :header="comments.length.toString()"
          text="BÌNH LUẬN"
          color="gradient-danger"
          :icon-padding="false"
        >
          <i class="fas fa-comments" style="font-size: 25px"></i>
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
                 <strong> Người dùng </strong>
                </CCardHeader>
                <CCardBody>
                 <div class="progress-group">
                    <div class="progress-group-header">
                      <i class="fas fa-dot-circle" style="font-size:17px;margin-right: 20px;padding-left: 5px; color: limegreen"></i>
                      <span class="title">Đang oline</span>
                      <span class="ml-auto font-weight-bold">
                        {{onlineUser}} <span class="text-muted small">({{Math.ceil((onlineUser/user.length)*100) + '%'}})</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(onlineUser/user.length)*100"
                        color="primary"
                      />
                    </div>
                  </div>
                 <div class="progress-group">
                    <div class="progress-group-header">
                      <i class="fab fa-facebook" style="font-size:17px;margin-right: 20px;padding-left: 5px;color: blue"></i>
                      <span class="title">Người dùng Facebook</span>
                      <span class="ml-auto font-weight-bold">
                         {{faceUser}} <span class="text-muted small">({{Math.ceil((faceUser/user.length)*100) + '%'}})</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(faceUser/user.length)*100"
                        color="primary"
                      />
                    </div>
                  </div>
                   <div class="progress-group">
                    <div class="progress-group-header">
                       <i class="fab fa-google" style="font-size:17px;margin-right: 20px;padding-left: 5px;color: red"></i>
                      <span class="title">Người dùng Google</span>
                      <span class="ml-auto font-weight-bold">
                        {{ggUser}} <span class="text-muted small">({{Math.ceil((ggUser/user.length)*100) + '%'}})</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(ggUser/user.length)*100"
                        color="primary"
                      />
                    </div>
                  </div>
                </CCardBody>
                <CCardHeader>
                 <strong> Doanh mục</strong>
                 <div style="float:right;">
                 <i class="fas fa-circle" style="font-size:15px;color:#1E90FF"></i> Quán
                 </div>
                </CCardHeader>
                <CCardBody style="overflow: auto;height: 400px">
                  <div v-for="(item, index) in bussiness" :key="index" class="progress-group">
                    <div class="progress-group-header">
                      <i class="fas fa-utensils" style="font-size:17px;margin-right: 20px;padding-left: 5px"></i>
                      <span class="title">{{item.businessTypetName}}</span>
                      <span class="ml-auto font-weight-bold">
                        {{item.soQuan}} <span class="text-muted small">({{Math.ceil((item.soQuan/store.length)*100) + '%'}})</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(item.soQuan/store.length)*100"
                        color="info"
                      />
                    </div>
                  </div>
                </CCardBody>
              </CCol>
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
                  <CCardHeader>
                 <strong> Khu vực Hồ Chí Minh</strong>
                 <div style="float:right;">
                  <i class="fas fa-circle" style="font-size:15px;color:#f9b115"></i> Quán
                 </div>
                </CCardHeader>
                <CCardBody style="overflow: auto;height: 310px">
                  <div v-for="(item, index) in storePerDistrict" :key="index" class="progress-group">
                    <div class="progress-group-header">
                      <i class="fa fa-map-marker" style="font-size:17px;margin-right: 20px;padding-left: 5px"></i>
                      <span class="title">{{item.districtName}}</span>
                      <span class="ml-auto font-weight-bold">
                        {{item.soQuan}} <span class="text-muted small">({{Math.ceil((item.soQuan/store.length)*100) + '%'}})</span>
                      </span>
                    </div>
                    <div class="progress-group-bars">
                      <CProgress
                        class="progress-xs"
                        :value="(item.soQuan/store.length)*100"
                        color="warning"
                      />
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
  </div>
</template>

<script>
import { CChartLineSimple, CChartBarSimple } from '../charts/index.js'
import StoreService from '@/services/StoreService.js'
import CommentService from '@/services/CommentService.js'
import UserService from '@/services/UserService.js'
import AnalystService from '@/services/AnalystService.js'
export default {
  name: 'WidgetsDropdown',
  components: { CChartLineSimple, CChartBarSimple },
  data(){
    return{
      user: [],
      store:[],
      comments:[],
      dishes:[],
      ready: false,
      onlineUser: 0,
      faceUser: 0,
      ggUser:0,
      rate1:0,
      rate2:0,
      rate3:0,
      rate4:0,
      rate5:0,
      bussiness : [],
      storePerDistrict:[],
    }
  },
  created(){
    this.onInit();
  },
  methods: {
     async onInit(){
      this.user = await UserService.getAll(localStorage.getItem('isAuthen'));
      this.getGoogleUser(this.user);
      this.getFacebookUser(this.user);
      this.store = await StoreService.getAll(); 
      this.getComments();
      this.dishes =  await StoreService.getAllDish(); 
      this.getOnlineUser();
      this.getStorePerBussinessType();
      this.getStorePerDistrict();
      this.ready = true;
    },
    async getOnlineUser(){
      this.onlineUser = await UserService.getOnlineUser();
    },
    getFacebookUser(array){
      for(let i = 0; i< array.length ; i++){
        console.log(array[i])
        if(array[i].idFacebook)
          this.faceUser = this.faceUser +1;
      }
    },
    getGoogleUser(array){
      for(let i = 0; i< array.length ; i++){
        if(array[i].idGoogle)
          this.ggUser = this.ggUser + 1;
      }
    },
    async getComments(){
		try{
      this.rate1=0; this.rate2=0; this.rate3=0; this.rate4=0;this.rate5=0;
			this.comments = await CommentService.getAll();
			this.comments.forEach(element => {
        switch(parseInt(element.ratePoint)){
          case 1: this.rate1+=1; break;
          case 2: this.rate2+=1; break;
          case 3: this.rate3+=1; break;
          case 4: this.rate4+=1; break;
          case 5: this.rate5+=1; break;
        }
      });
		}
		catch(err){console.log(err)}
		},
    async getStorePerBussinessType(){
      this.bussiness = await AnalystService.getStorePerBussinessType();
    },
    async getStorePerDistrict(){
      this.storePerDistrict = await AnalystService.getStorePerDistrict('-MO5b_1K2_tF_C4GVDo3');
    },
  },
}
</script>
<style>
::-webkit-scrollbar {
    width: 10px;
}
 
::-webkit-scrollbar-track {
    background-color: #ebebeb;
    -webkit-border-radius: 10px;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: #6d6d6d; 
}
</style>
