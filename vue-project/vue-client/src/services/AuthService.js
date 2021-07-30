import axios from 'axios';
import firebase from 'firebase';
import router from '../router/index';
import UserService from '../services/UserService';
const url = 'https://api.viefood.info/api/User/';
export default {
  parseJwt (isAuthen) {//hàm decode token
    var base64Url = isAuthen.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  },
  getRole(credentials) {//hàm lấy id quyền của user đầu vào là token
    return axios
      .get(url + 'GetRole',{ headers: {"Authorization" : `Bearer ${credentials}`}})
      .then(response => response.data);
  },
  isAuthented(token){//hàm kiểm tra thời gian hết hạn của token
    var expireTime = this.parseJwt(token);//decode token
    console.log(expireTime.exp);
    var timeStamp = Math.floor(Date.now() / 1000); //lấy timestamp hiện tại
    console.log(timeStamp);
    var timeCheck =  expireTime.exp - timeStamp;
    console.log(timeCheck)
    if(timeCheck > 0) //kiểm tra nếu expireTime > timeStamp thì token còn hiệu lực
      return true;
    return false
  },
  async logout(){//hàm đăng xuất
    try{
      if(localStorage.getItem('userInfor')){
        let user = localStorage.getItem('userInfor');
        user = JSON.parse(user);
        await UserService.logOut(user.userID);//gọi api đăng xuất người dùng từ máy chủ
      }
      localStorage.removeItem("userInfor");//remove thông tin người dùng trong localHost
      localStorage.removeItem("isAuthen");//remove token
      router.go();//reload trang
    }
    catch{}
  },
  login(credentials) {//hàm đăng nhập
    return axios      //gọi api đăng nhập
      .post(url + 'Login', credentials)
      .then(async function(response){
        if(response.data == 'Đăng nhập thất bại') 
          {
            return response.data;
          }
        const response2 = await UserService.getInfo(response.data.token);     //lấy thông tin người dùng
        localStorage.setItem('isAuthen',response.data.token);                 //lưu token vào localStorage
        localStorage.setItem('userInfor',JSON.stringify(response2[0]));       //lưu thông tin người dùng vào localStorage
        switch(response2[0].userTypeID){                                      //kiểm tra loại người dùng
          case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;//admin thì chạy đến trang dashboard của admin
          case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break; //storeowner thì đi đến trang dashboard của chủ quán
          case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;                //user thì đến trang chủ
          default: router.push('/'); break;                                                           
        }
        }
      );
  },
  signUp(credentials) { //hàm đăng kí truyền vào đối tượng user 
    return axios
      .post(url + 'RegisterUser', credentials)
      .then(response => response.data);
  },
  getSecretContent() {
    return axios.get(url + 'secret-route/').then(response => response.data);
  },
  //đăng kí chủ quán truyền vào đối tượng user
  registerOwner(credentials){
    return axios
      .post('https://api.viefood.info/api/User/RegisterOwner', credentials)
      .then(response => response.data);
  },
  loginGoogle(){  //hàm đăng nhập bằng Google
    // Using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();//tạo một đối tượng google auth provider 
      provider.addScope('profile');                         //thêm mục thông tin cho provider
      provider.addScope('email');                           //thêm mục thông tin cho provider
      firebase.auth().signInWithPopup(provider).then(function(result){//hàm đăng nhập do firebase cung cấp
      const user = result.user;
      var ref = firebase.database().ref("User");
      //kiểm tra trong CSDL đã tồn tại user có idGoogle này chưa
      ref.orderByChild("idGoogle").equalTo(user.providerData[0].uid).once("value", snapshot => {
        if(snapshot.exists()) {//nếu có thì tiến hành đăng nhập bằng idGoogle và email
          axios.post(url + "LoginGoogle?idGoogle=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
          .then( async function(result){
            console.log('login success')
            console.log(result.data.token);                   
            const user_result = await UserService.getInfo(result.data.token); //lấy thông tin người dùng
            console.log(user_result);                             
            localStorage.setItem('isAuthen',result.data.token);               //lưu token vào localStorage
            localStorage.setItem('userInfor',JSON.stringify(user_result[0])); //lưu thông tin người dùng vào localStorage
            switch(user_result[0].userTypeID){                                //kiểm tra loại người dùng
              case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;//admin thì chạy đến trang dashboard của admin
              case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break; //storeOwner thì chạy đến trang dashboard của chủ quán
              case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;                //user thì đến trang chủ 
              default: router.push('/'); break;                                                           
            }
          });
        }
        else {//nếu không có thì tiến hành đăng kí và đăng nhập
             const signup_credentials = {//tạo đối tượng user với thông tin mà google cung cấp
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
              //đăng kí user
              axios.post("https://api.viefood.info/api/User/RegisterUser", signup_credentials).then(respone =>{
                //đăng nhập bằng idGoogle và email
                axios.post(url + "LoginGoogle?idGoogle=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
                .then( async function(result){
                  console.log('login2 success')
                  console.log(result.data.token);
                  const user_result = await UserService.getInfo(result.data.token); //lấy thông tin người dùng
                  console.log(user_result);
                  localStorage.setItem('isAuthen',result.data.token);               //lưu token vào localStorage
                  localStorage.setItem('userInfor',JSON.stringify(user_result[0])); //lưu thông tin người dùng vào localStorage
                  switch(user_result[0].userTypeID){                                //kiểm tra loại người dùng
                    case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break; //admin thì chạy đến trang dashboard của admin
                    case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break;  //storeOwner thì chạy đến trang dashboard của chủ quán
                    case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;                 //user thì đến trang chủ 
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
    var provider = new firebase.auth.FacebookAuthProvider(); //tạo một đối tượng google auth provider 
    provider.addScope('user_birthday');                      //thêm phạm vi thông tin ngày sinh
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token.
      var token = result.credential.accessToken;
      localStorage.setItem('isAuthen',token.token);
      // The signed-in user info.
      var user = result.user;
      var ref = firebase.database().ref("User");
       //kiểm tra trong CSDL đã tồn tại user có idFacebook này chưa
      ref.orderByChild("idFacebook").equalTo(user.providerData[0].uid).once("value", snapshot => {
        if(snapshot.exists()) {//nếu có thì tiến hành đăng nhập bằng idFacebook và email
          axios.post(url + "LoginFacebook?idFacebook=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email)
          .then( async function(result){
            console.log('login success')
            console.log(result.data.token);
            const user_result = await UserService.getInfo(result.data.token); //lấy thông tin người dùng
            console.log(user_result);
            localStorage.setItem('isAuthen',result.data.token);                //lưu token vào localStorage
            localStorage.setItem('userInfor',JSON.stringify(user_result[0]));  //lưu thông tin người dùng vào localStorage
            switch(user_result[0].userTypeID){                                 //kiểm tra loại người dùng
              case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;//admin thì chạy đến trang dashboard của admin
              case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break; //storeOwner thì chạy đến trang dashboard của chủ quán
              case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;                //user thì đến trang chủ 
              default: router.push('/'); break;                                                           
            }
          });
        }
        else {//nếu không có thì tiến hành đăng kí và đăng nhập
             const signup_credentials = { //tạo đối tượng user với thông tin mà google cung cấp
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
              //đăng kí user
              axios.post("https://api.viefood.info/api/User/RegisterUser", signup_credentials).then(respone =>{
                axios.post(url + "LoginFacebook?idFacebook=" + user.providerData[0].uid+ "&email="+ user.providerData[0].email) //đăng nhập bằng idFacebook và email
                .then( async function(result){
                  console.log('login success')
                  console.log(result.data.token);
                  const user_result = await UserService.getInfo(result.data.token); //lấy thông tin người dùng
                  console.log(user_result);
                  localStorage.setItem('isAuthen',result.data.token);               //lưu token vào localStorage
                  localStorage.setItem('userInfor',JSON.stringify(user_result[0])); //lưu thông tin người dùng vào localStorage
                  switch(user_result[0].userTypeID){                                //kiểm tra loại người dùng
                    case '-MO5VBnzdGsuypsTzHaV':router.push('/manage/dashboard'); break;//admin thì chạy đến trang dashboard của admin
                    case '-MO5VWchsca2XwktyNAw':router.push('/manage/overview'); break; //storeOwner thì chạy đến trang dashboard của chủ quán
                    case '-MO5VYNnWIjXtvJO4AXi':router.push('/'); break;                //user thì đến trang chủ 
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
  checkUser(token){ //gọi api lấy thông tin user để kiểm tra token hết hạn chưa
    try{
      return axios.get(url+ 'GetByID',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => 
        {
          let user = respone.data
          if( user[0] == 'Bạn cần đăng nhập')//token hết hạn
          {
            this.logout();//logout
          }
        });
      }
    catch{
      this.logout();
    }
  },
  checkAdmin(){ //kiểm tra có phải là admin hay không 
    try{
      if(!localStorage.getItem('isAuthen')) return router.push('/login');
      return axios //gọi api lấy quyền, truyền vào token
      .get(url + 'GetRole',{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}})
      .then(response => {
        if(response.data != '-MO5VBnzdGsuypsTzHaV')//nếu không phải admin
        {
          Vue.notify({
            title: 'Thông báo',
            text: 'Bạn không có quyền!!!',
          });
          router.push('/pages/404')
        }
      });
    }
    catch{  //nếu token hết hạn
      Vue.notify({
        title: 'Thông báo',
        text: 'Phiên đăng nhập đã hết, Vui lòng đăng nhập lại',
      });
      this.logout();
    }
  },
  checkStoreOwner(){ //kiểm tra có phải là chủ quán hay không 
    try{
    if(!localStorage.getItem('isAuthen')) return router.push('/login');
    return axios //gọi api lấy quyền, truyền vào token
      .get(url + 'GetRole',{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}})
      .then(response => {
        if(response.data != '-MO5VWchsca2XwktyNAw') //nếu không phải chủ quán
        {
          Vue.notify({
            title: 'Thông báo',
            text: 'Bạn không có quyền!!!',
          });
          router.push('/pages/404')
        }
      });
    }
    catch{ //nếu token hết hạn
      Vue.notify({
        title: 'Thông báo',
        text: 'Phiên đăng nhập đã hết, Vui lòng đăng nhập lại',
      });
      this.logout();
    }
  },
};