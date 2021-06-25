<template>
<div class="container">
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
        <div v-for="(store,index) in resultStore" v-bind:key="index" :class="[storeID === store.storeID? 'chat_list active_chat':'chat_list']" @click="storeClicked(store.storeID)">
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
            <div v-for="(cus,index) in result" v-bind:key="index" :class="[name === cus.id? 'chat_list active_chat':'chat_list']" @click="getName(cus.id)">
              <div class="chat_people">
                <div class="chat_img"> <img src="../../../assets/imgs/userPic.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{cus.id}} <span class="chat_date"></span></h5>
                   <p>{{cus.lastmess}}</p>
                </div>
              </div>
            </div>
          </div>
         
        </div>
        <div class="mesgs">
          <div class="msg_history" v-chat-scroll="{always: false, smooth: true}">
            <div v-for="(mess,index) in messages" v-bind:key="index">
            <div v-if="mess.username" class="incoming_msg">
              <div class="incoming_msg_img"> 
                <img src="../../../assets/imgs/userPic.png" alt="sunil"> 
              </div>
                <div  class="received_msg">
                    <div class="received_withd_msg">
                      <p>{{ mess.text}}</p>
                      <span v-if="mess.date" class="time_date"> {{  toDateTime(mess.date)}}</span> 
                    </div>
                </div>
            </div>
            <div v-else class="outgoing_msg">
              <div class="sent_msg">
                <p>{{ mess.text}}</p>
                <span v-if="mess.date" class="time_date"> {{  toDateTime(mess.date)}}</span> 
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
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
    data(){
        return{
            keyword:'',
            keywordStore:'',
            message: null,
            name: '',
            storeName: '',
            storeID:'',
            email:'',
            img: null,
            messages: [],
            customers: [],
            result: [],
            store:[],
            resultStore: [],
            show : false,
            active: []
        }
    },
    methods:{
        getName(name){
          this.name = name;
          this.fetchMessage();
        },
        toDateTime(secs) {
            return secs.toString().slice(0,21);
        },
        saveMessage(){
          if(this.message == '') return;
          var today = new Date();
          const mess = {
            text: this.message,
            storename: 'store',
            date: today.toString()
          };
          firebase
            .database()
            .ref("Messages/store/"+ this.storeID +'/'+ this.name +'/')
            .push(mess);
           firebase
            .database()
            .ref("Messages/store/"+this.storeID+'/' + this.name +'/')
            .child('lastmess').set(this.message);
          this.message = "";
        },
        fetchUsers(){
            const userRef = firebase.database().ref("Messages/store/"+ this.storeID + '/');
            userRef.on("value", snapshot => {
            let data = snapshot.val();
            console.log(data)
            if(data){
              let users = [];
              Object.keys(data).forEach(key => {
                    users.push({
                    id: key,
                    lastmess: snapshot.child(key).child('lastmess').val()
                    });
                });
              console.log(users)
              if (users[0].lastmess){
                this.customers = users;
                this.result = this.customers;
                // this.name = this.customers[0].id
                this.fetchMessage();
              }
            }
            else{
              this.result = [];
              this.messages=[];
            }
          });
        },
        fetchMessage(){
          if(this.name){
          const itemsRef = firebase.database().ref("Messages/store/"+this.storeID+'/'+ this.name +'/');
            itemsRef.on("value", snapshot => {
              let data = snapshot.val();
              if(data){
              let messages = [];
              Object.keys(data).forEach(key => {
                messages.push({
                  id: key,
                  storename: data[key].storename,
                  username: data[key].username,
                  text: data[key].text,
                  date: data[key].date
                });
              });
              this.messages = messages;
              this.messages.pop();
              }
              else this.messages = [];
            }); 
          }
        },
        fetchStore(){
          try{
            const url = 'https://api.viefood.info/api/Store/GetAllManage'
            this.$http.get(url,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
                this.store = response.data;
                this.resultStore= this.store;
                this.storeID=this.store[0].storeID;
                this.fetchUsers();
            });
          }
          catch{}
        },
        onChange(key){
          if(key == '' || key == null)
            return this.result=this.customers;
          else {
            this.result = this.customers.filter(function(item){
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
        this.storeID = id;
        this.fetchUsers();
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