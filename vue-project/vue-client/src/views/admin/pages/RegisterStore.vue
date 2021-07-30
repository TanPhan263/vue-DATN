<template>
 <div class="d-flex align-items-center min-vh-100" style=" background-image: url('https://wallpaperaccess.com/full/1631410.jpg');">
  <CContainer >
    <CAlert
      style="width:100%"
            color="danger"
            closeButton
            :show.sync="showErr">
           {{ msg }}
      </CAlert>
    <div v-if="registered" class="alert-green">
      <div class="row">
      <i style="font-size: 70px; margin: 0px 20px 0 20px" class="fas fa-check"></i>
      <div style="width: 88%">
      <span class="closebtn" style="float: right; font-size: 20px" @click="registered=false">&times;</span> 
          <h4>Thông tin quán đã được ghi nhận</h4> <p>Bạn vui lòng đợi admin xác nhận thông tin. <br>Cám ơn bạn đãn chọn chúng tôi!!!</p>
          <br><a href="/"><strong>Về trang chủ</strong></a>
    </div>
    </div>
  </div>
      <h2 style="text-align:center;color:white;font-size:30px">ĐĂNG KÍ QUÁN</h2>
      <CRow  fluid v-if="page1" class="justify-content-center animation">
        
        <CCol md="7">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <a href="/"> <img class="imglogo" :src="logo" alt="viefood.info"></a>
                <h1>Thông tin của bạn</h1>
                <p class="text-muted">Create your account to manage your store</p>
                <CInput
                  placeholder="Username"
                  autocomplete="username"
                  v-model ="name"
                > </CInput>
                <CInput
                  placeholder="Phone number"
                  autocomplete="phone"
                  v-model ="phone"
                >
                </CInput>
                <CInput
                  placeholder="Email"
                  autocomplete="email"
                  v-model="mail"
                />
                 <CInput
                  placeholder="Password"
                  v-model="pass"
                  type="password"
                />
                <CButton class="btn_right" v-on:click="gotoNextPage(1)" block>Tiếp theo <i class="fas fa-arrow-right"></i></CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
  <CRow class="justify-content-center">
    <CCol v-if="page2" col="12" lg="6" class="animation">
      <CCard>
        <CCardHeader>
          <strong>THÔNG TIN QUÁN</strong>
        </CCardHeader>
         <CCardBody>
            <CForm>
              <CInput
                label="Tên quán"
                v-model="storeName"
                horizontal
                autocomplete="name"
               
              />
              <div class="row" style="margin-left: 0px;">
                <p class="lable-select">Khu vực</p>
                <select
                    id="province"
                    class="country fl_left select-template"
                    vertical
                    v-model="districtSelected"
                    placeholder="Địa điểm"
                    >
                    <option v-for="(district,index) in districts" v-bind:key="index" :value="district.provinceID">
                        {{district.districtName}}
                    </option>
                </select>
                </div>
              <CInput
                label="Địa chỉ"
                horizontal
                v-model="Store_address"
              ></CInput>
              <CInput
                label="Giờ mở"
                horizontal
                v-model="openTime"
                placeholder="07:00"
              />
               <CInput
                placeholder="23:00"
                label="Giờ đóng"
                horizontal
                v-model="closeTime"
              />
             <div class="row" style="margin-left: 0px;">
                <p class="lable-select">Loại</p>
                <select
                    id="province"
                    class="country fl_right select-template"
                    vertical
                    v-model="bussinessTypeSelected"
                    placeholder="Địa điểm"
                    >
                    <option v-for="busi in bussinessType" v-bind:key="busi.businessTypeID" :value="busi.businessTypeID">
                        {{busi.businessTypeName}}
                    </option>
                </select>
                </div>            
            </CForm>
          </CCardBody>
            <CCardFooter>
              <CButton  class="btn_left" @click="page1 = true, page2 = false, page3 = false,showErr = false"  block> <i class="fas fa-arrow-left"></i> Trở lại </CButton>
              <CButton  class="btn_right" @click="gotoNextPage(2)" block>Tiếp theo <i class="fas fa-arrow-right"></i></CButton>
      </CCardFooter>
      </CCard>
    </CCol>
    <CCol v-if="page3" lg="6" class="animation">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-justify-center"/>
          <strong>CHỌN ẢNH ĐẠI DIỆN QUÁN</strong>
        </CCardHeader>
        <CCardBody>
             <!-- <input
                type="file"
                @change="previewImage"
              /> -->
              <CInputFile
                horizontal
                custom
                @change="previewImage"
              />
        </CCardBody>
         <CCardFooter>
                <CButton  class="btn_left" @click="page1 = false, page2 = true, page3 = false"  block> <i class="fas fa-arrow-left"></i> Trở lại </CButton>
                <CButton class="btn_right" @click="onUpload" block>Đăng kí <i class="fas fa-check"></i></CButton>
      </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
  </CContainer>
 </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService.js';
import StoreService from '@/services/StoreService.js';
import ProvinceService from '@/services/ProvinceService.js'
import BussinessTypeService from '@/services/BussinessTypeService.js'
export default {
  name: 'Store',
  data () {
    return {
      registered: false,        //biến hiển thông báo đã đăng kí 
      page1: true,              //biến hiển thị trang 1
      page2: false,             //biến hiển thị trang 2
      page3: false,             //biến hiển thị trang 3
      districts:[],             //danh sách quận/huyện
      bussinessType:[],         //danh sách loại quán
      msg: '',                  //biến lưu nội dung thông báo 
      showErr: false,           //biến hiển thị Lỗi 
                                //thuộc tính của quán
      storeName:'',             
      districtSelected:'',      //id quận
      bussinessTypeSelected:'', //id loại quán 
      Store_address:'',         
      imageData: null,
      picture:'',
      openTime:'',
      closeTime:'',
                                //thuộc tính của user
      name: '', 
      phone: '',
      mail: '',
      type: '-MO5VWchsca2XwktyNAw' ,
      pass:'',
    }
  },
  methods: {
    async signUpStore(){        //hàm đăng kí quán
      try {
        if(this.checkPage1() && this.checkPage2()) //kiểm tra hai trang đầu đã điền đầy đủ thông tin hay chưa
        {
          const credentials = {                    //tạo một đối tượng người dùng với dữ liệu người dùng nhập vào
            userName: this.name,
            phone: this.phone,
            address: '',
            password: this.pass,
            email: this.mail,
            picture: '',
            sex: '',
            birthday: '',
            userTypeID: this.type,
            status:'-1'
          };
          let ownerID = await AuthService.registerOwner(credentials); //đăng kí user mới với vai trò lad chủ quán và api trả về id của user
          const credentialsStore = {              //tạo một đối tượng quán với dữ liệu người dùng nhập vào
            storeAddress: this.Store_address,
            storeName: this.storeName,
            storePicture:this.picture,
            openTime: this.openTime,
            cLoseTime: this.closeTime,
            userID: ownerID.toString(),
            provinceID: this.districtSelected,
            businessTypeID: this.bussinessTypeSelected,
            ratePoint: '0',
            khoangcach: '0',
            status:'-1'                           //status = -1 là quán đang chờ xác nhận
          };
          const response = await StoreService.registerStore(credentialsStore) //đăng kí quán mới
          this.registered=true;                   //hiện thông báo đk thành công 
          this.reset();                           //reset lại các biến 
        }else {
          this.showErr = true;                    //không thành công hiện thông báo lỗi 
        }
      }catch (error) {
        console.log(error);
      }
    },
    previewImage(event){                        //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
        this.picture=null;
        this.imageData= event.target.files[0];
    },
    onUpload(){
      this.picture='';
      if(this.imageData == null)
      {
        this.signUpStore();                      //nếu không có hình thì tiến hành đăng kí quán không cần ảnh
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData); //tải ảnh lên firebase
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { //trả về url của ảnh
          this.picture=url;                                      //gán url mới nhận vào hình ảnh của quán
          this.signUpStore();                                    //tiến hành đăng kí quán
          })
        }
      )
    },
    checkPage1(){                                               //hàm kiểm tra trang đầu tiên xem người dùng có nhập đầy đủ thông tin hay không
      if(this.name== '' || this.phone ==''|| this.email=='')
        {
            this.msg = 'Vui lòng nhập đầy đủ thông tin của bạn!'
            return false;
        }
      else{
        if(!this.ValidateEmail(this.mail)){                     //kiểm tra mail có đúng định dạng hay không
          this.msg="Email không hợp lệ";
          return false;
        }
        return true;
      }
    },
    checkPage2(){                                                  //hàm kiểm tra trang thứ 2 xem người dùng có nhập đầy đủ thông tin hay không
      if(this.openTime == '' || this.closeTime =='' || this.Store_address =='' || this.storeName == ''||
       this.bussinessTypeSelected=='' || this.districtSelected == '')
       {
         this.msg = "Vui lòng nhập đầy đủ thông tin quán của bạn"
         return false;
       }
      return true;
    },
    ValidateEmail(mail)                                           //kiểm tra mail có đúng định dạng hay không
    {
       var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (mail.match(validRegex)) {
            return true;
          } else {
            return false;
        }
    },
    reset(){                                                      //reset các biến trở lại như ban đầu
      this.openTime == ''; 
      this.closeTime ==''; 
      this.Store_address ==''; 
      this.storeName == '';
      this.bussinessTypeSelected==''; 
      this.districtSelected == '';
      this.name== '';
      this.phone =='';
      this.email=='';
      this.picture ='';
      this.page1 = true; this.page2 = false; this.page3= false;
    },
    gotoNextPage(index){                                          //thay đổi trang khi người dùng nhập xong dữ liệu 
      this.showErr = false;   
      switch(index){
        case 1: if(!this.checkPage1()){ this.showErr=true; return;} //kiểm tra đã điền đầy đủ chưa  
                this.page1 = false; this.page2 = true; this.page3= false; break;//mở trang 2
        case 2: if(!this.checkPage2()){ this.showErr=true; return;} //kiểm tra đã điền đầy đủ chưa  
                this.page1 = false; this.page2 = false; this.page3 = true; break; //mở trang 3
      }
    },
    async onInit(){                                               //hàm khởi tạo
      this.districts = await ProvinceService.getAllDistrict();    //lấy danh sách các quận
      this.districtSelected = this.districts[0].districtID;       //set mặc định là quận đầu tiên trong danh sách
      this.bussinessType = await BussinessTypeService.getAll();   //lấy danh sách các quận
    }
  },
   mounted(){
     this.onInit();                                               
  }
}
</script>
<style>
.alert-green {
    padding: 20px;
    background-color:limegreen;
    color: white;
}
.btn_left{
  width: 30%; border: 1px solid red; color: red; float: left; margin-top: 8px ;
}
.btn_right{
 width: 30%; border: 1px solid limegreen; color: limegreen; float: right;
}
.btn_left:hover{
  background: red; color: white;
}
.btn_right:hover{
  background: limegreen; color: white;
}
.select-template{
  width:72%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 15px;
}
.lable-select{
  width: 25%;
  float: left;
}
.animation {
  animation-duration: 1.5s;
  animation-name: slidein;
}
@keyframes slidein {
  from {
    margin-left: 20%;
    width: 100%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
a{
  text-decoration: none;
  color: white;
}
a:hover{
  text-decoration: none;
}
</style>
