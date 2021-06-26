importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

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
