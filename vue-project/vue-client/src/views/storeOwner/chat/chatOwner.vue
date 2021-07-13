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
            <div v-for="(cus,index) in result" v-bind:key="index" :class="[roomID === cus.roomID? 'chat_list active_chat':'chat_list']" @click="inboxClicked(cus)">
              <div class="chat_people">
                <div class="chat_img"> <img v-lazy="cus.senderPic" alt="sunil"> </div>
                <div :class="[cus.seen === 'false'? 'unseen_chat':'chat_ib']">
                  <h5>{{cus.senderName}} </h5>
                  <p v-if="cus.lastMsg">{{stringcut(cus.lastMsg)}} <i class="fas fa-circle" style="font-size: 4px"></i>{{getDate(cus.time)}}</p>
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
import StoreService from '@/services/StoreService.js'
export default {
    beforeRouteEnter (to, from, next) {
      AuthService.checkUser(localStorage.getItem('isAuthen'))
      AuthService.checkStoreOwner(localStorage.getItem('isAuthen'))
      next();
    },
    data(){
      return{
        ownerID:'',
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
      saveMessage(){
        try{
          if(this.message && this.roomID && this.inboxID && this.storeClickedID && this.ownerID){
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
              .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.inboxID)
              .update({seen:'true',time:today.getTime(),lastMsg:this.message});
            firebase
              .database()
              .ref("Messages/inboxes/users/"+ this.inboxID).child(this.storeClickedID)
              .update({seen:'false',time:today.getTime(),lastMsg:this.message});
            this.message = '';
          }
          else alert('Errr')
        }
        catch(err){
          console.log(err);
        }
      },
      fetchMessage(){
        try{
          if(this.roomID && this.inboxID && this.storeClickedID){
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
                    .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.inboxID)
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
            firebase.database().ref("Messages/inboxes/stores/" + this.ownerID +"/"+ id).on("value", snapshot => {
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
                if(inboxes[0].recipentID == this.storeClickedID){
                  this.inboxes = inboxes;
                  this.result= this.inboxes;
                }
                if(this.inboxID == ''){
                  this.inboxID = inboxes[0].senderID;
                  this.roomID = inboxes[0].roomID;
                  this.fetchMessage();
                }
            }
            else
            { 
              this.inboxID=''; this.inboxes = [];this.result= [];}
          }); 
        }
        catch(err){
          console.log(err);
        }
      },
      async fetchStore(){
        try{
          var user = localStorage.getItem("userInfor");
          user = JSON.parse(user);
          this.ownerID = user.userID
          this.store = await StoreService.getByUser(this.ownerID,localStorage.getItem('isAuthen'));
          this.resultStore= this.store;
          this.storeClickedID = this.store[0].storeID;
          this.fectchInboxes(this.store[0].storeID);
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
      this.inboxID = '';
      this.inboxes = [];
      this.result =[];
      this.messages = [];
      this.storeClickedID = id;
      this.roomID= '';
      this.fectchInboxes(id);
    },
    inboxClicked(inbox){
      if(inbox){
        this.messages = [];
        this.inboxID = inbox.id;
        if(inbox.seen == 'false')
        {
          firebase
          .database()
          .ref("Messages/inboxes/stores/"+ this.ownerID).child(inbox.recipentID).child(inbox.id)
          .update({seen: 'true'});
        }
        this.roomID = inbox.roomID;
        this.fetchMessage();
      }
    },
    getUserName(id){
      if(this.inboxes)
      {
        let temp = ''
        this.inboxes.forEach(element => {
          if(element.senderID == id)
            temp = element.senderName;
        });
        return temp;
      }
    },
  },
  mounted(){
    this.fetchStore();
  },
}
</script>

<style scoped>

@import url('../../../assets/css/chat.css');
.chat{
  background: white;
}
</style>