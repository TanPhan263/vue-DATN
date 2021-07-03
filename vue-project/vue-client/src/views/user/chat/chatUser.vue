<template>
  <div class="container">
    <div v-if="!show" style="background: white; width:100%; height: 100%;  border: 1px solid #c4c4c4">
       <div class="inputEmail">
         <div class="form-outline">
          <input v-model="user.userName"  type="text" placeholder="Please enter your email" id="inputEmail" class="form-control form-control-lg center" style="height: 40px;width: 80%" />
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
            <div v-for="(store,index) in storeList" v-bind:key="index" :class="[storeClickedID === store.id? 'chat_list active_chat':'chat_list']"  @click="storeClicked(store.roomID,store.id,store.seen)">
              <div class="chat_people" >
                <div class="chat_img"> <img v-lazy="store.senderPic" :alt="store.storeName"> </div>
                <div :class="[store.seen === 'false'? 'unseen_chat':'chat_ib']" >
                  <h5>{{store.senderName}}</h5>
                   <p v-if="store.lastMsg">{{store.lastMsg}} <i class="fas fa-circle" style="font-size: 4px"></i>{{store.time}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div class="mesgs">
          <div class="headind_srch">
            <div class="recent_heading">
              <h5 style="width: 50%;float: left">Chat bot</h5>
              <i @click="exitChat" class="fas fa-sign-out-alt" style="font-size: 20px;float: right"></i>
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
            storeClickedID:'',
            storeClickedName:'',
            storeClickedPicture:''
        }
    },
    created(){
        this.$root.$refs.chatUser = this;
    },
    methods:{
        openChat(){
            if(this.validateEmail(this.user.userName)){
              this.user.userID = this.user.userName.slice(0,this.user.userName.indexOf('@'));
              sessionStorage.setItem('chatUser',JSON.stringify(this.user));
              // if(this.storeID && typeof this.storeID !='undefined'){
              //   this.storeClickedID = this.storeID;
              //   this.storeClickedName = this.storeName;
              //   this.storeClickedPicture = this.storePicture;
              //   this.roomID = this.storeID + this.user.userID;
              //   // this.createInboxes();
              // }
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
            // if(this.storeID != '' && typeof this.storeID !='undefined'){
            //     this.storeClickedID = this.storeID;
            //     this.storeClickedName = this.storeName;
            //     this.storeClickedPicture = this.storePicture;
            //     this.roomID = this.storeID + this.user.userID;
            //     // this.createInboxes();
            // }
            this.fectchInboxes(this.user.userID);
            this.fetchMessage();
          }
          else{
            this.show = false;
          }
        },
        createInbox(id,name,picture){
          if(id && name && picture){
            this.storeClickedID = id;
            this.storeClickedName = name;
            this.storeClickedPicture = picture;
            this.createInboxes();
            this.fetchMessage();
          }
        },
        createInboxes(){
          try{
          if(this.storeClickedID && this.storeClickedPicture && this.storeClickedName && this.user.userID){
            this.roomID =  this.storeClickedID + this.user.userID;
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
                    roomID: this.storeClickedID + this.user.userID,
                    senderID: this.user.userID,
                    senderName:  this.user.userName,
                    senderPic: '',
                    time: today.toString().slice(3,10),
                    lastMsg: '',
                    seen: ''
                  };
                  const inboxSender = {
                    roomID: this.storeClickedID + this.user.userID,
                    senderID: this.storeClickedID,
                    senderName:  this.storeClickedName,
                    senderPic: this.storeClickedPicture,
                    time: today.toString().slice(3,10),
                    lastMsg: '',
                    seen: ''
                  };
                  firebase
                    .database()
                    .ref("Messages/inboxes/" + this.storeClickedID).child(this.user.userID)
                    .set(inboxRecipent);
                  firebase
                    .database()
                    .ref("Messages/inboxes/" + this.user.userID).child(this.storeClickedID)
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
            if(this.message == '' || !this.roomID || typeof this.roomID == 'undefined' 
            || typeof this.user.userID == 'undefined' || this.storeClickedID == '' || this.user.userID == '') return;
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
              .update({seen:'false',time:today.toString().slice(3,10),lastMsg:this.message});
            firebase
              .database()
              .ref("Messages/inboxes/"+ this.user.userID).child(this.storeClickedID)
              .update({seen:'true',time:today.toString().slice(3,10),lastMsg:this.message});
            this.message = "";
            }
            catch(err){
              console.log(err);
            }
        },
        fetchMessage(){
          try{
            if(this.roomID  && typeof this.roomID != 'undefined'){
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
                  if(messages[messages.length -1].senderID == this.storeClickedID)
                  {
                    firebase
                    .database()
                    .ref("Messages/inboxes/"+ this.user.userID).child(this.storeClickedID)
                    .update({seen: 'true'});
                  }
                  if(this.roomID == messages[0].roomID){
                    this.messages = messages;
                  }
                  else{
                    this.$notify({
                      title:'Có tin nhắn mới từ '+ this.getStoreName(messages[messages.length -1].senderID),
                      text: messages[messages.length -1].msg
                    });
                    return;
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
                      seen : data[key].seen
                    });
                  });
                  this.storeList = inboxes;
                  if(this.storeClickedID == ''){
                    this.storeClickedID = inboxes[0].senderID;
                    this.roomID = inboxes[0].roomID;
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
        storeClicked(idRoom,idStore,seen){
          this.messages = [];
          this.roomID = idRoom;
          this.storeClickedID = idStore;
          if(seen == 'false')
            {
              firebase
              .database()
              .ref("Messages/inboxes/"+ this.user.userID).child(idStore)
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
            // if(this.storeID != '' && typeof this.storeID !='undefined'){
            //   this.storeClickedID = this.storeID;
            //   this.storeClickedName = this.storeName;
            //   this.storeClickedPicture = this.storePicture;
            //   this.roomID = this.storeID + this.user.userID;
            //   // this.createInboxes();
            // }
            this.fectchInboxes(this.user.userID);
            this.fetchMessage();
            this.show = true;
          }
          else
            this.checkLogin();
        }
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

.chat_ib h5{ font-size:12px; color: #484848; margin:0 0 0px 0;}
.chat_ib p{ font-size:12px; color: #484848; margin:auto}
.chat_img {
  margin-top: 4px;
  float: left;
  width: 17%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 5px;
  width: 83%;
}

.unseen_chat h5{ font-size:13px; color: black; margin:0 0 0px 0;}
.unseen_chat p{ font-size:12px; font-weight: bold; color: black; margin:auto}
.unseen_chat {
  float: left;
  padding: 0 0 0 5px;
  width: 83%;
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
.inputEmail{
  height: 450px;
  width: 940px;
}
</style>