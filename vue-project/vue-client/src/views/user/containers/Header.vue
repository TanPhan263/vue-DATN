<template>
  <div class="container-topbar">
      <ul class="topbar">
			<!-- <li><a v-if="getRole()" style="color:black;" href="/manage/dashboard">Admin DashBoard</a>
      <a v-else style="color:black;" href="/registerStore">Đăng kí quán mới trên Sunnie</a></li> -->
			<div class="fl_right">
				<div class="language fl_right">
					<a href="" style="padding: 7px 0px 0px 15px; color: black">
						<img src="../../../assets/imgs/vn.png" alt="vn" width="20"> 
            Ngôn ngữ
					</a>
				</div>
				<div class="time fl_right">
					<i style="color: black" class="fa fa-clock-o"></i>
          <i style="color: #fff" class="fa fa-clock-o"></i>
					<span style="font-size: 13px;">{{time}} : {{min}}</span>
				</div>
			</div>
		</ul>
  </div>
</template>
  
<script>
/* eslint-env jquery */
export default {
  name: "homeheader",
  data(){
    return{
      user: null,
      time: 0,
      min: 0,
      isDropdow: false
    }
  },
  mounted(){
    this.user=localStorage.getItem('userInfor');
    this.user = JSON.parse(this.user);
    const today = new Date();
    this.time = today.getHours();
    this.min = today.getMinutes()
  },
  components: {},
  methods:{
    getRole(){
      if(this.user == null) return false;
      else if(this.user.userTypeID == '-MO5VBnzdGsuypsTzHaV' || this.user.userTypeID == '-MO5VWchsca2XwktyNAw' ) return true;
      else return false;
    }
  }
};
</script>

<style lang="css" scoped>
@import url('../../../assets/css/style-0.css');
</style>
