import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'

// Vue.use(VueResource);
Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyDSz_gly3z_Fn3at-hJQe5CkX-hT9Cxixc",
  authDomain: "availability-d1163.firebaseapp.com",
  databaseURL: "https://availability-d1163.firebaseio.com",
  projectId: "availability-d1163",
  storageBucket: "availability-d1163.appspot.com",
  messagingSenderId: "64486697956",
  appId: "1:64486697956:web:5d9659d1f97e186009f5f1",
  measurementId: "G-5GS5EX23BP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.database()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
