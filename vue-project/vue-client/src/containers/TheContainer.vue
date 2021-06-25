<template>
  <div v-if="userType !== 'unknow'" class="c-app">
    <TheSidebar v-bind:userType="userType"/>
    <CWrapper>
      <TheHeader v-bind:userType="userType" v-bind:userName="userName"/>
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view :key="$route.path"></router-view>
            </transition>
          </CContainer>
        </main>
      </div>
      <TheFooter/>
    </CWrapper>
  </div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
import UserService from '@/services/UserService.js'
import AuthService from '@/services/AuthService.js'
export default {
  name: 'TheContainer',
  data(){
    return {
      user:[],
      userType:'unknow',
      userName:'unknow'
    }
  },
  mounted() {
    this.getUser()
  },
  methods:{
    async getUser(){
      try{
        const token = localStorage.getItem('isAuthen')
        this.user = await UserService.getInfo(token);
        if(this.user[0] == 'Bạn cần đăng nhập'){
          AuthService.logout();
          return;
        }
        this.userName = this.user[0].userName;
        this.userType = await AuthService.getRole(token);
      }
      catch{}
    }
  },
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
