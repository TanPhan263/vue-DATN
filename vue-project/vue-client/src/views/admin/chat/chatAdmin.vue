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
        admin:{                //thông tin user
          adminID: '',
          adminName:'',
          adminPic: ''
        },
        keywordStore:'',        //dùng để tìm kiếm quán
        message: null,          //tin nhắn
        messages: [],           //danh sách tin nhắn
        store:[],               //danh sách quán trong hộp thư
        senderPic: '',          //hình ảnh của quán đang nhắn tin
        resultStore: [],        //danh sách quán trong hộp thư sau khi lọc
        storeClickedID:'',      //quán đang chat
        ownerID: '',            //ID của chủ quán
        roomID:'',              //Id của phòng chat
      }
    },
    created(){
      this.$root.$refs.chatAdmin = this;  //khai báo để sử dụng ở các component khác 
    },
    methods:{
      createInbox(id,name,picture,owner){//tạo một inbox mới 
        if(id && name && owner){
          this.storeClickedID = id;
          this.ownerID = owner;
          this.createInboxes(id,name,picture,owner); //hàm tạo inbox 
          this.fetchMessage();
        }
      },
      createInboxes(storeId,storeName,storePicture,storeOwner){
        try{
          if(storeId && storeName && storeOwner && this.admin.adminID){
            this.storeClickedID = storeId;
            this.roomID =  this.storeClickedID + this.admin.adminID; //tạo id phòng chat bằng cách ghép hai ID của quán và người dùng lại
            firebase
              .database()
              .ref("Messages/inboxes/user/").child(this.admin.adminID).orderByChild('roomID').equalTo(this.roomID).on("value",snapshot => {
                if (snapshot.exists()){                               //nếu inbox đã tồn tại thì thông báo đã tồn tại và thoát
                  const Data = snapshot.val();
                  console.log("exists!", Data);
                  return;
                }
                else{
                  var today = new Date();
                  const inboxRecipent = {           //tạo inbox của người nhận (quán/user)
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
                  const inboxSender = {                 //Tạo inbox của ng gửi admin
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
                  if(this.ownerID == 'none'){                 //Nếu có ID chủ quán là store
                    firebase                                  //THêm vào firebase hòm thư của quán nhận
                    .database()
                    .ref("Messages/inboxes/users/" + this.storeClickedID).child(this.admin.adminID)
                    .set(inboxRecipent);
                  } 
                  else{                                       //Không có chủ quán thì là user
                    firebase                                  //THêm vào firebase hòm thư của user nhận
                    .database()
                    .ref("Messages/inboxes/stores/" + storeOwner).child(storeId).child(this.admin.adminID)
                    .set(inboxRecipent);
                  }
                  firebase                                  //THêm vào firebase hòm thư của user gửi
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
      saveMessage(){                                        //lưu tin nhắn
        try{
          if(this.message && this.roomID && this.storeClickedID && this.admin.adminID && this.ownerID){
            var today = new Date();
            const mess = {
              roomID: this.roomID,
              senderID: this.admin.adminID,
              msg: this.message,
              date: today.toString().slice(3,21)
            };
            firebase                                              //lưu tin nhắn vào firebase
              .database()
              .ref("Messages/chatMessages/")
              .push(mess);
            if(this.ownerID == 'none')
            {
              firebase                                            //update hòm thư của quán nhận
              .database()                                         //seen == false là chưa xem tin nhắn, lastMsg là tin vừa nhắn 
              .ref("Messages/inboxes/users/"+ this.storeClickedID).child(this.admin.adminID)
              .update({seen:'false',time:today.getTime(),lastMsg:this.message});
            }
            else{
            firebase                                                 //update hòm thư của người nhận
              .database()
              .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.admin.adminID)
              .update({seen:'false',time:today.getTime(),lastMsg:this.message});
            }
            firebase
              .database()                                             //update hòm thư của người gửi
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
      fetchMessage(){                                 //lấy danh sách tin nhắn theo roomID
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
                  {  //nếu đang nhắn với thi update hòm thư của mình là đã xem seen = true
                    firebase
                    .database()
                    .ref("Messages/inboxes/users/"+ this.admin.adminID).child(this.storeClickedID)
                    .update({seen: 'true'});
                  }
                if(this.roomID == messages[0].roomID) //chỉ fetch tin nhắn của phòng hiện tại
                  this.messages = messages;
              }
          }); 
          }
        }
        catch(err){
          console.log(err);
        }
      },
      fectchInboxes(id){                              //Load hòm thư của người dùng
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
              if(this.storeClickedID == ''){        //nếu là lần đầu mở thì mở tin nhắn của quán/người đầu tiên
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
    onChangeStore(key){ //hàm tim kiếm inbox theo tên
      if(key == '' || key == null)
        return this.resultStore=this.store;
      else {
        this.resultStore = this.store.filter(function(item){
          return item.senderName.toLowerCase().includes(key.toLowerCase());
        })
      }
    },
    storeClicked(idRoom,idStore,seen,senderPic,ownerID){  // thay đổi dữ liệu Khi nhấn vào một quán trong inbox
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
    getDate(sec){ //hàm lấy thời gian bằng timestamp
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var date = new Date(sec);
      var currdate = new Date();
      if(date.getDate() == currdate.getDate())
        return date.getHours() + ':' + date.getMinutes(); //nếu cùng một ngày thì hiển thị giờ phút
      else 
        return ' ' + monthNames[date.getMonth() +1] + ' ' + date.getDate();   //khác ngày thì hiển thị ngày tháng
    },
    async checkLogin(){ //Hàm kiểm tra user có đang login hay k 
      let token = localStorage.getItem('isAuthen');
      let respone = await UserService.getInfo(token); 
      if(respone[0] != 'Bạn cần đăng nhập'){
        this.admin.adminID = respone[0].userID; // lấy thông tin người dùng //thiết lập thông tin user
        this.admin.adminName = respone[0].userName + '- Admin';
        this.fectchInboxes(this.admin.adminID);        //load hộp thư
        if(typeof respone[0].picture != 'undefined')
        this.admin.adminPic = respone[0].picture;
        this.fetchMessage();                           //Load tin nhắn
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