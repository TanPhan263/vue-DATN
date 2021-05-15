<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon 
        class="c-sidebar-brand-full" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 556 134"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 110 134"
      />
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
      admin: true
    }
  },
  created(){
    this.admin = this.isAdmin();
    console.log(this.admin)
  },
  mounted(){
    console.log(this.userType)
    console.log(this.isAdmin())
  },
  methods:{
    isAdmin(){
      if(this.userType == '-MO5VBnzdGsuypsTzHaV') return true;
      return false;
    }
  },
  computed: {
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    }
  }
}
</script>
