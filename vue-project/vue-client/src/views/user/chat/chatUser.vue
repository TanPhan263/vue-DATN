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
        user:{                          //thông tin user
          userID: '',
          userName:'',
          userPIc:''
        },
        storeList:[],                   //danh sách quán trong hộp thư
        message: null,                  //tin nhắn
        messages: [],                   //danh sách tin nhắn
        show : false,                   //biến kiểm tra đã co user hay không để hiện mà hình chat
        roomID:'',                      //Id của phòng chat
        storeClickedID:'',              //quán đang chat
        senderPic:'',                   //hình ảnh của quán đang nhắn tin
        ownerID: '',                    //ID của chủ quán
        isLogin: false,                 //biến kiểm tra có loggin hay không
      }
    },
    props:{
      isOpen : Boolean //biến xác đinh hộp thư có đang mở hay không
    },
    created(){
      this.$root.$refs.chatUser = this; //khai báo để sử dụng ở các component khác 
    },
    methods:{
        stringCut(index){ //hàm cắt chuỗi nếu dài quán 17 kí tự
          if(index.length > 17)
            return index.slice(0,17)+'...';
          else return index;
        },
        getDate(sec){ //hàm lấy thời gian bằng timestamp
         const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          var date = new Date(sec);
          var currdate = new Date();
          if(date.getDate() == currdate.getDate()) //nếu cùng một ngày thì hiển thị giờ phút
            return ' ' +date.getHours() + ':' + date.getMinutes();
          else                                    //khác ngày thì hiển thị ngày tháng
            return ' ' + monthNames[date.getMonth() +1] + ' ' + date.getDate();
        },
        openChat(){//hàm tạo user sau khi người dùng nhập email
            if(this.validateEmail(this.user.userName)){ //kiểm tra email có đúng định dạng hay k 
              this.user.userID = this.user.userName.slice(0,this.user.userName.indexOf('@')); //lấy chuỗi từ @ trở về trk để làm ID vì firebase không thể tạo ID có kí tự đặc biệt 
              sessionStorage.setItem('chatUser',JSON.stringify(this.user)); //lưu vào sessionStorage
              this.fectchInboxes(this.user.userID);//Load hộp thư cưa user
              this.fetchMessage();//load các tin nhắn
              this.show = true;
          }
          else{
            alert("email không đúng, vui lòng nhập lại!!");
          }
        },
        async checkLogin(){ //Hàm kiểm tra user có đang login hay k 
          try{
            const token = localStorage.getItem('isAuthen')
            if(!token) return;
            let respone = await UserService.getInfo(token);// lấy thông tin người dùng
            if(respone[0] != 'Bạn cần đăng nhập'){
              sessionStorage.removeItem('chatUser');
              this.isLogin = true;
              this.user.userID = respone[0].userID;        //thiết lập thông tin user
              this.user.userName = respone[0].userName;
              this.user.userPIc = respone[0].picture;
              this.show = true; 
              this.fectchInboxes(this.user.userID);        //load hộp thư
              this.fetchMessage();                          //Load tin nhắn
            }
            else{
              if(sessionStorage.getItem('chatUser')){       //kiểm tra trong sessionStorage có user đăng nhập thì lấy thông tin user ra
                this.user = JSON.parse(sessionStorage.getItem('chatUser'));
                this.fectchInboxes(this.user.userID);
                this.fetchMessage();
                this.show = true;
              }
              else
                this.show = false;
            }
          }
          catch{
          }
        },
        createInbox(id,name,picture,owner){//tạo một inbox mới 
          if(id && name && owner){
            this.storeClickedID = id;
            this.ownerID = owner;
            this.createInboxes(id,name,picture,owner);//hàm tạo inbox 
            this.fetchMessage();
          }
        },
        createInboxes(storeId,storeName,storePicture,storeOwner){
          try{
          if(storeId && storeName && storeOwner && this.user.userID){
            this.storeClickedID = storeId;
            this.roomID = this.storeClickedID + this.user.userID;//tạo id phòng chat bằng cách ghép hai ID của quán và người dùng lại
            firebase
              .database()
              .ref("Messages/inboxes/users/").child(this.user.userID).orderByChild('roomID').equalTo(this.roomID).on("value",snapshot => {
                if (snapshot.exists()){ //nếu inbox đã tồn tại thì thông báo đã tồn tại và thoát
                  const userData = snapshot.val();
                  console.log("exists!", userData);
                  return;
                }
                else{
                  var today = new Date(); 
                  const inboxRecipent = {       //tạo inbox của người nhận (quán)
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
                  const inboxSender = {    //Tạo inbox của ng gửi ƠUser)
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
                  if(this.ownerID == 'none'){        //Nếu có ID chủ quán là store
                    firebase                        //THêm vào firebase hòm thư của quán nhận
                    .database()
                    .ref("Messages/inboxes/users/" + this.storeClickedID).child(this.user.userID)
                    .set(inboxRecipent); 
                  } 
                  else{                               //Không có chủ quán thì là user
                    firebase                          //THêm vào firebase hòm thư của user nhận
                    .database()
                    .ref("Messages/inboxes/stores/" + storeOwner).child(storeId).child(this.user.userID)
                    .set(inboxRecipent);
                  }
                  firebase                            //THêm vào firebase hòm thư của user gửi
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
        saveMessage(){ //lưu tin nhắn
          try{
            if(this.message && this.roomID && this.storeClickedID && this.user.userID && this.ownerID){
              var today = new Date();
              const mess = {
                roomID: this.roomID,
                senderID: this.user.userID,
                msg: this.message,
                date: today.toString().slice(0,21)
              };
              firebase                            //lưu tin nhắn vào firebase
                .database()
                .ref("Messages/chatMessages/")
                .push(mess);
              if(this.ownerID == 'none')
              {
                firebase                          //update hòm thư của người/quán nhận
                .database()                         //seen == false là chưa xem tin nhắn, lastMsg là tin vừa nhắn 
                .ref("Messages/inboxes/users/" + this.storeClickedID).child(this.user.userID)
                .update({seen:'false',time:today.getTime(),lastMsg:this.message});
              }
              else{
                firebase                            //update hòm thư của người/quán nhận
                .database()
                .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.user.userID)
                .update({seen:'false',time:today.getTime(),lastMsg:this.message});
              }
              firebase
                .database()                         //update hòm thư của người/quán gửi
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
        fetchMessage(){                         //lấy danh sách tin nhắn theo roomID
          try{
            if(this.roomID && this.user.userID && this.storeClickedID){
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
                  {       //nếu đang nhắn với quán thi update hòm thư của mình là đã xem seen = true
                    firebase
                    .database()
                    .ref("Messages/inboxes/users/"+ this.user.userID).child(this.storeClickedID)
                    .update({seen: 'true'});
                  }
                  if(this.roomID == messages[0].roomID){ //chỉ fetch tin nhắn của phòng hiện tại
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
        fectchInboxes(id){                            //Load hòm thư của người dùng
          try{
              firebase.database().ref("Messages/inboxes/users/"+ id).on("value", snapshot => {
              if(snapshot.exists())
              {
                let data = snapshot.val();
                let inboxes = [];
                Object.keys(data).forEach(key => {
                if(data[key].seen == 'false')
                {
                  this.$notify({
                    title:'Có tin nhắn chưa xem từ '+ data[key].senderName,
                    text: data[key].lastMsg,
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
                if(this.storeClickedID == ''){ //nếu là lần đầu mở thì mở tin nhắn của quán đầu tiên
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
        storeClicked(idRoom,idStore,idOwner,seen,senderPic){// thay đổi dữ liệu Khi nhấn vào một quán trong inbox
          this.messages = [];
          this.senderPic = senderPic;
          this.roomID = idRoom;
          this.storeClickedID = idStore;
          this.ownerID = idOwner;
          if(seen == 'false' && this.user.userID) //nếu quán này chưa xem tin nhắn thì update lại thành đã xem 
            {
              firebase
              .database()
              .ref("Messages/inboxes/users/"+ this.user.userID).child(idStore)
              .update({seen: 'true'});
            }
          this.fetchMessage(idRoom); //load tin nhắn
        },
        exitChat(){ //đăng xuất khỏi phòng chat
          if(confirm('Bạn muốn đăng xuất phòng Chat?')){  //reset lại các biến
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
        validateEmail(mail) //hàm kiểm tra email có đúng định dạng k
        {
          if(mail == '') return false;
          var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (mail.match(validRegex)) {
              return true;
            } else {
              return false;
          }
        },
        onInit(){ //Hàm khởi tạo
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
  width: 82%;
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