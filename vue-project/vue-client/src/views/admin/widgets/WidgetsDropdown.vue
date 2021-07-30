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
      user: [],             //danh sách người dùng
      store:[],             //danh sách quán
      comments:[],          //danh sách comment
      dishes:[],            //danh sách món ăn
      ready: false,         //biến cho biết đã tải xong 
      onlineUser: 0,        //số người dùng đang ol
      faceUser: 0,          //số người dùng đăng nhập bằng facebook
      ggUser:0,             //số người dùng đăng nhập bằng google
      rate1:0,              //số lượng đánh giá 1 sao
      rate2:0,              //số lượng đánh giá 2 sao
      rate3:0,              //số lượng đánh giá 3 sao
      rate4:0,              //số lượng đánh giá 4 sao
      rate5:0,              //số lượng đánh giá 5 sao
      bussiness : [],       //danh sách thống kê quán theo từng loại quán
      storePerDistrict:[],  //danh sách thống kê quán theo từng quận
    }
  },
  created(){
    this.onInit();          //hàm khởi tạo 
  },
  methods: {
     async onInit(){
      this.user = await UserService.getAll(localStorage.getItem('isAuthen'));//lấy danh sách người dùng
      this.getGoogleUser(this.user);                                         //hàm lọc ra người dùng google
      this.getFacebookUser(this.user);                                       //hàm lọc ra người dùng facebook
      this.store = await StoreService.getAll();                              //lấy tất cả các quán
      this.getComments();                                                    //lấy danh sách các comment và tính toán đánh giá
      this.dishes =  await StoreService.getAllDish();                        //lấy danh sách tất cả các món ăn
      this.getOnlineUser();                                                  //lấy số người đang online
      this.getStorePerBussinessType();                                       //lấy danh sách thống kê quán theo từng loại quán                          
      this.getStorePerDistrict();                                            //lấy danh sách thống kê quán theo từng quận
      this.ready = true;                                                     //tải hoàn tất
    },
    async getOnlineUser(){                                                   //hàm lấy số người đang online
      this.onlineUser = await UserService.getOnlineUser();
    },
    getFacebookUser(array){                                                  //hàm lọc ra người dùng facebook  
      for(let i = 0; i< array.length ; i++){  
        if(array[i].idFacebook)                                              //nếu có thuộc tính idFacebook thì tăng số lượng người dùng facebook lên
          this.faceUser = this.faceUser +1;
      }
    },
    getGoogleUser(array){                                                     //hàm lọc ra người dùng google  
      for(let i = 0; i< array.length ; i++){
        if(array[i].idGoogle)                                                 //nếu có thuộc tính idFacebook thì tăng số lượng người dùng google lên
          this.ggUser = this.ggUser + 1;
      }
    },
    async getComments(){                                                      //lấy danh sách các comment và tính toán đánh giá
		try{
      this.rate1=0; this.rate2=0; this.rate3=0; this.rate4=0;this.rate5=0;    //đưa các biến đếm về 0 trước khi tính 
			this.comments = await CommentService.getAll();                          //lấy danh sách tất cả comments
			this.comments.forEach(element => {                                      //đếm số lượng từng loại đánh giá trong danh sách
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
    async getStorePerBussinessType(){                                         //gọi api lấy danh sách thống kê quán theo từng loại quán
      this.bussiness = await AnalystService.getStorePerBussinessType();
    },
    async getStorePerDistrict(){                                              //gọi api lấy danh sách thống kê quán theo từng quận của tp hồ chí minh
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
