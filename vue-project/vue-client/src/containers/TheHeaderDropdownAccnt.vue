<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
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
      <i class="fas fa-user dropdownItem"></i> Profile
    </CDropdownItem>
     <CDropdownItem v-else href="/userinformation">
      <i class="fas fa-user dropdownItem"></i> Profile
    </CDropdownItem>
    <CDropdownItem href="/forgetpass">
      <i class="fa fa-lock dropdownItem" aria-hidden="true"></i> Change password
    </CDropdownItem>
    <CDropdownItem @click="openChat" v-if="getRole() === false" >
      <i class="fas fa-comments"></i> Contact admin
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <i class="fas fa-sign-out-alt dropdownItem"></i> Logout
    </CDropdownItem>
    </div>
  </CDropdown>
</template>

<script>
import UserService from '@/services/UserService.js';
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
    async getUser(){
        const token = localStorage.getItem('isAuthen')
        this.user = await UserService.getInfo(token);
        if(this.user[0].picture != '')
          this.picture = this.user[0].picture;
    },
    logout() {
      localStorage.removeItem("userInfor");
      localStorage.removeItem("isAuthen");
      this.$router.go();
    },
    async created() {
    if (!this.$store.getters.isLoggedIn) {
      this.$router.push('/login');
    }
  },
  getRole(){
    if(this.user[0].userTypeID == '-MO5VBnzdGsuypsTzHaV' || this.user[0].userTypeID == '-MO5VWchsca2XwktyNAw'   )
      return true;
    else return false;
    },
    gotoProfile(){
      this.$router.push('/manage/update')
    },
    gotoUserInfor(){
      this.$router.push('/userinformation')
    },
    openChat(){
      this.$root.$refs.Footer.openChat('-M_UX0kqNgaXGTYa2_FJ','Nguyễn Ngọc Đại- Admin','','none');
    },
  }
}
</script>

<style scoped>
  .dropdownItem{
    margin-right: 3px;
  }
</style>