<template>
<div class="container">
  <!-- <div class="popup" @click="openPopup">{{storeName}}
        <i class="fa fa-chevron-down" style="font-size: 16px;"></i>
    <span class="popuptext" id="myPopup">
        <div class="'container'">
        <div class="inbox_store" style="background: white;border:none; direction: rtl;width: 100%">
            <div class="headind_srch">
                <div class="recent_heading">
                <h4>Store</h4>
                </div>
          </div>
          <div class="inbox_chat" v-if="resultStore" style="direction: ltr;">
            <div v-for="(store,index) in resultStore" v-bind:key="index" :class="[storeID === store.storeID? 'chat_list active_chat':'chat_list']" @click="storeClicked(store.storeID,store.storeName)">
              <div class="chat_people">
                <div class="chat_img"> <img v-lazy="store.storePicture" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{store.storeName}} <span class="chat_date"></span></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </span>
    </div> -->
  <div class="inbox_store chat">
    <div class="headind_srch">
        <div class="recent_heading">
          <h4>Store</h4>
        </div>
        <div class="srch_bar">
          <div class="stylish-input-group">
            <input  v-model="keywordStore" type="text" class="search-bar"  placeholder="Search"   v-on:keyup="onChangeStore(keywordStore)" >
            <span class="input-group-addon">
            <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
            </span> </div>
        </div>
      </div>
      <div class="inbox_chat" v-if="resultStore">
        <div v-for="(store,index) in resultStore" v-bind:key="index" :class="[storeClickedID === store.storeID? 'chat_list active_chat':'chat_list']" @click="storeClicked(store.storeID)">
          <div class="chat_people">
            <div class="chat_img"> <img v-lazy="store.storePicture" alt="sunil"> </div>
            <div class="chat_ib">
              <h5>{{store.storeName}} <span class="chat_date"></span></h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="messaging">
      <div class="inbox_msg" >
        <div class="inbox_people chat">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Recent</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input  v-model="keyword" type="text" class="search-bar"  placeholder="Search"   v-on:keyup="onChange(keyword)" >
                <span class="input-group-addon">
                <button type="button"> <i class="fa fa-search" aria-hidden="true" style="font-size: 15px"></i> </button>
                </span> </div>
            </div>
          </div>
          <div class="inbox_chat" v-if="result">
            <div v-for="(cus,index) in result" v-bind:key="index" :class="[roomID === cus.roomID? 'chat_list active_chat':'chat_list']" @click="inboxClicked(cus.id,cus.roomID,cus.seen)">
              <div class="chat_people">
                <div class="chat_img"> <img v-lazy="cus.senderPic" alt="sunil"> </div>
                <div :class="[cus.seen === 'false'? 'unseen_chat':'chat_ib']">
                  <h5>{{cus.senderName}} </h5>
                  <p v-if="cus.lastMsg">{{stringcut(cus.lastMsg)}} <i class="fas fa-circle" style="font-size: 4px"></i>{{cus.time}}</p>
                </div>
              </div>
            </div>
          </div>
         
        </div>
        <div class="mesgs">
          <div class="msg_history" v-chat-scroll="{always: false, smooth: true}">
            <div v-for="(mess,index) in messages" v-bind:key="index">
            <div v-if="mess.senderID !== storeClickedID" class="incoming_msg">
              <div class="incoming_msg_img">
                <img src="../../../assets/imgs/userPic.png" alt="sunil"> 
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
export default {
    beforeRouteEnter (to, from, next) {
      AuthService.checkUser(localStorage.getItem('isAuthen'))
      AuthService.checkStoreOwner(localStorage.getItem('isAuthen'))
      next();
    },
    data(){
      return{
        keyword:'',
        keywordStore:'',
        message: null,
        messages: [],
        result: [],
        store:[],
        resultStore: [],
        inboxes: [],
        inboxID:'',
        inboxName:'',
        storeClickedID:'',
        roomID:''
      }
    },
    methods:{
      stringcut(index){
        if(index.length > 20)
          return index.slice(0,12);
        return index;
      },
      saveMessage(){
        try{
          if(this.message == '' || !this.roomID || typeof this.roomID == 'undefined' || typeof this.inboxID == 'undefined') return;
          var today = new Date();
          const mess = {
            roomID: this.roomID,
            senderID: this.storeClickedID,
            msg: this.message,
            date: today.toString().slice(3,21)
          };
          firebase
            .database()
            .ref("Messages/chatMessages/")
            .push(mess);
          firebase
            .database()
            .ref("Messages/inboxes/"+ this.storeClickedID).child(this.inboxID)
            .update({seen:'true',time:today.toString().slice(3,10),lastMsg:this.message});
          firebase
            .database()
            .ref("Messages/inboxes/"+ this.inboxID).child(this.storeClickedID)
            .update({seen:'false',time:today.toString().slice(3,10),lastMsg:this.message});
          this.message = '';
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
                if(messages[messages.length -1].senderID == this.inboxID)
                  {
                    firebase
                    .database()
                    .ref("Messages/inboxes/"+ this.storeClickedID).child(this.inboxID)
                    .update({seen: 'true'});
                  }
                if(this.roomID == messages[0].roomID)
                  this.messages = messages;
                else return;
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
            firebase.database().ref("Messages/inboxes/"+ id).on("value", snapshot => {
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
                    seen: data[key].seen
                  });
                });
                this.inboxes = inboxes;
                this.result= this.inboxes;
            }
            else
            { this.inboxes = [];this.result= [];}
          }); 
        }
        catch(err){
          console.log(err);
        }
      },
      deleteInboxes(id){
        if(confirm('Bạn chắc chắn muốn xóa?'))
        {
          firebase
            .database()
            .ref("Messages/inboxes/"+ this.storeClickedID).child(this.inboxID)
            .remove();
          firebase
            .database()
            .ref("Messages/inboxes/"+ this.inboxID).child(this.storeClickedID)
            .remove();
          firebase
            .database()
            .ref("Messages/chatMessages/"+ this.roomID)
            .remove();
        }
      },
      fetchStore(){
        try{
          const url = 'https://api.viefood.info/api/Store/GetAllManage'
          this.$http.get(url,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
              this.store = response.data;
              this.resultStore= this.store;
                this.fectchInboxes(this.store[0].storeID);
          });
        }
        catch{}
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
          return item.storeName.toLowerCase().includes(key.toLowerCase());
        })
      }
    },
    storeClicked(id){
      this.messages = [];
      this.storeClickedID = id;
      this.fectchInboxes(id);
    },
    inboxClicked(inboxID, roomID,seen){
      this.messages = [];
      this.inboxID = inboxID;
      // this.inboxName = inboxName;
      if( seen == 'false')
      {
        firebase
        .database()
        .ref("Messages/inboxes/"+ this.storeClickedID).child(this.inboxID)
        .update({seen: 'true'});
      }
      this.roomID = roomID;
      this.fetchMessage();
    }
  },
  mounted(){
    this.fetchStore();
  },
}
</script>

<style>
@import url('../../../assets/css/chat.css');
.chat{
  background: white;
}
</style>