<template>
  <CRow>
    <CModal
      title="Thêm người dùng"
      :show.sync="primaryModal"
      color="primary"
      @update:show="closeModal"
    >
    <CRow>
      <CCol sm="8">
    <CInput
    label="Tên User "
      v-model ="userName"
    />
      </CCol>
       <CCol sm="4">
      <p>Quyền</p>
      <select
          id="usertype"
          style="width:100%;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;margin-top: -10px;"
          class="country fl_left"
          vertical
          v-model="userTypeID"
          placeholder="chọn tỉnh"
          >
          <option v-for="userType in userTypes" v-bind:key="userType.userTypeID" :value="userType.userTypeID">
              {{userType.userTypeName}}
          </option>
      </select>
      </CCol>
    </CRow>
    <CInput
        label="Địa chỉ"
      v-model="userAddress"
    />
      <CInput
        label="Mật khẩu"
      v-model="password"
    />
    <CRow>
      <CCol sm="4">
      <CInput
        label="Giới tính"
      v-model="sex"
    />
      </CCol>
       <CCol sm="8">
    <CInput
        label="Ngày sinh"
      v-model="birthday"
    />
       </CCol>
    </CRow>
    <CRow>
      <CCol sm="6">
      <CInput
        label="Số điện thoại"
      v-model="userPhone"
    />
      </CCol>
       <CCol sm="6">
    <CInput
      label="Email "
      description="Please enter your email"
      placeholder="Enter your email"
      type="email"
      autocomplete="email"
      required
      was-validated
      value=''
      v-model="email"
    />
       </CCol>
    </CRow>
    <CCol sm="12">
    <p>Hình đại diện</p>
    <input type="file"  @change="previewImage">
    </CCol>
    </CModal>
    <CCol>
      <CCard class="center_div">
        <CCardHeader>
            <strong style="font-size: 25px;">Quản lý người dùng</strong>
            <CButton @click="openModal" style="margin-left: 20px; height: 35px; float: right" color="primary" >Thêm User</CButton>
            <CInput
            style="float: right"
                      v-model="keyword"
                      placeholder="Tìm User"
                      v-on:keyup="onChange(keyword)"
              />
          
           <!-- <transition v-if="active" >
              <div class="modal-mask">
              <div class="modal-wrapper"  >
                <div class="modal-container" style="width: 600px;
                height: 600px;
                overflow: auto;">

                <div class="modal-header">
                  <slot name="header">
                  <h3>Thêm User</h3>
                  </slot>
                </div>

                <div class="modal-body">
                  <slot name="body">
                    <CInput
                    label="Tên User "
                      v-model ="userName"
                    />
                     <CInput
                       label="Địa chỉ"
                      v-model="userAddress"
                    />
                    <p>Quyền</p>
                    <select
                        id="usertype"
                        style="width:490px;height:35px;border-radius:4px; border: 1px solid #D3D3D3; margin-bottom: 10px;"
                        class="country fl_left"
                        vertical
                        v-model="userTypeID"
                        placeholder="chọn tỉnh"
                        >
                        <option v-for="userType in userTypes" v-bind:key="userType.userTypeID" :value="userType.userTypeID">
                            {{userType.userTypeName}}
                        </option>
                    </select>
                     <CInput
                       label="Mật khẩu"
                      v-model="password"
                    />
                     <CInput
                       label="Giới tính"
                      v-model="sex"
                    />
                    <CInput
                       label="Ngày sinh"
                      v-model="birthday"
                    />
                     <CInput
                       label="Số điện thoại"
                      v-model="userPhone"
                    />
                   <CInput
                      label="Email "
                      description="Please enter your email"
                      placeholder="Enter your email"
                      type="email"
                      autocomplete="email"
                      required
                      was-validated
                      value=''
                      v-model="email"
                    />
                    <div class="row" style="margin-left: 0px;">
                    </div>
                        <p>Hình đại diện</p>
                        <div class="row">
                        <input type="file"  @change="previewImage">
                        </div>
                      </slot>
                    </div>

                <div class="modal-footer">
                  <slot name="footer">
                  <button class="btn btn-danger" @click="active=false">
                    Close
                  </button>
                   <button class="btn btn-primary" @click="onUpload">Add</button>
                  </slot>
                </div>
                </div>
              </div>
              </div>
            </transition> -->
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
            <template #status="{item}">
              <td>
                <CBadge v-if="item.status === '1' || item.status === '3'" :color="getBadge(item.status)">
                 OK
                </CBadge>
                <CBadge v-else :color="getBadge(item.status)">
                  Banned
                </CBadge>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
export default {
   beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'));//kiểm tra có đăng nhập hay không 
    AuthService.checkAdmin(localStorage.getItem('isAuthen'));//kiểm tra quyền có là admin hay khong
    next();
  },
  name: 'Users',
  data () {
    return {
      primaryModal: false,                      //biến mở hộp thoại thêm quán
      keyword: null,                            //từ khóa để tim kiếm người dùng
      items: null ,                             //danh sách người dùng 
      result: null,                             //danh sách quán sau khi lọc bằng từ khóa
      fields: [                                 //các trường trong bảng người dùng
        { key: 'userName', label: 'Name' },
        { key: 'phone', label: 'Phone'  },
        { key: 'address', label: 'Address'  },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'status' },
      ],
      activePage: 1,                             //trang hiển thị của bảng
                                                 //các thuộc tính của người dùng   
      userID: '',
      userName: '',
      userAddress: '',
      userPhone: '',
      password: '',
      email: '',
      picture: null,
      imageData: null,
      sex: '',
      birthday: '',
      userTypes: null,
      userTypeName:'',
      userTypeID: ''
    }
  },
  watch: {
    $route: {
      immediate: true,                        //hàm thay đổi danh sách quán khi đổi trang trong bản
      handler (route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
    async onInit(){                               //hàm khởi tạo
      this.items = await UserService.getAll(localStorage.getItem('isAuthen')); //lấy danh sách người dùng
      console.log(this.items)
      this.result = this.items;
      this.userTypes = await UserService.getUserType(localStorage.getItem('isAuthen'));//lấy danh sách loại người dùng
    },
    getBadge(status) {  //hiện trạng thái quán
      switch (status) {
        case '3': return 'success'    //đang đăng nhập
        case '2': return 'danger'     //bị ban
        case '1': return 'primary'    //bình thường
        case '-1': return 'warning'   //chờ xác nhận
      }
    },
    rowClicked (item) {               //đến trang chi người dùng
      this.$router.push({path: `users/${item.userID}`})
    },
    pageChange (val) {                //thay đổi giá trị trang của bảng
      this.$router.push({ query: { page: val }})
    },
    previewImage(event){              //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
      this.picture=null;
      this.imageData= event.target.files[0];
    },
    onUpload(){                        //upload ảnh và thêm người dùng mới 
      if(this.imageData == null)
      {
        this.picture='';
        this.addUser();                 //nếu không có hình thì tiến hành thêm người dùng không cần ảnh
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);//tải ảnh lên firebase
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { //trả về url của ảnh
          this.picture=url;                                      //gán url mới nhận vào hình ảnh của người dùng
          this.addUser();                                        //tiến hành thêm người dùng
        })
        }
      )
    },
    async addUser(){                                             //hàm thêm người dùng
      const user = {                                             //tạo một đối tượng người dùng với dữ liệu người dùng nhập vào
        userName: this.userName,
        phone: this.userPhone,
        address: this.userAddress,
        password: this.password,
        email: this.email,
        picture: this.picture,
        sex: this.sex,
        birthday: this.birthday,
        userTypeID: this.userTypeID
      }
      const response = await AuthService.signUp(user);  //gọi api đăng kí người dùng
      alert(response);                                  //thông báo kết quả
      this.onInit();                                    //load lại thông tin
    },  
    onChange(key){                                      //tìm kiếm người dùng theo từ khóa
       if(key == '' || key == null)
        return this.result=this.items;                  //nếu từ khóa rỗng thì không tìm, trả về danh sách ban đầu
      else {
        this.result = this.items.filter(function(item){ //lọc những quán có tên chứa từ khóa
        return item.userName.toLowerCase().includes(key.toLowerCase());
      })
      console.log(this.result)}
    },
    openModal(){                                         //hàm mở của sổ thêm quán  
        this.userName = '';                              //set các giá trị thành rỗng trước khi mở     
        this.userPhone = '';
        this.userAddress = '';
        this.password = '';
        this.email = '';
        this.picture = '';
        this.sex = '';
        this.birthday = '';
        this.userTypeID = '';
        this.primaryModal = true;
    },
     closeModal(status, evt, accept) { if (accept) { //hàm đóng modal thêm người dùng
      this.onUpload();                               //nếu nhấn ok thì sẽ thêm người dùng
      } 
    },
  },
  mounted() {
    this.onInit();
  },
}
</script>
<style>
@import url('../../../assets/css/dialog.css');
.center_div{
  margin: 0 auto;
  width: 100% /* value of your choice which suits your alignment */
}

</style>
