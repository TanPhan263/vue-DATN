import axios from 'axios';
import firebase from 'firebase';
import router from '../router/index';
import UserService from '../services/UserService';
const url = 'https://api.viefood.info/api/User/';
export default {
  parseJwt (isAuthen) {
    var base64Url = isAuthen.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  },
  getRole(credentials) {
    return axios
      .get(url + 'GetRole',{ headers: {"Authorization" : `Bearer ${credentials}`}})
      .then(response => response.data);
  },
  isAuthented(token){
    var expireTime = this.parseJwt(token);
    console.log(expireTime.exp);
    var timeStamp = Math.floor(Date.now() / 1000);
    console.log(timeStamp);
    var timeCheck =  expireTime.exp - timeStamp;
    console.log(timeCheck)
    if(timeCheck > 0)
      return true;
    return false
  },

  logout(){
    localStorage.removeItem("userInfor");
    localStorage.removeItem("isAuthen");
    router.go();
  },
  login(credentials) {
    return axios
      .post(url + 'Login', credentials)
      .then(async function(response){
        if(response.data == 'Đăng nhập thất bại') 
          {
            return response.data;
          }
        const response2 = await UserService.getInfo(response.data.token);
        localStorage.setItem('isAuthen',response.data.token);
        localStorage.setItem('userInfor',JSON.stringify(response2[0]));
        switch(response2[0].userTypeID){
          case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;
          case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break;
          case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;  
          default: router.push('/'); break;                                                           
        }
        }
      );
  },
  signUp(credentials) {
    return axios
      .post(url + 'RegisterUser', credentials)
      .then(response => response.data);
  },
  
  getSecretContent() {
    return axios.get(url + 'secret-route/').then(response => response.data);
  },
  registerOwner(credentials){
    return axios
      .post('https://api.viefood.info/api/User/RegisterOwner', credentials)
      .then(response => response.data);
  },
  loginGoogle(){
    // Using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      firebase.auth().signInWithPopup(provider).then(function(result){
      const user = result.user;
      var ref = firebase.database().ref("User");
      ref.orderByChild("idGoogle").equalTo(user.providerData[0].uid).once("value", snapshot => {
        if(snapshot.exists()) {
          axios.post(url + "LoginGoogle?idGoogle=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
          .then( async function(result){
            console.log('login success')
            console.log(result.data.token);
            const user_result = await UserService.getInfo(result.data.token);
            console.log(user_result);
            localStorage.setItem('isAuthen',result.data.token);
            localStorage.setItem('userInfor',JSON.stringify(user_result[0]));
            switch(user_result[0].userTypeID){
              case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;
              case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break;
              case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;  
              default: router.push('/'); break;                                                           
            }
          });
        }
        else {
             const signup_credentials = {
                userName: user.providerData[0].displayName,
                phone: '',
                address: '',
                password: '',
                email: user.providerData[0].email,
                picture: user.providerData[0].photoURL,
                sex: '',
                birthday: '',
                userTypeID: '-MO5VYNnWIjXtvJO4AXi',
                status:'1',
                idGoogle: user.providerData[0].uid
                };
              // signUp(signup_credentials);
              axios.post("https://api.viefood.info/api/User/RegisterUser", signup_credentials).then(respone =>{
                axios.post(url + "LoginGoogle?idGoogle=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
                .then( async function(result){
                  console.log('login2 success')
                  console.log(result.data.token);
                  const user_result = await UserService.getInfo(result.data.token);
                  console.log(user_result);
                  localStorage.setItem('isAuthen',result.data.token);
                  localStorage.setItem('userInfor',JSON.stringify(user_result[0]));
                  switch(user_result[0].userTypeID){
                    case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;
                    case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break;
                    case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;  
                    default: router.push('/'); break;                                                           
                  }
                });
            });
           
        }
      });
      }).catch((error) => {
        var errorCode = error.code;
        console.log(errorCode);
      });
  },
  loginFacebook(){
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token.
      var token = result.credential.accessToken;
      localStorage.setItem('isAuthen',token.token);
      // The signed-in user info.
      var user = result.user;
      var ref = firebase.database().ref("User");
      ref.orderByChild("idFacebook").equalTo(user.providerData[0].uid).once("value", snapshot => {
        if(snapshot.exists()) {
          axios.post(url + "LoginFacebook?idFacebook=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
          .then( async function(result){
            console.log('login success')
            console.log(result.data.token);
            const user_result = await UserService.getInfo(result.data.token);
            console.log(user_result);
            localStorage.setItem('isAuthen',result.data.token);
            localStorage.setItem('userInfor',JSON.stringify(user_result[0]));
            switch(user_result[0].userTypeID){
              case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;
              case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break;
              case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;  
              default: router.push('/'); break;                                                           
            }
          });
        }
        else {
             const signup_credentials = {
                userName: user.providerData[0].displayName,
                phone: '',
                address: '',
                password: '',
                email: user.providerData[0].email,
                picture: user.providerData[0].photoURL,
                sex: '',
                birthday: '',
                userTypeID: '-MO5VYNnWIjXtvJO4AXi',
                status:'1',
                idGoogle: user.providerData[0].uid
                };
              // signUp(signup_credentials);
              axios.post("https://api.viefood.info/api/User/RegisterUser", signup_credentials).then(respone =>{
                axios.post(url + "LoginFacebook?idFacebook=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
                .then( async function(result){
                  console.log('login success')
                  console.log(result.data.token);
                  const user_result = await UserService.getInfo(result.data.token);
                  console.log(user_result);
                  localStorage.setItem('isAuthen',result.data.token);
                  localStorage.setItem('userInfor',JSON.stringify(user_result[0]));
                  switch(user_result[0].userTypeID){
                    case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;
                    case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break;
                    case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;  
                    default: router.push('/'); break;                                                           
                  }
                });
              })
        }
      });
    }).catch((error) => {
        // Handle Errors here.
        console.log(error);
    });
  },
  checkUser(token){
    try{
      return axios.get(url+ 'GetByID',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => 
        {
          let user = respone.data
          if( user[0] == 'Bạn cần đăng nhập') 
            this.logout();
        });
      }
    catch{
      this.logout();
    }
  },
  checkAdmin(){
    try{
      if(!localStorage.getItem('isAuthen')) return;
      return axios
      .get(url + 'GetRole',{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}})
      .then(response => {
        if(response.data != '-MO5VBnzdGsuypsTzHaV')
        router.push('/pages/404')
      });
    }
    catch{
      router.push('/login')
    }
  },
  checkStoreOwner(){
    try{
    if(!localStorage.getItem('isAuthen')) return;
    return axios
      .get(url + 'GetRole',{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}})
      .then(response => {
        if(response.data != '-MO5VWchsca2XwktyNAw')
        router.push('/pages/404')
      });
    }
    catch{
      router.push('/login')
    }
  },
};