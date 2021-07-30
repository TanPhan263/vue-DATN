<template>
<div>
   <notifications position="bottom right"/>
  <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import 'assets/scss/style';
  html {
  scroll-behavior: smooth;
}
</style>
