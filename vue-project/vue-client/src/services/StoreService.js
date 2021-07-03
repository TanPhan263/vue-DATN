import axios from 'axios';
import Vue from 'vue'
Vue.prototype.$http = axios

const url = 'https://api.viefood.info/api/Store';
const url2 = 'https://api.viefood.info/api/BusinessType';
const url3 = 'https://api.viefood.info/api/Dish';
const url4= 'https://api.viefood.info/api/DishType';
const url5= 'https://api.viefood.info/api/Menu';
const url6= 'https://api.viefood.info/api/DiscountType';
export default{
    getAll(){
        return axios.get('https://api.viefood.info/api/Store/GetAll').then(response => response.data);
    },
    getByID(id){
        return axios.get('https://api.viefood.info/api/Store/GetByID?id='+ id).then(response => response.data);
    },
    getByProvince(id){
       return axios.get( url+'/GetAllGanToiProvince?id=' + id).then(response => response.data);
    },
    getByProvince_distance(id, lat, long){
        return axios.get(url+'/GetAllGanToiProvince?id=' + id + '&Lat='+lat+'&Long='+long).then(response => response.data);
     },
    getByBussinessType(id){
       return axios.get(url + '/GetByIDBusinessType?id=' +id ).then(response =>response.data);
    },
    updateStore(id,store, token){
        return axios.post(url+ "/EditByID?id=" + id,store,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    addStore(store, token){
        return axios.post(url + '/CreateStore', store,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    searchStore(key){
        return axios.get(url3+'/Search?dishname=' +key).then(response => response.data);
    },
    getAllBussinessType(){
        return axios.get( url2+'/GetAll').then(response => response.data);
    },
    getBussinessTypeById(id){
        return axios.get( url2+'/GetByID?id='+ id).then(response => response.data[0].businessTypeName);
    },
    getByUser(id,token){
        return axios.get(url+'/GetByIDOwner?id='+id,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    getDishType(){
        return axios.get( url4+'/GetAll').then(response => response.data);
    },
    addDish(dish,token)
    {
        return axios.post(url3 + '/CreateDish',dish,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    getDishByStore(id){
        return axios.get(url3 + '/GetByIDStore?id='+id).then(response => response.data);
    },
    getDishByID(id){
        return axios.get(url3 + '/GetByID?id='+id).then(response => response.data);
    },
    updateDish(id,dish,token){
        return axios.post(url3 + '/EditByID?id='+id,dish,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data); 
    },
    getLatLong(id){
        return axios.get(url + '/GetByIDLatLong?id=' + id).then(response => response.data);
    },
    updateLatLong(store){
        return axios.post(url + '/CreateLatLong',store).then(response => response.data);  
    },
    updateRate(id, rate){
        return axios.post(url + '/UpdateRatePoint?id='+ id + '&RatePoint=' + rate).then(response => response.data);
    },
    createMenu(){
        return axios.post(url5 + '/CreateMenu').then(response => response.data);
    },
    registerStore(credentials){
        return axios
        .post( url + '/CreateStoreOwner', credentials)
        .then(response => response.data);
    },
    deleteDish(id){
        return axios
        .post(url3 + '/DeleteByID?id='+id)
        .then(response => response.data);
    },
    getByBussinessType(id){
        return axios.get('https://api.viefood.info/api/Store/GetByIDBusinessType?id='+ id).then(response => response.data);
    },
    getByDistrict(id){
        return axios.get('https://api.viefood.info/api/Store/GetByIDDistrict?id='+ id).then(response => response.data);
    },
    viewCount(view){
        return 
    },
    getAllDish(){
        return axios
        .get(url3 + '/GetAll')
        .then(response => response.data);
    },
    getDiscountAll(){
        return axios
        .get(url6 + '/GetAll')
        .then(response => response.data);
    },
    getConfirmStore(token){
        return axios.get(url+'/GetAllCheck',{ headers: {'Accept': 'application/json',
        'Content-Type': 'application/json' , "Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    changeStatus(token, status, id){
        return axios.post(url+'/ChangeStatusStore?id=' +id+ '&status='+status,[],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    delete( id, token){
        return axios
          .post(url + '/DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
          .then(response => response.data);
    },
}