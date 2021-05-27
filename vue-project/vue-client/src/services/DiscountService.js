import axios from 'axios';
const url='http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/DiscountType';
const url2='http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/Discount'
export default{
    getAll(){
        return axios.get(url +'/GetAll').then(response => response.data);
    },
    getByID(){
        return axios.get(url +'/GetByID?id='+id).then(response => response.data);
    },
    editDitscount(id, discount,token){
        return axios.post(url +'/EditByID?id='+id,discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    createDiscount(discount,token){
        return axios.post(url +'/Create',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    deleteDiscount(id,token){
       return axios.post(url+'/DeleteByID?id='+id).then(response => response.data);
    },
    getStore(id){
        return axios.get(url2 +'/GetByIDDiscountType?id='+id).then(response => response.data);
    },
    addStoreToDiscount(discount,token){
        return axios.post(url2 +'/CreateDiscount',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    removeStoreToDiscount(idStore,idDiscount,token){
        return axios.post(url2 +'/DeleteByID?idstore='+idStore+ '&iddiscounttype='+ idDiscount, [],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    getDiscountbyStore(id){
        return axios.get(url2 +'/GetByIDStore?id='+id).then(response => response.data);
    }
}