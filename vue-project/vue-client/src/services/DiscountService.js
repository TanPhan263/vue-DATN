import axios from 'axios';
const urlDiscountType='https://api.viefood.info/api/DiscountType';
const urlDiscount='https://api.viefood.info/api/Discount'
const urlDiscountDish='https://api.viefood.info/api/DiscountDish'
export default{
    //DiscountType
    getAll(){
        return axios.get(urlDiscountType +'/GetAll').then(response => response.data);
    },
    getByID(){
        return axios.get(urlDiscountType +'/GetByID?id='+id).then(response => response.data);
    },
    editDitscount(id, discount,token){
        return axios.post(urlDiscountType +'/EditByID?id='+id,discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    createDiscount(discount,token){
        return axios.post(urlDiscountType +'/Create',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    deleteDiscount(id,token){
       return axios.post(urlDiscountType+'/DeleteByID?id='+id).then(response => response.data);
    },
    //Discount
    getStore(id){
        return axios.get(urlDiscount +'/GetByIDDiscountType?id='+id).then(response => response.data);
    },
    addStoreToDiscount(discount,token){
        return axios.post(urlDiscount +'/CreateDiscount',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    removeStoreToDiscount(idStore,idDiscount,token){
        return axios.post(urlDiscount +'/DeleteByID?idstore='+idStore+ '&iddiscounttype='+ idDiscount, [],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    getDiscountbyStore(id){
        return axios.get(urlDiscount +'/GetByIDStore?id='+id).then(response => response.data);
    },
    //DiscountDish
    getDishDiscounts(id){
        return axios.get(urlDiscountDish +'/GetByID?id='+id).then(response => response.data);
    },
    addDishDiscount(discount,token){
        return axios.post(urlDiscountDish +'/CreateDiscountDish',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    removeDishDiscount(id,token){
        return axios.post(urlDiscountDish +'/DeleteByID?id='+id, [],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    }
}