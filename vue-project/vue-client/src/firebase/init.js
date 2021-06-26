import firebase from 'firebase'

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
    return messaging.getToken();
  }).then(function(token){
    console.log(token);
  })
  .catch(function(err){
    console.log('Err: ' + err)
  })

// //firebase notification
// var messaging = firebase.messaging();
// messaging.requestPermission().then(function() {
//   console.log('Have permission');
//   return messaging.getToken({vapidKey: 'BEupx02HLRNfvTuJmMrksken3ZOqWA-Adz6tig2KaPP_EtuCvcYOcJVERk3KoTVeRreVI65HCUQhCge70HyJTsE'});
// }).then(function(token){
//   console.log(token);
// })
// .catch(function(err){
//   console.log(err);
// })

messaging.onMessage(function(payload){
console.log('onMessage: ', payload);
})