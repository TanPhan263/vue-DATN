<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderNav v-if="userType === '-MO5VBnzdGsuypsTzHaV'" class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="store" exact >
          Stores
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>

    <CHeaderNav v-if="userType === '-MO5VWchsca2XwktyNAw'" class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="overview">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="message" exact>
          Messages
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="managestores" exact >
          Stores
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    
    <CHeaderNav class="mr-4">
       <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
            Xin chào {{ userName }}
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
export default {
  name: 'TheHeader',
  data(){
    return{
    }
  },
  props:{
    userName: String,
    userType: String
  },
  components: {
    TheHeaderDropdownAccnt
  }
}
</script>
