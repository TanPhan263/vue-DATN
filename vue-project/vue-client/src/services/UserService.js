import axios from 'axios';
const url = 'https://api.viefood.info/api/User/';
const url2 = 'https://api.viefood.info/api/UserType/';
export default{
    //api lấy thông tin user qua token
    getInfo(token){
        try{
        return axios.get(url+ 'GetByID',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
        }
        catch{}
    },
    //api update thông tin user
    updateInfo(credentials,token) {
        return axios
          .post(url + 'EditByID',{ headers: {"Authorization" : `Bearer ${token}`}}, credentials)
          .then(response => response.data);
    },
    //lấy thông tin user bằng id và token
    getUserbyID(id,token){
        return axios.get(url+ 'GetByID?id='+id,{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
    },
    //lấy danh sách tất cả user 
    getAll(token){//truyền vào token
       return axios.get(url+ 'GetAll',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
    },
    //api lấy id loại user 
    getUserType(token){//truyền vào token
        return axios.get(url2+ 'GetAll',{ headers: {"Authorization" : `Bearer ${token}`}}).then(respone => respone.data);
    },
    //api lấy thông tin user
    getUserbyIDnoToken(id){//truyền vào id user
        return axios.get(url+ 'GetByIDNotToken?id='+id).then(respone => respone.data[0].userName);
    },
    //api lấy thông tin user
    getUserbyIDnoToken_pic(id){ //truyền vào id user
        return axios.get(url+ 'GetByIDNotToken?id='+id).then(respone => respone.data[0]);
    },
    //api xóa user 
    delete( id, token){//truyền vào id user và token 
        return axios
          .post(url + 'DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
          .then(response => response.data);
    },
    //api chặn tài khoản người dùng
    block(token, id, status){//truyền vào id token, trạng thái tài khoản(2)
        return axios
        .post(url + 'BlockAccount?id='+ id+ '&status='+status,[],{ headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.data);
    },
    //lấy số người online
    getOnlineUser(){
        return axios.get(url+ 'ThongKeNguoiOnline').then(respone => respone.data);
    },
    //đăng xuất
    logOut(id){
        return axios.post(url +'Logout?id='+ id).then(response => response.data);
    }
};