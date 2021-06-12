<template>
  <div class="container">
    <div v-if="!show" style=" height:100%; width:100%; position: relative;background:white">
       <div class="msg_history">
         <div class="form-outline">
          <input v-model="email"  type="text" placeholder="Please enter your email" id="formControlLg" class="form-control form-control-lg center" style="height: 40px;width: 80%" />
        </div>
       </div>
       <button class="center" style="margin-top: 60px" @click="openChat" type="button">Chat</button>
    </div>
    

  <div v-if="show" class="messaging" >
    <div class="inbox_people">
        <div class="headind_srch">
            <div class="recent_heading">
              <h4>Store</h4>
            </div>
          </div>
          <div class="inbox_chat">
            <div v-for="(store,index) in storeList" v-bind:key="index" :class="[idStore === store.storeID? 'chat_list active_chat':'chat_list']"  @click="storeClicked(store.storeID)">
              <div class="chat_people">
                <div class="chat_img"> <img v-lazy="store.storePicture" :alt="store.storeName"> </div>
                <div class="chat_ib">
                  <h5>{{store.storeName}} <span class="chat_date"></span></h5>
                </div>
                 
              </div>
            </div>
          </div>
        </div>

      <div class="mesgs">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Chat bot</h4>
            </div>
          </div>
          <div class="msg_history">
            <div v-for="(mess,index) in messages" v-bind:key="index">
            <div v-if="mess.storename" class="incoming_msg" >
              <div class="incoming_msg_img"> 
                <img src="../../assets/imgs/userPic.png" alt="sunil"> 
              </div>
                <div  class="received_msg">
                    <div class="received_withd_msg">
                      <p>{{ mess.text}}</p>
                      <span v-if="mess.date" class="time_date"> {{ toDateTime(mess.date)}}</span>
                    </div>
                </div>
            </div>
            <div v-else class="outgoing_msg">
              <div class="sent_msg">
                <p>{{ mess.text}}</p>
                <span v-if="mess.date" class="time_date"> {{ toDateTime(mess.date)}}</span> 
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

    </div>
</template>

<script>
import firebase from 'firebase';
import UserService from '@/services/UserService.js'
export default {
    data(){
        return{
            user:'',
            storeList:[],
            message: null,
            name: '',
            email:'',
            messages: [],
            show : false,
            idStore:''
        }
    },
    props:{
      storeID: String,
      storeName: String,
      storePicture: String,
    },
    methods:{
      openChat(){
        if(this.email){
          this.name = this.email.slice(0,this.email.indexOf('@'));
          localStorage.push('chatName',this.name);
          this.sayWelcome();
          this.show = true;
          this.fetchMessage();
        }
        else alert('please enter your email')
      },  
        toDateTime(secs) {
            return secs.toString().slice(0,21);
        },
        sayWelcome(){
          try{
          this.checkStore();
          var today = new Date();
          const mess = {
            text: "Xin chào, tôi có thể giúp gì cho bạn???",
            storename: this.name,
            date: today.toString()
          };
          firebase
            .database()
            .ref("Messages/store/"+this.idStore+'/'+ this.name +'/')
            .push(mess);
           firebase
            .database()
            .ref("Messages/store/"+this.idStore+'/' + this.name +'/')
            .child('lastmess').set("Xin chào, tôi có thể giúp gì cho bạn???");
          }
          catch(err){
            console.log(err);
          }
        },
        saveMessage(){
          try{
          if(this.message == '') return;
          this.checkStore();
          var today = new Date();
          const mess = {
            text: this.message,
            username: this.name,
            date: today.toString()
          };
          firebase
            .database()
            .ref("Messages/store/"+this.idStore+'/'+ this.name +'/')
            .push(mess);
          firebase
            .database()
            .ref("Messages/store/"+this.idStore+'/' + this.name +'/')
            .child('lastmess').set(this.message);
          this.message = "";
          }
          catch(err){
            console.log(err);
          }
        },
         fetchMessage(){
          try{
            if(this.name){
              firebase.database().ref("Messages/user/").child(this.name).on("value", snapshot =>{
                let data = snapshot.val();
                let messages = [];
                Object.keys(data).forEach(key => {
                  messages.push({
                    storeID: data[key].storeID,
                    storeName: data[key].storeName,
                    storePicture: data[key].storePicture,
                  });
                });
                this.storeList=messages;
              });
              firebase.database().ref("Messages/store/").child(this.idStore).child(this.name).on("value", snapshot => {
                let data = snapshot.val();
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
            }); 
            }
            else this.messages=[];
          }
          catch(err){
            console.log(err);
          }
        },
        async checkLogin(){
          const token = localStorage.getItem('isAuthen')
          if(!token) return;
          this.user = await UserService.getInfo(token);
          console.log(this.user[0]);
          if(this.user[0] != 'Bạn cần đăng nhập'){
            this.email = this.user[0].email;
            this.name = this.email.slice(0,this.email.indexOf('@'));
            this.show = true;
            this.sayWelcome();
            this.fetchMessage();
          }
          this.fetchMessage();
        },
        storeClicked(id){
          this.idStore = id;
          this.fetchMessage();
        },
        checkStore(){
          const mess = {
              storeID: this.idStore,
              storeName: this.storeName,
              storePicture: this.storePicture,
            };
          console.log(mess)
          firebase
            .database()
            .ref("Messages/user/"+this.name).orderByChild("storeID").equalTo(this.idStore).once("value",snapshot => {
                if (snapshot.exists()){
                  const userData = snapshot.val();
                  console.log("exists!", userData);
                  return;
                }
                else{
                  const mess = {
                    storeID: this.idStore,
                    storeName: this.storeName,
                    storePicture: this.storePicture,
                  };
                  firebase
                    .database()
                    .ref("Messages/user/"+this.name)
                    .push(mess);
                }
            });
        },
    },
    created(){
    },
    mounted(){
      this.idStore = this.storeID;
      this.checkLogin();
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
  width: 30%; border-right:1px solid #c4c4c4;
}
.inbox_msg {
  clear: both;
  overflow: hidden;
}
.top_spac{ margin: 20px 0 0;}

.recent_heading {float: left; width:100%; color: black;  padding: 5px; }
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch{ background: blue; padding:10px 20px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #fff;
  font-size: 18px;
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
  width: 12%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  cursor: pointer;
  border-bottom: 1px solid #efefef;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { padding: 7px; height: 400px; overflow-y: scroll; }

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
.messaging { padding: 0 0 50px 0;}
.msg_history {
  padding: 10px;
  height: 331px;
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