import axios from 'axios';
const url = 'https://api.viefood.info/api/BusinessType';
export default{
    //api lấy danh sách tất cả loại quán
    getAll(){
        return axios.get( url+'/GetAll').then(response => response.data);
    },
    //api lấy loại quán theo id
    getByID(id){
        return axios.get( url+'/GetByID?id=' + id).then(response => response.data);
    }
}