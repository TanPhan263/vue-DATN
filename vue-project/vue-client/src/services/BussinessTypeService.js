import axios from 'axios';
const url = 'https://api.viefood.info/api/BusinessType';
export default{
    getAll(){
        return axios.get( url+'/GetAll').then(response => response.data);
    },
    getByID(id){
        return axios.get( url+'/GetByID?id=' + id).then(response => response.data);
    }
}