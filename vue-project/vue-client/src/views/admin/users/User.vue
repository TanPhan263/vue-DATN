<template>
<CRow>
    <CCol md="12">
      <div v-if="status === '-1'" class="alert-red" >
            <div class="row">
              <div style="width: 100%">
              <h4>Tài khoản chưa được kích hoạt</h4> <p>Nhấn để kích hoạt </p>
                <CButton style="margin-right: 20px"  @click="confirmAccount()" class="btn_left" type="submit" size="sm" color="warning"><CIcon name="cil-check-circle"/> Kích hoạt</CButton>
                 <CButton  @click="deleteAccount" class="btn_left" type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Xóa</CButton>
            </div>
          </div>
        </div>
      <div v-if="status === '2'" class="alert-red">
            <div class="row">
              <div style="width: 100%">
              <h4>Tài khoản này đang bị chặn</h4> <p>Nhấn để bỏ chặn</p>
                <CButton style="margin-right: 20px"  @click="unblockAccount()" class="btn_left" type="submit" size="sm" color="warning"><CIcon name="cil-check-circle"/>Bỏ chặn</CButton>
            </div>
          </div>
      </div>
    </CCol>
     <CCol md="4">
        <CCard>
          <CCardBody style="width:100%;">
            <CForm style="width:100%;" class="center_div">
               <div class="center_div">
                <div style="width:100%;" class="profile">
                <img 
                  style="border-radius:50%; height:150px;width:150px;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    width: 60%;"
                    v-lazy="picture"
                />
                </div>
               </div>
              <CCardHeader style="text-align:center; height: 50px;">
              </CCardHeader>    
                <CCardHeader style="text-align:center; height: 50px;">
                <h4>{{userName}}</h4>
              </CCardHeader>               
            <!-- <CRow form class="form-group" @click="status=!status" style="margin-top:20px;">
             <h5> Ban account </h5>
              <CSwitch 
                class="mr-1"
                color="danger"
                :checked="check"
                shape="pill"
              />
              <div style="float:right;width: 40%">
                <h5>Nhắn tin</h5> <CIcon name="cil-envelope-closed" />
              </div>
            </CRow> -->
            <CCardBody style="display: flex;
              justify-content: center;
              align-items: center;">
            <CButtonGroup  size="sm">
             <CButton @click="openChat" color="info">Nhắn tin</CButton>
              <CButton v-if="status === '2'" @click="unblockAccount()" color="danger">Bỏ chặn</CButton>
              <CButton @click="blockAccount()" v-else color="danger">Chặn</CButton>
            </CButtonGroup>
            </CCardBody>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton  @click="onUpload" class="btn_left" type="submit" size="sm" color="primary"><CIcon name="cil-check-circle"/> Update</CButton>
            <CButton  class="btn_right" type="reset" size="sm" color="danger"><CIcon name="cil-ban"/> Back</CButton>
          </CCardFooter>
        </CCard>
      </CCol>
       <CCol md="8">
        <CCard>
          <CCardHeader>
            <strong>Thông tin người dùng</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow>
                <CCol sm="4">
                <CInput
                  label="Id user"
                  disabled
                  :value="userID"
                />
                </CCol>
                <CCol sm="8">
                <CInput
                  label="Họ tên"
                  autocomplete="name"
                  v-model="userName"
                />
                </CCol>
              </CRow>
              <CInput
                label="Địa chỉ"
                v-model="address"
              ></CInput>
                <CRow>
                  <CCol sm="6">
              <CInput
                label="Số điện thoại"
                v-model="phone"
              />
              </CCol>
              <CCol sm="6">
              <CInput
                label="Ngày sinh"
                v-model="birthday"
              />
                </CCol>
                 </CRow>
                 <CRow>
                <CCol sm="6">
                <p>Quyền</p>
                <select
                    id="usertype"
                    style="height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-top: -10px"
                    class="country fl_left selectbox"
                    vertical
                    v-model="userTypeID"
                    >
                    <option v-for="userType in userTypes" v-bind:key="userType.userTypeID" :value="userType.userTypeID">
                        {{userType.userTypeName}}
                    </option>
                </select>
                </CCol>
             <CCol sm="6">
              <CInput
                label="Email "
                placeholder="Enter your email"
                type="email"
                autocomplete="email"
                required
                was-validated
               v-model="email"
              />
             </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
     
      <CCol md="12">
      <CCard>
        <CCardHeader >
            <strong  style="font-size: 28px">Quán đang quản lý</strong>
            <CInput style="float:right"
                v-model="keyword"
                placeholder="Tìm quán"
                v-on:keyup="onChange(keyword)"
              />
            </CCardHeader>
          <CCardBody>
          <CDataTable
            class="mb-0 table-outline"
            hover
            border
            striped
            small
            fixed
            :items="result"
            :fields="fields"
            :items-per-page="5"
            clickable-rows
            :active-page="activePage"
            @row-clicked="rowClicked"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #status="data">
              <td>
                <CBadge :color="getBadge(data.item.status)">
                  {{data.item.status}}
                </CBadge>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
      </CCol>
       <ChatAdmin style="display: none"/>
    </CRow>
</template>
            
<script>
import axios from 'axios';
import firebase from '@/firebase/init.js';
import UserService from '@/services/UserService.js';
import AuthService from '@/services/AuthService.js';
import StoreService from '@/services/StoreService';
import ChatAdmin from '../chat/chatAdmin.vue'
export default {
  name: 'User',
  components:{
    ChatAdmin
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      AuthService.checkUser(localStorage.getItem('isAuthen'));//kiểm tra có đăng nhập hay không 
      AuthService.checkAdmin(localStorage.getItem('isAuthen'));//kiểm tra quyền có là admin hay khong 
      next();
      vm.usersOpened = from.fullPath.includes('users')
    })
  },
  data () {
    return {
        keyword: '',                    //từ khóa để tim kiếm quán
        //thuộc tính của người dùng           
        userTypes: null,
        userID: '',
        userName: '',
        phone: '',
        address: '',
        password: '',
        email: '',
        picture: null,
        imageData: null,
        sex: '',
        birthday: '',
        userTypeID: '',
        status: '',
        items: [],                    //danh sách quán mà người dùng làm chủ
        result:[],                    //danh sách quán sau khi lọc bằng từ khóa
        activePage: 1,                //trang hiển thị của bảng
        fields: [                     //các trường trong bảng quán
        { key: 'storeName', label: 'Tên quán', _classes: 'font-weight-bold' },
        { key: 'storeAddress', label: 'Địa chỉ', _classes: 'font-weight-bold' },
        { key: 'openTime', label: 'Giờ mở cửa', _classes: 'font-weight-bold' },
        { key: 'cLoseTime', label: 'Giờ đóng cửa', _classes: 'font-weight-bold' },
        { key: 'ratePoint', label: 'Đánh giá', _classes: 'font-weight-bold' },
      ],
    };
  },
  computed: {
  },
  methods: {
    async onInit(){
      const token = localStorage.getItem('isAuthen');//lấy token
      const id = this.$route.params.id;//lấy id người dùng 
      const userData = await UserService. getUserbyID(id,token); //lấy thông tin người dùng
      this.userTypes = await UserService.getUserType(localStorage.getItem('isAuthen'));//lấy loại người dùng 
      //gán thông tin cho các biến thuộc tính 
      this.userID = userData[0].userID;
      this.userName = userData[0].userName;
      this.phone = userData[0].phone;
      this.address = userData[0].address;
      this.password = null;
      this.email = userData[0].email;
      this.picture = userData[0].picture;
      this.sex = userData[0].sex;
      this.birthday = userData[0].birthday;
      this.userTypeID = userData[0].userTypeID;
      // if(userData[0].status == '1') this.status == false;
      // else this.status = true;
      this.status = userData[0].status;
      this.items = await StoreService.getByUser(this.userID,token);
      this.result = this.items;
    },
    goBack() {//hàm trở về trang user
      this.usersOpened ? this.$router.go(-1) : this.$router.push({path: '/users'})
      },
      previewImage(event){ //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
          this.picture=null;
          this.imageData= event.target.files[0];
      },
      onUpload(){
        if(this.imageData != null){
        const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);//tải ảnh lên firebase
        storageRef.on(`state_change`, snapshot => {
          this.uploadValue=(snapshot.bytesTransfered/snapshot.totalBytes)*100;
        },error =>{console.log(error.message)},
        ()=> {
          this.uploadValue=100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => { //trả về url của ảnh
            this.picture=url;                                      //gán url mới nhận vào hình ảnh của người dùng
              this.update();                                       //tiến hành update
            })
          }
        )
        }
        else{ this.update(); //nếu không có hình thì tiến hành update không cần ảnh
        }
      },
      update(){                                 //update thông tin user
        const id = this.$route.params.id;       //lấy id user
        const credentials = {                   //tạo một đối tượng người với dữ liệu người dùng nhập vào             
        userName: this.userName,
        phone: this.phone,
        address: this.address,
        email: this.email,
        picture: this.picture,
        sex: this.sex,
        birthday: this.birthday,
        userTypeID: this.userTypeID,
        status : this.status.toString()
        };
        //gọi api update thông tin người dùng
        axios.post("https://api.viefood.info/api/User/EditByID?id=" + id, credentials ,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(respone =>{ 
          alert(respone.data)})
      },
      async deleteAccount(){                                          //xóa tai khoản
        const response = await UserService.delete(this.userID,localStorage.getItem('isAuthen'))//gọi api xóa
        alert(response);                                                                        //hiển thị thông báo
      },
      async confirmAccount(){                                         //xác nhận tài khoản
        const id = this.$route.params.id;
        const response =  await UserService.block(localStorage.getItem('isAuthen'), id, '1');//gọi api đổi status 
        alert(response);                                                                      //hiển thị thông báo
        this.onInit();                                                                        //load lại tài khoản
      },
      async unblockAccount(){                                          //kích hoạt tài khoản
        const id = this.$route.params.id;
        const response = await UserService.block(localStorage.getItem('isAuthen'), id, '1');//gọi api đổi status 
        alert(response);                                                                    //hiển thị thông báo
        this.onInit();                                                                      //load lại tài khoản
      },
      async blockAccount(){                                           //chặn hoạt tài khoản
        const id = this.$route.params.id;
        const response = await UserService.block(localStorage.getItem('isAuthen'), id, '2');//gọi api đổi status 
        alert(response);                                                                    //hiển thị thông báo
        this.onInit();                                                                      //load lại tài khoản
      },
      openChat(){                                                      //hàm chuyển đến trang chat                        
      this.$router.push('/manage/chats')
      this.$root.$refs.chatAdmin.createInbox(this.userID, this.userName, this.picture,'none');//gọi hàm tạo inbox mới ở component chatAdmin
      },
      onChange(key){                                                    //tìm kiếm quán theo từ khóa
        if(key == '' || key == null)                                    //nếu từ khóa rỗng thì không tìm trả về danh sách ban đầu
          return this.result = this.items;
        else {
          this.result = this.items.filter(function(item){               //lọc những quán có tên chứa từ khóa
          return item.storeName.toLowerCase().includes(key.toLowerCase());
        })
        console.log(this.result)}
      },
      rowClicked(item) {                                                //đi đến trang chi tiết quán khi nhấn vào quán trong bảng
       this.$router.push({path: `/manage/store/${item.storeID}`})
      },
      pageChange (val) {                                                  //bắt sự kiện thay đổi trang của bảng
        this.$router.push({ query: { page: val }})
      },
    },
    mounted(){
      this.onInit();                            //khởi tạo và gán data
  } 
}
</script>
<style>
.btn_left{
  float: left;
  width:100px;
}
.btn_right{
  float: right;
  width: 100px;
}
.center_div{
    margin: 0 auto; 
}
.profile{
  background-image: url('../../../assets/imgs/profile.jpg'); 
  padding-top: 30px;
  margin-bottom: -40px;
}
.alert-red {
    padding: 20px;
    background-color:#CD5C5C;
    color: white;
  }
.selectbox{
  width: 100%;
}
</style>