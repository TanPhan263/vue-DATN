import axios from 'axios';
const url='https://api.viefood.info/api/Comment';
export default{
    getAll(){
        return axios.get(url +'/GetAll').then(response => response.data);
    },
    getCommentByStore(index){
        return axios.get(url +'/GetByID?id='+index).then(response => response.data);
    },
    submitComment(token,content){
        return axios.post(url +'/CreateComment',content,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    editComment(id, content,token){
        return axios.post(url +'/EditByIDForUser?id='+id,content,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    deleteComment(id,token){
        return axios.post(url +'/DeleteByIDForUser?idcomment='+ id,[],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    }   

}