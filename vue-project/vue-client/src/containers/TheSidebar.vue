<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none">
      <a style="text-decoration: none;" v-show="!minimize" v-if="isAdmin()" href="/manage/dashboard" class="logo">VieFood Admin</a>
      <a style="text-decoration: none;" v-show="!minimize" v-else href="/manage/overview"  class="logo">VieFood Store Owner</a>
      <a style="text-decoration: none;" v-show="minimize" v-if="isAdmin()" href="/manage/dashboard" class="logo">
        <img src="../assets/imgs/vie-logo.png" alt="viefood.info">
      </a>
      <a style="text-decoration: none;" v-show="minimize" v-else href="/manage/overview"  class="logo">
        <img src="../assets/imgs/vie-logo.png" alt="viefood.info">
      </a>
    </CSidebarBrand>
    <CRenderFunction v-if="isAdmin()" flat :content-to-render="$options.nav"/>
    <CRenderFunction v-else flat :content-to-render="$options.nav_storeOwner"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav'
import nav_storeOwner from './_nav_storeOwner.js'
export default {
  name: 'TheSidebar',
  nav,
  nav_storeOwner,
  props:{
    userType: String
  },
  data(){
    return {
      admin: true,
    }
  },
  created(){
    this.admin = this.isAdmin();
  },
  mounted(){
  },
  methods:{
    isAdmin(){                              //kiểm tra có phải admin hay không 
      if(this.userType == '-MO5VBnzdGsuypsTzHaV') return true;
      return false;
    },
  },
  computed: {
    show () {                               //hàm hiển thị sidebar
      return this.$store.state.sidebarShow     
    },
    minimize () {                           //hàm thu nhỏ sidebar
      return this.$store.state.sidebarMinimize 
    }
  }
}
</script>
<style>
  .logo{
    width: 275%; text-align: center; font-size: 20px; color: white;
    font-weight: bold;
    text-decoration: none;
  }
</style>
