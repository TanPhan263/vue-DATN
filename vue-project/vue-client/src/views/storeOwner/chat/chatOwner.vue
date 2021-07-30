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
        ownerID:'',                             //id chủ quán
        keyword:'',                             //từ khóa dùng để tìm inbox
        keywordStore:'',                        //từ khóa dùng để tìm quán
        message: null,                          //tin nhắn
        messages: [],                           //danh sách tin nhắn
        result: [],                             //danh sách inbox sau khi lọc bằng từ khóa
        store:[],                               //danh sách quán
        resultStore: [],                        //danh sách quán sau khi lọc bằng từ khóa
        inboxes: [],                            //danh sách inbox của 1 quán
        inboxID:'',                             //id của inbox
        inboxName:'',                           //tên của inbox
        storeClickedID:'',                      //quán đang chọn
        roomID:''                               //id của phòng chat
      }
    },
    methods:{
      //hàm cắt chuỗi khi quá dài
      stringcut(index){
        if(index.length > 20)
          return index.slice(0,12);
        return index;
      },
      getDate(sec){                             //hàm lấy thời gian bằng timestamp
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          var date = new Date(sec);
          var currdate = new Date();
          if(date.getDate() == currdate.getDate())
            return date.getHours() + ':' + date.getMinutes();                   //nếu cùng một ngày thì hiển thị giờ phút
          else 
            return ' ' + monthNames[date.getMonth() +1] + ' ' + date.getDate(); //khác ngày thì hiển thị ngày tháng
        },
      saveMessage(){                                                             //lưu tin nhắn
        try{
          if(this.message && this.roomID && this.inboxID && this.storeClickedID && this.ownerID){
            var today = new Date();
            const mess = {
              roomID: this.roomID,
              senderID: this.storeClickedID,
              msg: this.message,
              date: today.toString().slice(3,21)
            };
            firebase                                                            //lưu tin nhắn vào firebase
              .database()
              .ref("Messages/chatMessages/")
              .push(mess);
            firebase                                                             //update hòm thư của người gửi(quán)
              .database()                                                        //seen == false là chưa xem tin nhắn, lastMsg là tin vừa nhắn 
              .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.inboxID)
              .update({seen:'true',time:today.getTime(),lastMsg:this.message});
            firebase
              .database()                                                         //update hòm thư của người nhận
              .ref("Messages/inboxes/users/"+ this.inboxID).child(this.storeClickedID)
              .update({seen:'false',time:today.getTime(),lastMsg:this.message});
            this.message = '';                                                    //set tin nhắn lại thành rỗng
          }
          else alert('Errr')
        }
        catch(err){
          console.log(err);
        }
      },
      fetchMessage(){                                                            //lấy danh sách tin nhắn theo roomID
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
                if(messages[messages.length -1].senderID == this.inboxID)  //nếu đang nhắn với thi update hòm thư của mình là đã xem seen = true
                  { 
                    firebase
                    .database()
                    .ref("Messages/inboxes/stores/"+ this.ownerID).child(this.storeClickedID).child(this.inboxID)
                    .update({seen: 'true'});
                  }
                if(this.roomID == messages[0].roomID)                     //chỉ fetch tin nhắn của phòng hiện tại
                  this.messages = messages;
              }
          }); 
          }
        }
        catch(err){
          console.log(err);
        }
      },
      fectchInboxes(id){                                                //Load hòm thư của quán
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
                if(inboxes[0].recipentID == this.storeClickedID){                 //chỉ tải inbox của quán đang xem
                  this.inboxes = inboxes;
                  this.result= this.inboxes;
                }
                if(this.inboxID == ''){                                           //nếu là lần đầu mở thì mở tin nhắn của quán/người đầu tiên
                  this.inboxID = inboxes[0].senderID;
                  this.roomID = inboxes[0].roomID;
                  this.fetchMessage();                                              //load tin nhắn
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
      async fetchStore(){                                   //tải danh sách các quán có người nhắn tin
        try{
          var user = localStorage.getItem("userInfor");
          user = JSON.parse(user);
          this.ownerID = user.userID;
          this.store = await StoreService.getByUser(this.ownerID,localStorage.getItem('isAuthen'));//lấy danh sách quán mà người dùng làm chủ
          firebase.database().ref("Messages/inboxes/stores/"+ this.ownerID).on("value", snapshot => {//tải danh sách quán có người nhắn tin trên firebase
            if(snapshot.exists())
            {
              let data = snapshot.val();
              Object.keys(data).forEach(key => {
              this.store.forEach(el =>{
                if(el.storeID == key && !this.resultStore.includes(el))                              //nếu quán có người nhắn tin và resultStore chưa cho quán này thì thêm vào
                  this.resultStore.push(el);
                })
              });
            }
          }); 
          //this.resultStore= this.store;
          this.storeClickedID = this.resultStore[0].storeID;                                       
          this.fectchInboxes(this.storeClickedID);                                                    //tải inbox của quán đầu tiên
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
    onChangeStore(key){                                                                                //hàm tim kiếm inbox theo tên
      if(key == '' || key == null)
        return this.resultStore=this.store;                                                            //nếu từ khóa rỗng thì không tìm trả về danh sách ban đầu
      else {
        this.resultStore = this.store.filter(function(item){                                           //lọc những quán có tên chứa từ khóa
          return item.storeName.toLowerCase().includes(key.toLowerCase());
        })
      }
    },
    storeClicked(id){                                                                                  //hàm chọn quán để xem tin nhắn
      this.inboxID = '';                                                                                //reset các giá trị hiện tại
      this.inboxes = [];
      this.result =[];
      this.messages = [];
      this.storeClickedID = id;                                                                         //gán id quán vùa  chọn
      this.roomID= '';
      this.fectchInboxes(id);                                                                           //tải inbox của quán
    },
    inboxClicked(inbox){                                                                                //hàm chọn inbox để xem tin nhắn
      if(inbox){
        this.messages = [];
        this.inboxID = inbox.id;                                                                        //gán id của inbox vừa chọn
        if(inbox.seen == 'false')                                                                       //nếu inbox này chưa xem tin nhắn thì set lại thành đã xem
        {
          firebase
          .database()
          .ref("Messages/inboxes/stores/"+ this.ownerID).child(inbox.recipentID).child(inbox.id)
          .update({seen: 'true'});
        }
        this.roomID = inbox.roomID;                                                                     //gán id room của inbox vừa chọn
        this.fetchMessage();                                                                            //tải tin nhắn
      }
    },
    // getUserName(id){                                                      
    //   if(this.inboxes)
    //   {
    //     let temp = ''
    //     this.inboxes.forEach(element => {
    //       if(element.senderID == id)
    //         temp = element.senderName;
    //     });
    //     return temp;
    //   }
    // },
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