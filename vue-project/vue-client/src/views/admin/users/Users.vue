<template>
  <CRow>
    <CCol>
      <CCard class="center_div">
        <CCardHeader>
         <div class="row">
            <h2  style="margin-left: 12px;">User</h2>
            <CInput
            style="margin-left: 620px;"
                      v-model="keyword"
                      placeholder="Tìm User"
                      v-on:keyup="onChange(keyword)"
              />
            <CButton @click="active=true" style="margin-left: 20px; height: 35px;" color="primary" >Thêm User</CButton>
          </div>
           <transition v-if="active" >
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
            </transition>
        </CCardHeader>
        <CCardBody>
          <CDataTable
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
                <CBadge v-if="item.status === '1'" :color="getBadge(item.status)">
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
import firebase from 'firebase'
import usersData from './UsersData'
import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
export default {
  name: 'Users',
  data () {
    return {
      keyword: null,
      items: null ,
      result: null,
      fields: [
        { key: 'userName', label: 'Name' },
        { key: 'phone', label: 'Phone'  },
        { key: 'address', label: 'Address'  },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'status' },
      ],
      activePage: 1,
      active: false,
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
      immediate: true,
      handler (route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
    async onInit(){
      this.items = await UserService.getAll(localStorage.getItem('isAuthen')); 
      console.log(this.items)
      this.result = this.items;
      this.userTypes = await UserService.getUserType(localStorage.getItem('isAuthen'));
    },
    getBadge(status) {
      switch (status) {
        case '2': return 'danger'
        case '1': return 'primary'
      }
    },
    rowClicked (item) {
      this.$router.push({path: `users/${item.userID}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
     previewImage(event){
          this.picture=null;
          this.imageData= event.target.files[0];
    },
    onUpload(){
      if(this.imageData == null)
      {
        this.picture='';
        this.addUser();
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { 
          this.active=false;
          this.picture=url;
          this.addUser();
        })
        }
      )
    },
    async addUser(){
      const user = {
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
      const response = await AuthService.signUp(user);
      alert(response);
      this.onInit();
    },
    onChange(key){
       if(key == '' || key == null)
        return this.result=this.items;
      else {
        this.result = this.items.filter(function(item){
        return item.userName.toLowerCase().includes(key.toLowerCase());
      })
      console.log(this.result)}
    }

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
