<template>
<div class="container">
  <div class="inbox_store chat">
    <div class="headind_srch">
        <div class="recent_heading">
          <h5>Gần đây</h5>
        </div>
        <div class="srch_bar">
          <div class="stylish-input-group">
            <input  v-model="keywordStore" type="text" class="search-bar"  placeholder="Search"  v-on:keyup="onChangeStore(keywordStore)" >
            <span class="input-group-addon">
            <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
            </span> </div>
        </div>
      </div>
      <div class="inbox_chat" v-if="resultStore">
        <div v-for="(store,index) in resultStore" v-bind:key="index" :class="[storeClickedID === store.id? 'chat_list active_chat':'chat_list']" @click="storeClicked(store.roomID,store.id,store.seen,store.senderPic,store.ownerID)">
          <div class="chat_people">
            <div class="chat_img"> 
              <img class="img-avt" v-lazy="store.senderPic" alt="sunil">
             </div>
            <div :class="[store.seen === 'false'? 'unseen_chat':'chat_ib']">
              <h5>{{store.senderName}}</h5>
               <p v-if="store.lastMsg">{{store.lastMsg}} <i class="fas fa-circle" style="font-size: 4px"></i>{{getDate(store.time)}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="messaging">
      <div class="inbox_msg" >
        <div class="mesgs-admin">
          <div class="msg_history" v-chat-scroll="{always: false, smooth: true}">
            <div v-for="(mess,index) in messages" v-bind:key="index">
            <div v-if="mess.senderID !== admin.adminID" class="incoming_msg">
              <div class="incoming_msg_img">
                <img  class="img-avt" v-if="senderPic" v-lazy="senderPic" alt="sunil"> 
                  <img  class="img-avt" v-else src="../../../assets/imgs/userPic.png" alt="sunil"> 
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
                <p>{{ mess.msg}}</p>
                <span v-if="mess.date" class="time_date"> {{  mess.date}}</span> 
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
  </div>
</template>

<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService.js'
import UserService from '@/services/UserService.js'
export default {
    beforeRouteEnter (to, from, next) {
      AuthService.checkUser(localStorage.getItem('isAuthen'))
      AuthService.checkAdmin(localStorage.getItem('isAuthen'))
      next();
    },
    data(){
      return{
        admin:{
          adminID: '',
          adminName:'',
          adminPic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIXIrqiW3R5OstWAjkuFvNwvjYHRaTmwEQWg&usqp=CAU'
        },
        keywordStore:'',
        message: null,
        messages: [],
        store:[],
        senderPic: '',
        resultStore: [],
        storeClickedID:'',
        ownerID: ''
      }
    },
    created(){
      this.$root.$refs.chatAdmin = this;
    },
    methods:{
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
          if(storeId && storeName && storeOwner && this.admin.adminID){
            this.storeClickedID = storeId;
            this.roomID =  this.storeClickedID + this.admin.adminID;
            firebase
              .database()
              .ref("Messages/inboxes/user/").child(this.admin.adminID).orderByChild('roomID').equalTo(this.roomID).on("value",snapshot => {
                if (snapshot.exists()){
                  const Data = snapshot.val();
                  console.log("exists!", Data);
                  return;
                }
                else{
                  var today = new Date();
                  const inboxRecipent = {
                    recipentID: storeId,
                    roomID: this.roomID,
                    senderID: this.admin.adminID,
                    senderName:  this.admin.adminName,
                    senderPic: this.admin.adminPic,
                    ownerID :storeOwner,
                    time: today.getTime().toString(),
                    lastMsg: '',
                    seen: ''
                  };
                  const inboxSender = {
                    recipentID: this.admin.adminID,
                    roomID: this.roomID,
                    senderID: storeId,
                    senderName: storeName,
                    senderPic: storePicture,
                    ownerID :storeOwner,
                    time: today.getTime().toString(),
                    lastMsg: '',
                    seen: ''
                  };
                  if(this.ownerID == 'none'){
                    firebase
                    .database()
                    .ref("Messages/inboxes/users/" + this.storeClickedID).child(this.admin.adminID)
                    .set(inboxRecipent);
                  } 
                  else{
                    firebase
                    .database()
                    .ref("Messages/inboxes/stores/" + storeOwner).child(storeId).child(this.admin.adminID)
                    .set(inboxRecipent);
                  }
                  firebase
                    .database()
                    .ref("Messages/inboxes/users/" + this.admin.adminID).child(storeId)
                    .set(inboxSender);
                  }
              });
            }
          else alert('Lỗi rồi');
        }
        catch{}
      },
      saveMessage(){
        try{
          if(this.message && this.roomID && this.storeClickedID && this.admin.adminID && this.ownerID){
            var today = new Date();
            const mess = {
              roomID: this.roomID,
              senderID: this.admin.adminID,
              msg: this.message,
              date: today.toString().slice(3,21)
            };
            firebase
              .database()
              .ref("Messages/chatMessages/")
              .push(mess);
            if(this.ownerID == 'none')
            {
              firebase
              .database()
              .ref("Messages/inboxes/users/"+ this.storeClickedID).child(this.admin.adminID)
              .update({seen:'false',time:today.getTime(),lastMsg:this.message});
            }
            else{
            firebase
              .database()
              .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.admin.adminID)
              .update({seen:'false',time:today.getTime(),lastMsg:this.message});
            }
            firebase
              .database()
              .ref("Messages/inboxes/users/"+ this.admin.adminID).child(this.storeClickedID)
              .update({seen:'true',time:today.getTime(),lastMsg:this.message});
            this.message = '';
          }
          else{
            alert("Lỗi rồi");
            }
          }
          catch(err){
            console.log(err);
          }
      },
      fetchMessage(){
        try{
          if(this.roomID && this.storeClickedID){
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
                    .ref("Messages/inboxes/users/"+ this.admin.adminID).child(this.storeClickedID)
                    .update({seen: 'true'});
                  }
                if(this.roomID == messages[0].roomID)
                  this.messages = messages;
              }
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
                inboxes.push({
                    id: key,
                    recipentID: data[key].recipentID,
                    roomID: data[key].roomID,
                    senderID: data[key].senderID,
                    senderName:  data[key].senderName,
                    senderPic: data[key].senderPic,
                    ownerID: data[key].ownerID,
                    time: data[key].time,
                    lastMsg: data[key].lastMsg,
                    seen: data[key].seen
                  });
                });
                this.store = inboxes;
                this.resultStore= this.store;
                if(this.storeClickedID == ''){
                  this.storeClickedID = inboxes[0].senderID;
                  this.roomID = inboxes[0].roomID;
                  this.ownerID = inboxes[0].ownerID;
                  this.senderPic = inboxes[0].senderPic;
                  this.fetchMessage();
                }
            }
            else
            { this.inboxes = [];this.result= [];}
          }); 
        }
        catch(err){
          console.log(err);
        }
      },
      onChange(key){
        if(key == '' || key == null)
          return this.result=this.inboxes;
        else {
          this.result = this.inboxes.filter(function(item){
          return item.id.toLowerCase().includes(key.toLowerCase());
        })
      }
    },
    onChangeStore(key){
      if(key == '' || key == null)
        return this.resultStore=this.store;
      else {
        this.resultStore = this.store.filter(function(item){
          return item.senderName.toLowerCase().includes(key.toLowerCase());
        })
      }
    },
    storeClicked(idRoom,idStore,seen,senderPic,ownerID){
        this.messages = [];
        this.senderPic = senderPic;
        this.roomID = idRoom;
        this.storeClickedID = idStore;
        this.ownerID = ownerID;
        if(seen == 'false' && this.admin.adminID && idStore)
        {
          firebase
          .database()
          .ref("Messages/inboxes/users/"+ this.admin.adminID).child(idStore)
          .update({seen: 'true'});
        }
        this.fetchMessage();
    },
    getStoreName(id){
        if(this.store)
        {
          let temp = ''
          this.store.forEach(element => {
            if(element.senderID == id)
              temp = element.senderName;
          });
          return temp;
        }
    },
    getDate(sec){
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var date = new Date(sec);
      var currdate = new Date();
      if(date.getDate() == currdate.getDate())
        return date.getHours() + ':' + date.getMinutes();
      else 
        return ' ' + monthNames[date.getMonth() +1] + ' ' + date.getDate();
    },
    async checkLogin(){
      let token = localStorage.getItem('isAuthen');
      let respone = await UserService.getInfo(token);
      if(respone[0] != 'Bạn cần đăng nhập'){
        this.admin.adminID = respone[0].userID;
        this.admin.adminName = respone[0].userName + '- Admin';
        this.fectchInboxes(this.admin.adminID);
        if(typeof respone[0].picture != 'undefined')
        this.admin.adminPic = respone[0].picture;
        this.fetchMessage();
      }
      else{
        AuthService.logout();
      }
    },
  },
  mounted(){
    this.checkLogin();
  },
}
</script>

<style>
@import url('../../../assets/css/chat.css');
.chat{
  background: white;
}
</style>