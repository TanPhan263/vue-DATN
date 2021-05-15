<template>
  <div class="container">

  <div class="messaging">
      <div class="inbox_msg">
            <h4 class="recent_heading">Chat box</h4>
        <div class="inbox_people">
          <div class="inbox_chat">
            <div  v-for="cuss,index in customers" v-bind:key="index" class="chat_list active_chat">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{cuss}} <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <!-- <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div>
            <div class="chat_list">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
                  <p>Test, which is a new approach to have all solutions 
                    astrology under one roof.</p>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div class="mesgs">
            <!-- <div class="headind_srch" style="background: white;">
            <div class="recent_heading">
              <h4 v-if="messages.length > 0" style="margin-bottom: 5px;">{{messages[0].author}}</h4>
            </div>
            </div> -->
          <div class="msg_history">
            <div v-for="(mess,index) in messages" v-bind:key="index" :class="[mess.author === authUser.displayName? 'outgoing_msg':'incoming_msg']">
              <div v-if="mess.author !== authUser.displayName" class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div v-if="mess.author !== authUser.displayName" class="received_msg">
                <div class="received_withd_msg">
                  <p>{{ mess.message }}</p>
                  <span class="time_date"> {{ toDateTime(mess.date) }}</span></div>
              </div>
              <div v-else :class="[mess.author === authUser.displayName? 'sent_msg':'received_withd_msg']">
                  <p>{{ mess.message }}</p>
                  <span class="time_date"> {{ toDateTime(mess.date.seconds) }}</span></div>
          </div>
            <!-- <div class="outgoing_msg">
              <div class="sent_msg">
                <p>Test which is a new approach to have all
                  solutions</p>
                <span class="time_date"> 11:01 AM    |    June 9</span> </div>
            </div>
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>Test, which is a new approach to have</p>
                  <span class="time_date"> 11:01 AM    |    Yesterday</span></div>
              </div>
            </div>
            <div class="outgoing_msg">
              <div class="sent_msg">
                <p>Apollo University, Delhi, India Test</p>
                <span class="time_date"> 11:01 AM    |    Today</span> </div>
            </div>
            <div class="incoming_msg">
              <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
              <div class="received_msg">
                <div class="received_withd_msg">
                  <p>We work directly with our designers and suppliers,
                    and sell direct to you, which means quality, exclusive
                    products, at a price anyone can afford.</p>
                  <span class="time_date"> 11:01 AM    |    Today</span></div>
              </div>
            </div> -->
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input @keyup.enter="saveMessage" v-model="message" type="text" class="write_msg" placeholder="Type a message" />
              <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
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
            message: null,
            authUser: null,
            messages: [],
            storeId: 1234,
            customers: [],
        }
    },
    methods:{
        toDateTime(secs) {
            var t = new Date(Date.UTC(1970, 0, 1)); // Epoch
            t.setUTCSeconds(secs);
            return t.toString().slice(0,21);
        },
        saveMessage(){
            db.collection("chat").doc(""+ this.storeID).collection(""+ this.userInfor.phone).add({
            message: this.message,
            author: this.userInfor.name,
            image: this.userInfor.picture,
            date: new Date(),
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            //save user
            db.collection("chat").doc(""+ this.storeID).collection(""+ this.userInfor.phone).add({
            message: this.message,
            author: this.userInfor.name,
            image: this.userInfor.picture,
            date: new Date(),
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            this.message=null;
            // this.fetchMessage();
            // firebase.database().ref('chat/' + this.storeId).set({
            // message: this.message,
            // author: this.authUser.displayName,
            // date: new Date(),
            // }, (error) => {
            //     if (error) {
            //         console.error("Error adding document: ", error);
            //     } else {
            //         console.log("Document written successfully ");
            //     }
            // });
        },
        fetchMessage(){
            db.collection("chat").doc(""+ this.storeID).collection(""+ this.userInfor.phone).orderBy('date').onSnapshot((querySnapshot) => {
                let allMess = [];
                querySnapshot.forEach((doc) => {
                    allMess.push(doc.data());
                });
                console.log(allMess);
                this.messages=allMess;
            });
            db.collection("chat").get().then((querySnapshot) => {
                let allCuss = [];
                querySnapshot.forEach((doc) => {
                    allCuss.push(doc.data());
                });
                console.log(allCuss);
                this.customers=allCuss;
            });
        },
        
        saveUser(){
          db.collection("user").doc("123").collection("Cus1").add({
            message: this.message,
            author: this.authUser.displayName,
            date: new Date(),
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }

    },
    props:{
		  storeID: String,
      userInfor: {
        phone: String,
        name: String,
        picture: String,
        email: String
      },
	  },
    created(){
          firebase.auth().onAuthStateChanged(user => {
                console.log(user);
                        if(user)
                        {
                            this.authUser= user;
                        }
                        else{
                            this.authUser={};
                        }
                    })
        this.fetchMessage();
    },
    beforeRouteEnter (to, from, next) {
        next( vm =>{
            firebase.auth().onAuthStateChanged(user => {
                console.log(user);
                        if(user)
                        {
                            next();
                        }
                        else{
                            this.$router.push('/login');
                        }
                    })
        })
    }
}
</script>

<style>
.container{max-width:550px ; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%; border-right:1px solid #c4c4c4;
  border-top:1px solid  #f76242;
  border-radius: 15px 0 0 0;
}
.inbox_msg {
  border: 2px solid #f76242;
  border-radius: 15px;
  clear: both;
  overflow: hidden;
  background: #f76242;
}
.top_spac{ margin: 20px 0 0;}


.recent_heading {float: left; width:100%; color: white;; background:  #f76242;  padding: 5px; }
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; border-bottom:1px solid #c4c4c4;}

.recent_heading h4 {
  color: #388285;
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
  border-bottom: 1px solid #f76242;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat { height: 400px; overflow-y: scroll; }

.active_chat{ background:#ebebeb;}

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
  border-radius: 10px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
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
  padding-top: 10px;
  width: 60%;
  background: white;
  border-top: 1px solid #f76242; border-radius: 0 15px 0 0;
}

 .sent_msg p {
  background: #f76242 none repeat scroll 0 0;
  border-radius: 10px;
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

.type_msg { background: white;border-top: 1px solid #c4c4c4;position: relative;}
.msg_send_btn {
  background: white none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #f76242;
  cursor: pointer;
  font-size: 25px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 5px;
  right: 10px;
  width: 33px;
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
</style>