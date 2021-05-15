
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

firebase.initializeApp({
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

messaging.setBackgroundMessageHandler(function(payload){
  const title = "Hello";
  const options = {
    body: payload.data.status
  }
  return self.registration.showNotification(title, options);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }