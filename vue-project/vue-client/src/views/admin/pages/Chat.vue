<template>
<div class="container">
<div class="inbox_store">
        <div class="headind_srch">
            <div class="recent_heading">
              <h4>Store</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input  v-model="keyword" type="text" class="search-bar"  placeholder="Search"   v-on:keyup="onChangeStore(keyword)" >
                <span class="input-group-addon">
                <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div class="inbox_chat" v-if="resultStore">
            <div v-for="(store,index) in resultStore" v-bind:key="index" :class="'chat_list' + active" @click="storeClicked(store.storeID)">
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
      <div class="inbox_msg">
        <div class="inbox_people">
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
            <div v-for="(cus,index) in result" v-bind:key="index" :class="'chat_list' + active" @click="getName(cus.id)">
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
          <div class="msg_history">
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
              <button class="msg_send_btn" type="button"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div></div>
</template>

<script>
import firebase from 'firebase';
export default {
    data(){
        return{
            keyword:'',
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
        openChat(){
          this.active= 'active_chat'
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
            .ref("Messages/store/"+this.storeID+'/'+ this.name +'/')
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
                this.name = this.customers[0].id
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
          const url = 'http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/Store/GetAllManage'
          this.$http.get(url,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
              this.store = response.data;
              this.resultStore= this.store;
              this.storeID=this.store[0].storeID;
              this.fetchUsers();

          });
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
       this.fetchUsers();
       if(this.customers[0]){
       this.name = this.customers[0].id
       this.fetchMessage();
       }
    },
}
</script>

<style>
.container{max-width:1170px; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: right;
  overflow: hidden;
  width: 30%; border-left:1px solid #c4c4c4;
}
.inbox_store {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 30%; border:1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}

.recent_heading {float: left; width:30%;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 70%;
}
.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
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

.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  cursor: pointer;
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { height: 450px; overflow-y: scroll;}

.active_chat{ background:#ebebeb;}

.incoming_msg{
  margin-bottom: 10px;
}
.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
 }
 .received_withd_msg p {
  background: white none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 85%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg { width: 57%;}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 70%;
}

 .sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
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

.type_msg {border-top: 1px solid #c4c4c4;position: relative;}

.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging { float: right; width: 70%; padding: 0 0 50px 0;}
.msg_history {
  height: 416px;
  overflow-y: auto;
}
</style>