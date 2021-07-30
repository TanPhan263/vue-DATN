import axios from 'axios';
const url='https://api.viefood.info/api/Comment';
export default{
    //api lấy tất cả bình luận
    getAll(){
        return axios.get(url +'/GetAll').then(response => response.data);
    },
    //api lấy danh sách bình luận theo id quán
    getCommentByStore(index){
        return axios.get(url +'/GetByID?id='+index).then(response => response.data);
    },
    //api bình tạo bình luận mới 
    submitComment(token,content){//truyền token và đối tượng bình luận
        return axios.post(url +'/CreateComment',content,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api chỉnh sửa bình luận
    editComment(id, content,token){//truyền vào id binhg luận, đối tượng comments và token
        return axios.post(url +'/EditByIDForUser?id='+id,content,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //xóa bình luận
    deleteComment(id,token){
        return axios.post(url +'/DeleteByIDForUser?idcomment='+ id,[],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //xóa bình luận với quyền admin
    deleteCommentAdmin(id,token){//truyền vào id bình luaanj, token
        return axios.post(url +'/DeleteByID?id='+ id,[],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    }   

}