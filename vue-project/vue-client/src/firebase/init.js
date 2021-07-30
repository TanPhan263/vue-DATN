import firebase from 'firebase'
import Vue from 'vue'

export default firebase.initializeApp({//khởi tạo firebase 
    apiKey: "AIzaSyDNRD7rcNybO5pVkC8POMiMhYYwmfreUVQ",
    authDomain: "tlcn-1a9cf.firebaseapp.com",
    databaseURL: "https://tlcn-1a9cf.firebaseio.com",
    projectId: "tlcn-1a9cf",
    storageBucket: "tlcn-1a9cf.appspot.com",
    messagingSenderId: "295500543953",
    appId: "1:295500543953:web:b85c401589d343127152f0",
    measurementId: "G-RC7XRDEM86"
  });
  firebase.database().ref("Messages/inboxes/").on("value", snapshot => {
    if(snapshot.exists())
    {
      if(localStorage.getItem("userInfor")){
        var user = localStorage.getItem("userInfor");
        user = JSON.parse(user);
        if(user.userTypeID == '-MO5VWchsca2XwktyNAw'){
          let notified = sessionStorage.getItem('notified')
          notified = JSON.parse(notified);
          let data = snapshot.child('stores').child(user.userID).val();
          Object.keys(data).forEach(key => {
            let dataStore = data[key]
            Object.keys(dataStore).forEach(key => {
              if(dataStore[key].seen == 'false')
              {
                if(!notified.includes(key + dataStore[key].time)){
                  Vue.notify({
                    title: 'Bạn có tin nhắn mới từ ' + dataStore[key].senderName,
                    text: dataStore[key].lastMsg,
                  });
                  notified.push(key+dataStore[key].time);
                  sessionStorage.setItem('notified',JSON.stringify(notified));
                }
              }
            });
          });
        }
        // else if(user.userTypeID == '-MO5VBnzdGsuypsTzHaV')
        // {
        //   let notified = sessionStorage.getItem('notified')
        //   notified = JSON.parse(notified);
        //   let data = snapshot.child('users').child(user.userID).val();
        //   Object.keys(data).forEach(key => {
        //     if(data[key].seen == 'false')
        //     {
        //       if(!notified.includes(key + data[key].time)){
        //         Vue.notify({
        //           title: 'Bạn có tin nhắn mới từ ' + data[key].senderName,
        //           text: data[key].lastMsg,
        //         });
        //         notified.push(key+data[key].time);
        //         sessionStorage.setItem('notified',JSON.stringify(notified));
        //       }
        //     }
        //   });
        // }
      }
    }
  }); 
  // firebase.database().ref("Stores").on("value", snapshot => {
  //   if(snapshot.exists())
  //   {
  //       if(localStorage.getItem("userInfor")){
  //       var user = localStorage.getItem("userInfor");
  //       user = JSON.parse(user);
  //       if(user.userTypeID == '-MO5VBnzdGsuypsTzHaV'){
  //         let notified = sessionStorage.getItem('notified')
  //         notified = JSON.parse(notified);
  //         let data = snapshot.val();
  //         Object.keys(data).forEach(key => {
  //           if(data[key].Status == '-1')
  //           {
  //             if(!notified.includes(key)){
  //               Vue.notify({
  //                 title: 'Có quán mới đăng kí',
  //                 text: data[key].StoreName,
  //               });
  //               notified.push(key);
  //               sessionStorage.setItem('notified',JSON.stringify(notified));
  //             }
  //           }
  //         });
  //       }
  //     }
  //   }
  // });

  const messaging = firebase.messaging();
  messaging.requestPermission().then(function(){
    console.log('Have permission!');
    return messaging.getToken({vapidKey: 'BEupx02HLRNfvTuJmMrksken3ZOqWA-Adz6tig2KaPP_EtuCvcYOcJVERk3KoTVeRreVI65HCUQhCge70HyJTsE'});
  }).then(function(token){
  })
  .catch(function(err){
    console.log('Err: ' + err)
  });

messaging.onMessage(function(payload){
  console.log('onMessage: ', payload);
  const notificationOption ={
    body: payload.notification.body,
    icon: payload.notification.icon,
  }
  if(Notification.permission == "granted")
  {
    Vue.notify({
      title: payload.notification.title,
      text: payload.notification.body,
    });
    // notification.onclick = function(event) {
    //   event.preventDefault(); // prevent the browser from focusing the Notification's tab
    //   window.open('http://www.google.com', '_blank');
    // }
  }
})
messaging.onTokenRefresh(function(){
  messaging.getToken().then( function(newtoken){
    console.log('New token: '+newtoken);
  }).catch(function(err){
    console.log('Err: ' +err);
  })
});