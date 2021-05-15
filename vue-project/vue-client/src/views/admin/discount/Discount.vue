<template>
  <CRow>
      <CCol sm="6" lg="3">
      <CWidgetDropdown v-for="(discount,index) in discounts" v-bind:key="index" color="primary" header="9.823" :text="discount.discountTypeName">
        <template #default>
          <CDropdown
            color="transparent p-0"
            placement="bottom-end">
            <template #toggler-content>
              <CIcon name="cil-settings"/>
            </template>
            <CDropdownItem>Xóa</CDropdownItem>
            <CDropdownItem>Chỉnh sửa</CDropdownItem>
            <CDropdownItem>Ẩn</CDropdownItem>
          </CDropdown>
        </template>
        <template #footer>
            <img v-lazy="discount.discountTypePicture" alt="" height="100">
        </template>
      </CWidgetDropdown>
    </CCol>
  </CRow>
</template>

<script>
import { CChartLineSimple } from '../charts/index.js'
import DiscountService from '@/services/DiscountService.js'
export default {
    components:{
        CChartLineSimple
    },
    data(){
        return{
            discounts: [],
        }
    },
    methods:{
        async getDiscounts(){
            this.discounts = await DiscountService.getAll();
        }
    },
    mounted(){
        this.getDiscounts();
    }
}
</script>

<style>

</style>