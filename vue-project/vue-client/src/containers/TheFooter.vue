<template>
  <CFooter :fixed="false">
    <div @click="chat=!chat" class="message"><i class="fa fa-envelope"></i>
      </div>
      <transition >
        <div v-show="chat" class="chat-area">
          <Chat v-bind:isOpen="chat"/>
        </div>
    </transition>
    <div>
      <a href="" target="_blank"></a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}}</span>
    </div>
    <div class="mfs-auto">
    </div>
  </CFooter>
</template>

<script>
import Chat from '../views/user/chat/chatUser.vue'
export default {
  name: 'TheFooter',
  components:{
     Chat
   },
  data(){
    return{
      chat: false,
    }
  }
}
</script>
<style>
.message{
  z-index: 4;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: center;
  background: #FF8C00;
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.message i {
  margin: 13px;
  color: white;
  font-size: 30px;
}
.chat-area{
  z-index: 3;
  height: 450px;
  width: 970px;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
