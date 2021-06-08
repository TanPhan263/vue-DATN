import firebase from "firebase";
import "firebase/firestore";

var fireBase = {
    apiKey: "AIzaSyAkgIkoLXKvI5h_5EyeT2IWabsVMkHsvok",
    authDomain: "vue-database-7b0b9.firebaseapp.com",
    databaseURL: "https://vue-database-7b0b9.firebaseio.com",
    projectId: "vue-database-7b0b9",
    storageBucket: "vue-database-7b0b9.appspot.com",
    messagingSenderId: "30899051349",
    appId: "1:30899051349:web:4e77980d78d2398d24addc"
  };
  // Initialize Firebase
var fire =  firebase.initializeApp(fireBase);
export default fire;