import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import axios from 'axios'
import babelPolyfill from 'babel-polyfill'
import * as VueGoogleMaps from "vue2-google-maps";
import { BFormRating } from 'bootstrap-vue'
import CommentGrid from 'vue-comment-grid'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import firebase from 'firebase'
import VueLazyload from 'vue-lazyload'
 
// lazyload image with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'assets/imgs/error.png',
  loading: 'assets/imgs/loading.gif',
  attempt: 3,
  listenEvents: [ 'scroll' ]
})

//infinite-scroll
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

//pagination
import JwPagination from 'jw-vue-pagination';
Vue.component('jw-pagination', JwPagination);

require('firebase/firestore');
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

//GoogleMap
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBIgjnRElmcegKsm6RIORR6_jJRhq7nSSA",
    libraries: "places"
  }
});

//firebase notification
var messaging = firebase.messaging();
messaging.requestPermission().then(function() {
  console.log('Have permission');
  return messaging.getToken({vapidKey: 'BEupx02HLRNfvTuJmMrksken3ZOqWA-Adz6tig2KaPP_EtuCvcYOcJVERk3KoTVeRreVI65HCUQhCge70HyJTsE'});
}).then(function(token){
  console.log(token);
})
.catch(function(err){
  console.log(err);
})
messaging.onMessage(function(payload){
console.log('onMessage: ', payload);
})
//add firestore
var db = firebase.firestore();
window.db = db;

db.settings({
  timestampsInSnapshots: true
});
//add awesome icon
library.add(faUserSecret)

Vue.use(CommentGrid)

Vue.component('b-form-rating', BFormRating);

Vue.use(babelPolyfill)
axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;
Vue.prototype.$http = axios
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)
Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.config.performance = true

new Vue({
  el: '#app',
  router,
  store,
  icons,
  axios,
  template: '<App/>',
  directives: {infiniteScroll},
  components: {
    App
  }
})
