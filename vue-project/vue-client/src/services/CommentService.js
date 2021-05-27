import axios from 'axios';
const url='http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/Comment';
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

}