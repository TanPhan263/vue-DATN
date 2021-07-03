import firebase from 'firebase'
import Vue from 'vue'

export default firebase.initializeApp({
    apiKey: "AIzaSyDNRD7rcNybO5pVkC8POMiMhYYwmfreUVQ",
    authDomain: "tlcn-1a9cf.firebaseapp.com",
    databaseURL: "https://tlcn-1a9cf.firebaseio.com",
    projectId: "tlcn-1a9cf",
    storageBucket: "tlcn-1a9cf.appspot.com",
    messagingSenderId: "295500543953",
    appId: "1:295500543953:web:b85c401589d343127152f0",
    measurementId: "G-RC7XRDEM86"
  });

  const messaging = firebase.messaging();
  messaging.requestPermission().then(function(){
    console.log('Have permission!');
    return messaging.getToken({vapidKey: 'BEupx02HLRNfvTuJmMrksken3ZOqWA-Adz6tig2KaPP_EtuCvcYOcJVERk3KoTVeRreVI65HCUQhCge70HyJTsE'});
  }).then(function(token){
    console.log(token);
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