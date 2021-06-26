<template>
  <div class="container">
    <div v-if="!show" style="height:100%; width:100%; position: relative;background:white">
       <div class="msg_history">
         <div class="form-outline">
          <input v-model="user.userName"  type="text" placeholder="Please enter your email" id="formControlLg" class="form-control form-control-lg center" style="height: 40px;width: 80%" />
        </div>
       </div>
       <button class="center" style="margin-top: 60px" @click="openChat" type="button">Chat</button>
    </div>
  <div v-if="show" class="messaging" >
    <div class="inbox_people">
        <div class="headind_srch">
            <div class="recent_heading">
              <h5>Recent</h5>
            </div>
          </div>
          <div class="inbox_chat" v-if="storeList">
            <div v-for="(store,index) in storeList" v-bind:key="index" :class="[roomID === store.roomID? 'chat_list active_chat':'chat_list']"  @click="storeClicked(store.roomID,store.id)">
              <div class="chat_people">
                <div class="chat_img"> <img v-lazy="store.senderPic" :alt="store.storeName"> </div>
                <div class="chat_ib">
                  <h5>{{store.senderName}} <span class="chat_date"> {{store.time}}</span></h5>
                   <p>{{store.lastMsg}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div class="mesgs">
          <div class="headind_srch">
            <div class="recent_heading">
              <h5 style="width: 50%;float: left">Chat bot</h5>
            </div>
          </div>
          <div class="msg_history" v-chat-scroll="{always: false, smooth: true}" id="messages" ref='messages'>
            <div v-for="(mess,index) in messages" v-bind:key="index">
            <div v-if="mess.senderID !== user.userID" class="incoming_msg" >
              <div class="incoming_msg_img"> 
                <img src="../../../assets/imgs/userPic.png"  alt="avt"> 
              </div>
                <div  class="received_msg">
                    <div class="received_withd_msg">
                      <p>{{ mess.msg}}</p>
                      <span v-if="mess.date" class="time_date"> {{ mess.date}}</span>
                    </div>
                </div>
            </div>
            <div v-else class="outgoing_msg">
              <div class="sent_msg">
                <p>{{mess.msg}}</p>
                <span v-if="mess.date" class="time_date"> {{ mess.date}}</span> 
              </div>
            </div>
          </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input @keyup.enter="saveMessage" v-model="message" type="text" class="write_msg" placeholder="Type a message" />
              <button @click="saveMessage" class="msg_send_btn" type="button"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import UserService from '@/services/UserService.js'
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
            storeClickedID:''
        }
    },
    props:{
      storeID: String,
      storeName: String,
      storePicture: String,
      isOpen: Boolean
    },
    methods:{
        openChat(){
            if(validateEmail(this.user.userName)){
            this.user.userID = this.user.userName.slice(0,this.user.userName.indexOf('@'));
            this.roomID = this.storeID + this.user.userID;
            this.createInboxes();
            this.fectchInboxes(this.user.userID);
            this.fetchMessage();
            this.show = true;
          }
          else{
            alert("email không đúng, vui lòng nhập lại!!");
          }
        },
//test
        async checkLogin(){
          const token = localStorage.getItem('isAuthen')
          if(!token) return;
          let respone = await UserService.getInfo(token);
          if(respone[0] != 'Bạn cần đăng nhập'){
            this.user.userID = respone[0].userID;
            this.user.userName = respone[0].userName;
            this.user.userPIc = respone[0].picture;
            this.show = true;
            this.createInboxes();
            this.fectchInboxes(this.user.userID);
            this.roomID=this.storeID + this.user.userID;
            this.fetchMessage();
          }
          else{
            this.show = false;
          }
        },
        createInboxes(){
          firebase
            .database()
            .ref("Messages/inboxes/"+ this.storeClickedID).orderByChild('roomID').equalTo(this.storeClickedID+this.user.userID).on("value",snapshot => {
              if (snapshot.exists()){
                const userData = snapshot.val();
                console.log("exists!", userData);
                return;
              }
              else{
                var today = new Date();
                const inboxRecipent = {
                  roomID: this.storeID + this.user.userID,
                  senderID: this.user.userID,
                  senderName:  this.user.userName,
                  senderPic: '',
                  time: today.toString().slice(3,10),
                  lastMsg: '',
                  seen: ''
                };
                const inboxSender = {
                  roomID: this.storeID + this.user.userID,
                  senderID: this.storeID,
                  senderName:  this.storeName,
                  senderPic: this.storePicture,
                  time: today.toString().slice(3,10),
                  lastMsg: '',
                  seen: ''
                };
                firebase
                  .database()
                  .ref("Messages/inboxes/" + this.storeID).child(this.user.userID)
                  .set(inboxRecipent);
                firebase
                  .database()
                  .ref("Messages/inboxes/" + this.user.userID).child(this.storeID)
                  .set(inboxSender);
              }
          });
        },
        saveMessage(){
          try{
            if(this.message == '' || !this.roomID || typeof this.roomID == 'undefined' || typeof this.user.userID == 'undefined') return;
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
            firebase
              .database()
              .ref("Messages/inboxes/"+ this.storeClickedID).child(this.user.userID)
              .update({time:today.toString().slice(3,10),lastMsg:this.message});
            firebase
              .database()
              .ref("Messages/inboxes/"+ this.user.userID).child(this.storeClickedID)
              .update({time:today.toString().slice(3,10),lastMsg:this.message});
            this.message = "";
            }
            catch(err){
              console.log(err);
            }
        },
        fetchMessage(){
          try{
            if(this.roomID){
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
              firebase.database().ref("Messages/inboxes/"+id).on("value", snapshot => {
              if(snapshot.exists())
              {
                  let data = snapshot.val();
                  let inboxes = [];
                  Object.keys(data).forEach(key => {
                  inboxes.push({
                      id: key,
                      recipentID: data[key].recipentID,
                      roomID: data[key].roomID,
                      senderID: data[key].senderID,
                      senderName:  data[key].senderName,
                      senderPic: data[key].senderPic,
                      time: data[key].time,
                      lastMsg: data[key].lastMsg,
                    });
                  });
                  this.storeList = inboxes;
              }
              else this.storeList = [];
            }); 
          }
          catch(err){
            console.log(err);
          }
        },
        storeClicked(idRoom,idStore){
          this.roomID = idRoom;
          this.storeClickedID = idStore;
          this.fetchMessage(idRoom);
        },
        exitChat(){
          localStorage.removeItem('chatUser');
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
        onInit(){
          if(this.isOpen){
            this.storeClickedID = this.storeID;
            if(localStorage.getItem('chatUser')){
              this.user = JSON.parse(localStorage.getItem('chatUser'));
              this.roomID= this.storeID + this.user.userID;
              this.show = true;
              this.createInboxes();
              this.fectchInboxes(this.user.userID);
              this.fetchMessage();
            }
            else
              this.checkLogin();
            }
        },
    },
    created(){
    },
    mounted(){
     this.onInit();
    },
}
</script>

<style>
.container{max-width:850px ; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 30%; ;
  border-left:1px solid #c4c4c4;
  border-right:1px solid #c4c4c4;
}
.inbox_msg {
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}

.recent_heading {float: left; width:100%; color: black;  padding: 5px;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch{padding:10px 20px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4; border-top:1px solid #c4c4c4;}

.recent_heading h5 {
  color: #A9A9A9;
  font-size: 15px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ font-size:12px; color:#464646; margin:0 0 0px 0;}
.chat_ib h5 span{ font-size:12px; float:right;}
.chat_ib p{ font-size:12px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 15%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 5px;
  width: 85%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  cursor: pointer;
  border-bottom: 1px solid #efefef;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { padding: 0px; height: 400px; overflow-y: scroll; }

.active_chat{ background:#ebebeb;}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
  margin-bottom: 10px;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg p {
  background: #efefef none repeat scroll 0 0;
  border-radius: 5px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 10px 10px 10px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 2px 0 8px 8px;
}
.received_withd_msg { width: 57%;}
.mesgs {
  float: left;
  width: 70%;
  background: white;
  border-right:1px solid #c4c4c4;
}

 .sent_msg p {
  background: blue none repeat scroll 0 0;
  border-radius: 5px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 10px 10px 10px 12px;
  width:100%;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg { background: white;border-top: 1px solid #c4c4c4;position: relative;}
.msg_send_btn {
  background: blue none repeat scroll 0 0;
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
.messaging { padding: 0 0 50px 0; border-right:1px solid #c4c4c4;}
.msg_history {
  padding: 10px;
  height: 346px;
  overflow-y: auto;
}
.write_msg{
    padding: 0 0 0 0px;
}
.center {
  border: none;
  height: 40px;
  border-radius: 5px;
  color: white;
  background: red;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>