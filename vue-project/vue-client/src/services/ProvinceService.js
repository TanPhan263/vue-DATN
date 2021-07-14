import axios from 'axios';
const url = 'https://api.viefood.info/api/Province';
const url2 = 'https://api.viefood.info/api/District';
export default{
    getAll(){
        return axios.get( url +'/GetAllProvinceHaveStore').then(response => response.data);
    },
    getAllDistrict(){
        return axios.get( url2 +'/GetAll').then(response => response.data);
    },
    getDistrict(id){
        return axios.get( url2 +'/GetByID?id='+id).then(response => response.data);
    },
    getDistrictByID(id){
        return axios.get( url2 +'/GetByIDProvince?id='+id).then(response => response.data);
    },
    addDistrict(token,district){
        return axios.post(url2 +'/Create',district,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    deleteDistrict(id,token){
        return axios
        .post(url2 + '/DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.data);
    },
    deleteProvince(id,token){
        return axios
        .post(url + '/DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.data);
    },
    addProvince(token,province){
        return axios.post(url +'/CreateProvince',province,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    updateProvince(token,province,id){
        return axios.post(url +'/EditByID?id='+ id,province,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    updateDistrict(token,district, id){
        return axios.post(url2 +'/EditByID?id='+ id,district,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    }
}