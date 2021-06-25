<template>
  <CRow>
    <template>
       <CCol md="3" sm="6">
        <CWidgetBrand
          color="linkedin"
        >
          <CIcon
            name="cib-linkedin"
            height="52"
            class="my-4"
          />
        </CWidgetBrand>
       </CCol>
      <CCol md="3" sm="6">
        <CWidgetBrand
          color="facebook"
        >
          <CIcon
            name="cib-facebook"
            height="52"
            class="my-4"
          />
        </CWidgetBrand>
       </CCol>
       <CCol md="3" sm="6" >
        <CWidgetBrand
          color="danger"
          class="row"
          style="width:100%; margin-left: 0px"
        >
        <i class="fab fa-google" style="font-size:50px;padding: 25px 0 25px 0"></i>
        </CWidgetBrand>
       </CCol>
      
       <CCol md="3" sm="6">
        <CWidgetBrand
          color="twitter"
        >
          <CIcon
            name="cib-twitter"
            height="52"
            class="my-4"
          />
        </CWidgetBrand>
      </CCol>
    </template>
  </CRow>
</template>

<script>
import { CChartLineSimple } from '../charts/index.js'

export default {
  name: 'WidgetsBrand',
  components: {
    CChartLineSimple
  },
  props: {
    noCharts: Boolean
  }
}
</script>

<style scoped>
.c-chart-brand {
  position: absolute;
  width: 100%;
  height: 100px;
}
</style>
