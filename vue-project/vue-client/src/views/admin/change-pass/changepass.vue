<template>
<CRow>
  <CCard class="center_div" >
    <CCardHeader> <strong>Change pass</strong> Form </CCardHeader>
    <CForm novalidate>
      <CCardBody>
        <CInput
          type="email"
          description="Please enter your email."
          autocomplete="email"
          label="Email"
          placeholder="Enter Email..."
          required
          was-validated
        />
        <CInput
            label="Enter the code that send to your email"
            valid-feedback="Input is valid."
            invalid-feedback="Please provide at least 4 characters."
            placeholder="Valid value"
            :is-valid="validator"
            />
        <CInput
          type="password"
          description="Please enter your password."
          autocomplete="current-password"
          label="Password"
          placeholder="Enter Password..."
          :is-valid="validator_pass"
        />
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" class="btn_left" size="sm" color="primary"
          ><CIcon name="cil-check-circle" /> Submit</CButton
        >
        <CButton class="btn_right" type="reset" size="sm" color="danger"
          ><CIcon name="cil-ban" />Cancle</CButton
        >
      </CCardFooter>
    </CForm>
  </CCard>
</CRow>
</template>

<script>
export default {
    name: 'changepass',
    methods: {
    validator (val) {
      return val ? val.length >= 4 : false
    },
    validator_pass (val) {
      return val ? val.length >= 8 : false
    }
  }
};
</script>

<style>
.center_div{
    margin: 0 auto;
    width:30% /* value of your choice which suits your alignment */
}
.btn_left{
  float: left;
  width:100px;
}
.btn_right{
  float: right;
  width: 100px;
}
</style>