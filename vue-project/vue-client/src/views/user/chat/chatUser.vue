<template>
  <div class="container_user">
    <div v-if="!show" style="background: white; width:100%; height: 100%;  border: 1px solid #c4c4c4">
       <div class="inputEmail">
         <div class="form-outline">
          <input v-model="user.userName" type="text" placeholder="Please enter your email" id="inputEmail" class="form-control form-control-lg center_user" style="height: 40px;width: 80%" />
        </div>
       </div>
       <button class="center_btn-user" style="padding: 0px 20px 0 20px ;font-size: 20px;font-family: 'Dosis', sans-serif !important;" @click="openChat" type="button">Chat</button>
       <h4 class="center_h4">Hoặc</h4>
       <button class="center_btn-login-user" style="padding: 0px 20px 0 20px ;font-size: 20px;font-family: 'Dosis', sans-serif !important;" type="button"><a href="/login">Đăng nhập</a></button>
    </div>
  <div v-if="show" class="messaging_user" >
    <div class="inbox_people_user">
        <div class="headind_srch_user">
            <div class="recent_heading_user">
              <h5>Recent</h5>
            </div>
          </div>
          <div class="inbox_chat_user" v-if="storeList">
            <div v-for="(store,index) in storeList" v-bind:key="index" :class="[storeClickedID === store.id? 'chat_list_user active_chat_user':'chat_list_user']"  @click="storeClicked(store.roomID,store.id,store.ownerID,store.seen,store.senderPic)">
              <div class="chat_people_user" >
                <div class="chat_img_user"> <img class="img-avt_user img_user" v-lazy="store.senderPic" :alt="store.storeName"> </div>
                <div :class="[store.seen === 'false'? 'unseen_chat_user':'chat_ib_user']" >
                  <h5>{{store.senderName}}</h5>
                   <p v-if="store.lastMsg">{{stringCut(store.lastMsg)}}<i class="fas fa-circle" style="font-size: 4px"></i>{{getDate(store.time)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div class="mesgs_user">
          <div class="headind_srch_user">
            <div class="recent_heading_user">
              <h5 style="width: 50%;float: left">Chat bot</h5>
              <i v-if="!isLogin" @click="exitChat" class="fas fa-sign-out-alt" style="font-size: 20px;float: right"></i>
            </div>
          </div>
          <div class="msg_history_user" v-chat-scroll="{always: false, smooth: true}" id="messages" ref='messages'>
            <div v-for="(mess,index) in messages" v-bind:key="index">
            <div v-if="mess.senderID !== user.userID" class="incoming_msg_user" >
              <div class="incoming_msg_img_user">
                <img  class="img-avt_user img_user" v-lazy="senderPic" alt="sunil"> 
              </div>
                <div  class="received_msg_user">
                    <div class="received_withd_msg_user">
                      <p>{{ mess.msg}}</p>
                      <span v-if="mess.date" class="time_date_user"> {{ mess.date}}</span>
                    </div>
                </div>
            </div>
            <div v-else class="outgoing_msg_user">
              <div class="sent_msg_user">
                <p>{{mess.msg}}</p>
                <span v-if="mess.date" class="time_date_user"> {{ mess.date}}</span> 
              </div>
            </div>
          </div>
          </div>
          <div class="type_msg_user">
            <div class="input_msg_write_user">
              <input @keyup.enter="saveMessage" v-model="message" type="text" class="write_msg_user" placeholder="Type a message" />
              <button @click="saveMessage" class="msg_send_btn_user" type="button"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import UserService from '@/services/UserService.js'
import AuthService from '@/services/AuthService.js'
export default {
    data(){
      return{
        user:{
          userID: '',
          userName:'',
          userPIc:''
        },
        storeList:[],
        message: null,
        messages: [],
        show : false,
        roomID:'',
        storeClickedID:'',
        senderPic:'',
        ownerID: '',
        isLogin: false,
      }
    },
    props:{
      isOpen : Boolean
    },
    created(){
      this.$root.$refs.chatUser = this;
    },
    methods:{
        stringCut(index){
          if(index.length > 19)
            return index.slice(0,19)+'...';
          else return index;
        },
        getDate(sec){
         const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          var date = new Date(sec);
          var currdate = new Date();
          if(date.getDate() == currdate.getDate())
            return ' ' +date.getHours() + ':' + date.getMinutes();
          else 
            return ' ' + monthNames[date.getMonth() +1] + ' ' + date.getDate();
        },
        openChat(){
            if(this.validateEmail(this.user.userName)){
              this.user.userID = this.user.userName.slice(0,this.user.userName.indexOf('@'));
              sessionStorage.setItem('chatUser',JSON.stringify(this.user));
              this.fectchInboxes(this.user.userID);
              this.fetchMessage();
              this.show = true;
          }
          else{
            alert("email không đúng, vui lòng nhập lại!!");
          }
        },
        async checkLogin(){
          try{
            const token = localStorage.getItem('isAuthen')
            if(!token) return;
            let respone = await UserService.getInfo(token);
            if(respone[0] != 'Bạn cần đăng nhập'){
              this.isLogin = true;
              this.user.userID = respone[0].userID;
              this.user.userName = respone[0].userName;
              this.user.userPIc = respone[0].picture;
              this.show = true;
              this.fectchInboxes(this.user.userID);
              this.fetchMessage();
            }
            else{
              this.show = false;
            }
          }
          catch{
          }
        },
        createInbox(id,name,picture,owner){
          if(id && name && owner){
            this.storeClickedID = id;
            this.ownerID = owner;
            this.createInboxes(id,name,picture,owner);
            this.fetchMessage();
          }
        },
        createInboxes(storeId,storeName,storePicture,storeOwner){
          try{
          if(storeId && storeName && storeOwner && this.user.userID){
            this.storeClickedID = storeId;
            this.roomID = this.storeClickedID + this.user.userID;
            firebase
              .database()
              .ref("Messages/inboxes/users/").child(this.user.userID).orderByChild('roomID').equalTo(this.roomID).on("value",snapshot => {
                if (snapshot.exists()){
                  const userData = snapshot.val();
                  console.log("exists!", userData);
                  return;
                }
                else{
                  var today = new Date();
                  const inboxRecipent = {
                    recipentID: storeId,
                    roomID: this.roomID,
                    senderID: this.user.userID,
                    senderName:  this.user.userName,
                    senderPic: '',
                    ownerID : storeOwner,
                    time: today.getTime().toString(),
                    lastMsg: '',
                    seen: ''
                  };
                  const inboxSender = {
                    recipentID: this.user.userID,
                    roomID: this.roomID,
                    senderID: storeId,
                    senderName:  storeName,
                    senderPic: storePicture,
                    ownerID : storeOwner,
                    time: today.getTime().toString(),
                    lastMsg: '',
                    seen: ''
                  };
                  if(this.ownerID == 'none'){
                    firebase
                    .database()
                    .ref("Messages/inboxes/users/" + this.storeClickedID).child(this.user.userID)
                    .set(inboxRecipent);
                  } 
                  else{
                    firebase
                    .database()
                    .ref("Messages/inboxes/stores/" + storeOwner).child(storeId).child(this.user.userID)
                    .set(inboxRecipent);
                  }
                  firebase
                    .database()
                    .ref("Messages/inboxes/users/" + this.user.userID).child(storeId)
                    .set(inboxSender);
                  }
              });
            }
            else alert('Mời bạn nhập Email');
          }
          catch{}
        },
        saveMessage(){
          try{
            if(this.message && this.roomID && this.storeClickedID && this.user.userID && this.ownerID){
              var today = new Date();
              const mess = {
                roomID: this.roomID,
                senderID: this.user.userID,
                msg: this.message,
                date: today.toString().slice(0,21)
              };
              firebase
                .database()
                .ref("Messages/chatMessages/")
                .push(mess);
              if(this.ownerID == 'none')
              {
                firebase
                .database()
                .ref("Messages/inboxes/users/" + this.storeClickedID).child(this.user.userID)
                .update({seen:'false',time:today.getTime(),lastMsg:this.message});
              }
              else{
                firebase
                .database()
                .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.user.userID)
                .update({seen:'false',time:today.getTime(),lastMsg:this.message});
              }
              firebase
                .database()
                .ref("Messages/inboxes/users/"+ this.user.userID).child(this.storeClickedID)
                .update({seen:'true',time:today.getTime(),lastMsg:this.message});
              this.message = "";
              }
              else{
                alert('Loi roi')
              }
            }
            catch(err){
              console.log(err);
            }
        },
        fetchMessage(){
          try{
            if(this.roomID  && this.user.userID && this.storeClickedID){
              firebase.database().ref("Messages/chatMessages/").orderByChild('roomID').equalTo(this.roomID).on("value", snapshot => {
                if(snapshot.exists())
                {
                  let data = snapshot.val();
                  let messages = [];
                  Object.keys(data).forEach(key => {
                    messages.push({
                      id: key,
                      roomID: data[key].roomID,
                      senderID: data[key].senderID,
                      msg: data[key].msg,
                      date: data[key].date
                    });
                  });
                  if(messages[messages.length - 1].senderID == this.storeClickedID && this.isOpen == true)
                  {
                    firebase
                    .database()
                    .ref("Messages/inboxes/users/"+ this.user.userID).child(this.storeClickedID)
                    .update({seen: 'true'});
                  }
                  if(this.roomID == messages[0].roomID){
                    this.messages = messages;
                  }
                }
                else this.messages =[];
            }); 
            }
          }
          catch(err){
            console.log(err);
          }
        },
        fectchInboxes(id){
          try{
              firebase.database().ref("Messages/inboxes/users/"+ id).on("value", snapshot => {
              if(snapshot.exists())
              {
                  let data = snapshot.val();
                  let inboxes = [];
                  Object.keys(data).forEach(key => {
                  if(data[key].seen == 'false'){
                      this.$notify({
                      title:'Có tin nhắn mới từ '+ data[key].senderName,
                      text: data[key].lastMsg
                    });
                  }
                  inboxes.push({
                      id: key,
                      recipentID: data[key].recipentID,
                      roomID: data[key].roomID,
                      senderID: data[key].senderID,
                      senderName:  data[key].senderName,
                      senderPic: data[key].senderPic,
                      ownerID:  data[key].ownerID,
                      time: data[key].time,
                      lastMsg: data[key].lastMsg,
                      seen : data[key].seen
                    });
                  });
                  this.storeList = inboxes;
                  if(this.storeClickedID == ''){
                    this.storeClickedID = inboxes[0].senderID;
                    this.roomID = inboxes[0].roomID;
                    this.ownerID = inboxes[0].ownerID;
                    this.fetchMessage();
                  }
              }
              else this.storeList = [];
            }); 
          }
          catch(err){
            console.log(err);
          }
        },
        storeClicked(idRoom,idStore,idOwner,seen,senderPic){
          this.messages = [];
          this.senderPic = senderPic;
          this.roomID = idRoom;
          this.storeClickedID = idStore;
          this.ownerID = idOwner;
          if(seen == 'false' && this.user.userID)
            {
              firebase
              .database()
              .ref("Messages/inboxes/users/"+ this.user.userID).child(idStore)
              .update({seen: 'true'});
            }
          this.fetchMessage(idRoom);
        },
        exitChat(){
          if(confirm('Bạn muốn đăng xuất phòng Chat?')){
            sessionStorage.removeItem('chatUser');
            this.user = {
                userID: '',
                userName:'',
                userPIc:''
              };
            this.roomID = '';
            this.storeClickedID = '';
            this.storeList = [];
            this.messages = [];
            this.show = false;
          }
        },
        validateEmail(mail) 
        {
          if(mail == '') return false;
          var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
              if (mail.match(validRegex)) {
                return true;
              } else {
                return false;
            }
        },
        getStoreName(id){
          if(this.storeList)
          {
            let temp = ''
            this.storeList.forEach(element => {
              if(element.senderID == id)
                temp = element.senderName;
            });
            return temp;
          }
        },
        onInit(){
          if(sessionStorage.getItem('chatUser')){
            this.user = JSON.parse(sessionStorage.getItem('chatUser'));
            this.fectchInboxes(this.user.userID);
            this.fetchMessage();
            this.show = true;
          }
          else
            this.checkLogin();
        },
      },
    mounted(){
      this.onInit();
    },
}
</script>

<style scoped>

.container_user{max-width:850px ; margin:auto;}
.img_user { max-width:100%;}
.inbox_people_user {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 30%; ;
  border-left:1px solid #c4c4c4;
  border-right:1px solid #c4c4c4;
}
.inbox_msg_user {
  clear: both;
  overflow: hidden;
}
.top_spac_user{ margin: 20px 0 0;}

.recent_heading_user {float: left; width:100%; color: black;  padding: 5px;}
.srch_bar_user {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch_user{padding:10px 20px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4; border-top:1px solid #c4c4c4;}

.recent_heading_user h5 {
  color: #A9A9A9;
  font-size: 15px;
  margin: auto;
}
.srch_bar_user input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar_user .input-group-addon_user button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar_user .input-group-addon_user { margin: 0 0 0 -27px;}

.chat_ib_user h5{ font-size:12px; color: #484848; margin:0 0 0px 0;}
.chat_ib_user p{ font-size:12px; color: #484848; margin:auto}
.chat_img_user {
  float: left;
  width: 18%;
}
.img-avt_user{
  border-radius: 50%;
  height: 40px;
}
.chat_ib_user {
  float: left;
  padding: 0 0 0 5px;
  width: 82%;
}

.unseen_chat_user h5{ font-size:13px; color: black; margin:0 0 0px 0;}
.unseen_chat_user p{ font-size:12px; font-weight: bold; color: black; margin:auto}
.unseen_chat_user {
  float: left;
  padding: 0 0 0 5px;
  width: 83%;
}

.chat_people_user{ overflow:hidden; clear:both;}
.chat_list_user {
  cursor: pointer;
  border-bottom: 1px solid #efefef;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat_user { padding: 0px; height: 400px; overflow-y: scroll; }

.active_chat_user{ background:#ebebeb;}

.incoming_msg_img_user {
  display: inline-block;
  width: 6%;
  margin-bottom: 10px;
}
.received_msg_user {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg_user p {
  background: #efefef none repeat scroll 0 0;
  border-radius: 5px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 10px 10px 10px 12px;
  width: 100%;
}
.time_date_user {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 2px 0 8px 8px;
}
.received_withd_msg_user { width: 57%;}
.mesgs_user {
  float: left;
  width: 70%;
  background: white;
  border-right:1px solid #c4c4c4;
}
 .sent_msg_user p {
  background: blue none repeat scroll 0 0;
  border-radius: 5px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 10px 10px 10px 12px;
  width:100%;
}
.outgoing_msg_user{ overflow:hidden; margin:26px 0 26px;}
.sent_msg_user {
  float: right;
  width: 46%;
}
.input_msg_write_user input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg_user { background: white;border-top: 1px solid #c4c4c4;position: relative;}
.msg_send_btn_user {
  background: #FF8C00 none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 25px;
  height: 35px;
  position: absolute;
  right: 0;
  top: 5px;
  right: 10px;
  width: 35px;
}
.messaging_user { padding: 0 0 50px 0;}
.msg_history_user {
  padding: 10px;
  height: 346px;
  overflow-y: auto;
}
.write_msg_user{
    padding: 0 0 0 0px;
}
.center_user {
  border: none;
  height: 40px;
  border-radius: 5px;
  color: white;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 30%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.center_btn-user {
  border: none;
  height: 40px;
  border-radius: 5px;
  color: 	#484848;
  font-weight: bold;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.center_btn-login-user {
  border: none;
  height: 40px;
  border-radius: 5px;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 70%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.center_btn-login-user a{
   color: 	#484848;
  font-weight: bold;
  text-decoration: none;
}
.center_h4{
  border: none;
  height: 40px;
  border-radius: 5px;
  color: black;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 60%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.inputEmail{
  height: 450px;
  width: 940px;
}
</style>