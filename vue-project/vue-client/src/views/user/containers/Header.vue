<template>
  <div class="container-topbar">
      <ul class="topbar" >
			<li><a v-if="role" style="color:black;" href="/manage/dashboard">DashBoard</a>
          <a v-else  href="/registerStore" style="color:black;">Đăng kí quán mới trên Sunnie</a></li>
			<div class="fl_right">
				<div class="language fl_right">
					<a  style="padding: 7px 0px 0px 15px; color: black">
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
import AuthService from '@/services/AuthService.js';
export default {
  name: "homeheader",
  data(){
    return{
      role:false,
      time: 0,
      min: 0,
      isDropdow: false
    }
  },
  mounted(){
    this.getRole();
    const today = new Date();
    this.time = today.getHours();
    this.min = today.getMinutes();
  },
  components: {},
  methods:{
    async getRole(){
      try{
      console.log(localStorage.getItem('isAuthen'))
      if(!localStorage.getItem('isAuthen'))  return this.role = false;;
      const role = await AuthService.getRole(localStorage.getItem('isAuthen'));
      if(role == '-MO5VBnzdGsuypsTzHaV' || role == '-MO5VWchsca2XwktyNAw')
      {
       this.role = true;
       return
      }
      return this.role = false;
    }
    catch(err){
      console.log(err);
    }
    },
    notifyMe() {
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
            var notify = new Notification('Hi there!', {
                body: 'How are you doing?',
                icon: '',
            });
        } else {
            // request permission from user
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    // show notification here
                    var notify = new Notification('Hi there!', {
                        body: 'How are you doing?',
                        icon: '',
                    });
                } else {
                    console.log('User blocked notifications.');
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }
},
oninit(){
   if (!window.Notification)
    {
        alert('Trình duyệt của bạn không hỗ trợ chức năng này.');
    }
    // Ngược lại trình duyệt có hỗ trợ thông báo
    else
    {
        // Gửi lời mời cho phép thông báo
      Notification.requestPermission(function (p) {
            // Nếu không cho phép
            if (p === 'denied')
            {
                alert('Bạn đã không cho phép thông báo trên trình duyệt.');
            }
            // Ngược lại cho phép
            else
            {
                alert('Bạn đã cho phép thông báo trên trình duyệt, hãy bắt đầu thử Hiển thị thông báo.');
            }
        });
    }
}
  }
};
</script>

<style lang="css" scoped>
@import url('../../../assets/css/style-0.css');
</style>
