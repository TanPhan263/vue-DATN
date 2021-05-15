import axios from 'axios';
const url = 'https://localhost:44398/api/User/';
const url2 = 'https://localhost:44398/api/UserType/';
export default{
    getInfo(token){
        return axios.get(url+ 'GetByID',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
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
    }
};