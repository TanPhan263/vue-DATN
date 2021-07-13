import axios from 'axios';
const url = 'https://api.viefood.info/api/User/';
const url2 = 'https://api.viefood.info/api/UserType/';
export default{
    getInfo(token){
        try{
        return axios.get(url+ 'GetByID',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
        }
        catch{}
    },
    updateInfo(credentials,token) {
        return axios
          .post(url + 'EditByID',{ headers: {"Authorization" : `Bearer ${token}`}}, credentials)
          .then(response => response.data);
    },
    getUserbyID(id,token){
        return axios.get(url+ 'GetByID?id='+id,{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
    },
    getAll(token){
       return axios.get(url+ 'GetAll',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
    },
    getUserType(token){
        return axios.get(url2+ 'GetAll',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
    },
    getUserbyIDnoToken(id){
        return axios.get(url+ 'GetByIDNotToken?id='+id).then(respone => respone.data[0].userName);
    },
    getUserbyIDnoToken_pic(id){
        return axios.get(url+ 'GetByIDNotToken?id='+id).then(respone => respone.data[0]);
    },
    delete( id, token){
        return axios
          .post(url + 'DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
          .then(response => response.data);
    },
    block(token, id, status){
        return axios
        .post(url + 'BlockAccount?id='+ id+ '&status='+status,[],{ headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.data);
    },
    getOnlineUser(){
        return axios.get(url+ 'ThongKeNguoiOnline').then(respone => respone.data);
    },
    logOut(id){
        return axios.post(url +'/Logout?id='+ id).then(response => response.data);
    }
};