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
            :src="picture"
            style="width: 45px; height:40px;border-radius:50%;"
          />
        </div>
      </CHeaderNavLink>
    </template>
      <div v-if="user">
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{user[0].userName}}</strong>
    </CDropdownHeader>
    <CDropdownItem v-if="getRole() === true" @click="gotoProfile()">
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
     <CDropdownItem v-else to="/userinformation">
      <CIcon name="cil-user"/> Profile
    </CDropdownItem>
    <CDropdownItem to="/ForgetPass">
      <CIcon name="cil-lock-locked" /> Change password
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <CIcon name="cil-account-logout" /> Logout
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
      picture: "http://dummyimage.com/60x60/666/ffffff&text=No+Image",
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
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>