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
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{user.userName}}</strong>
    </CDropdownHeader>
    <CDropdownItem v-if="getRole(user.userTypeID) === true" @click="gotoProfile()">
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
     <CDropdownItem v-else to="/UserInformation">
      <CIcon name="cil-user"/> Profile
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import AuthService from '@/services/AuthService.js';
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
    this.user=localStorage.getItem('userInfor');
    this.user=JSON.parse(this.user)
    if(this.user.picture != '')
      this.picture = this.user.picture 
  },
  methods: {
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
  getRole(index){
    if(index == '-MO5VBnzdGsuypsTzHaV' || index == '-MO5VWchsca2XwktyNAw'   )
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