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
import * as VueGoogleMaps from "vue2-google-maps"
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { BFormRating } from 'bootstrap-vue'
import CommentGrid from 'vue-comment-grid'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueLazyload from 'vue-lazyload'
import VueChatScroll from 'vue-chat-scroll'
import Notifications from 'vue-notification'

sessionStorage.setItem('notified',JSON.stringify([]));
Vue.use(VueChatScroll);
Vue.use(Notifications);
// lazyload image with options
const loadimage = require('./assets/imgs/loading.gif')
const errorimage = require('./assets/imgs/error.png')
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage ,
  loading:  loadimage,
  attempt: 3,
  listenEvents: [ 'scroll' ]
})

//infinite-scroll
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

//pagination
import JwPagination from 'jw-vue-pagination';
Vue.component('jw-pagination', JwPagination);

//GoogleMap AIzaSyA4iGS3l6NH4Vreg4LJJX7gizkedG-9SvA
//	 AIzaSyAcDDET59ANwEhTdub24KMtGk5C2-CNnDE
//  AIzaSyDyqOswaIsfJyFeW4LscRzJqeC6r57buLI
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDyqOswaIsfJyFeW4LscRzJqeC6r57buLI",
    libraries: "places"
  }
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
