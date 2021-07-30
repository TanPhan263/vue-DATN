<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0">
    <template #toggler>
      <CHeaderNavLink >
        <div class="c-avatar">
          <img
            v-lazy="picture"
            style="width: 45px; height:40px;border-radius:50%; border: 1px solid #e6e6e6"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <div v-if="user">
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{user[0].userName}}</strong>
    </CDropdownHeader>
    <CDropdownItem v-if="getRole() === true" @click="gotoProfile()">
      <i class="fas fa-user dropdownItem"></i> Cài đặt tài khoản
    </CDropdownItem>
     <CDropdownItem v-else href="/thong-tin-tai-khoan">
      <i class="fas fa-user dropdownItem"></i> Cài đặt tài khoản
    </CDropdownItem>
    <CDropdownItem href="/doi-mat-khau">
      <i class="fa fa-lock dropdownItem" aria-hidden="true"></i> Đổi mật khẩu
    </CDropdownItem>
    <CDropdownItem @click="openChat" v-if="user[0] && user[0].userTypeID !== '-MO5VBnzdGsuypsTzHaV'" >
      <i class="fas fa-comments"></i> Liên hệ hỗ trợ - góp ý
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <i class="fas fa-sign-out-alt dropdownItem"></i> Đăng xuất
    </CDropdownItem>
    </div>
  </CDropdown>
</template>

<script>
import UserService from '@/services/UserService.js';
import AuthService from '@/services/AuthService.js';
export default {
  name: 'TheHeaderDropdownAccnt',
  data() {
    return {
      itemsCount: 30,
      secretMessage: '',
      user:'',
      picture: '',
    };
  },
  props:{
    avt:''
  },
  mounted(){
   this.getUser();
  },
  methods: {
    async getUser(){  //lấy thông tin người dùng
        const token = localStorage.getItem('isAuthen')
        this.user = await UserService.getInfo(token);
        if(this.user[0].picture != '')
          this.picture = this.user[0].picture;
    },
    logout(){ //hàm đăng xuất
      AuthService.logout();
    },
    async created() {
      if (!this.$store.getters.isLoggedIn) {
        this.$router.push('/login');//đến trang login
      }
  },
  getRole(){ //lấy quyền của người dùng để hiển thị menu theo từng loại
    if(this.user[0].userTypeID == '-MO5VBnzdGsuypsTzHaV' || this.user[0].userTypeID == '-MO5VWchsca2XwktyNAw'   )
      return true;
    else return false;
    },
    gotoProfile(){
      this.$router.push('/manage/profile')
    },
    gotoUserInfor(){
      this.$router.push('/userinformation')
    },
    openChat(){//mở hộp thoại chat Liên hệ hỗ trợ - góp ý
      this.$root.$refs.Footer.openChat('-M_UX0kqNgaXGTYa2_FJ','Support Team','','none');
    },
  }
}
</script>

<style scoped>
  .dropdownItem{
    margin-right: 3px;
  }
</style>