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
    //tìm kiêm quán
    searchStore(key){//truyền vào từ khóa
        return axios.get('https://api.viefood.info/api/Dish/Search?dishname=' + key).then(response => response.data);
    },
    //tìm kiếm quán và tính lại khoảng cách
    searchStore_distance(key,lat,long){//truyền vào từ khóa lat lng của địa chỉ 
        return axios.get('https://api.viefood.info/api/Dish/Search?dishname=' + key +'&Lat='+lat+'&Long='+long).then(response => response.data);
    },
    //lấy tất cả quán
    getAll(){
        return axios.get('https://api.viefood.info/api/Store/GetAll').then(response => response.data);
    },
    //lấy thông tin quán theo id
    getByID(id){//truyền vào id quán
        return axios.get('https://api.viefood.info/api/Store/GetByID?id='+ id).then(response => response.data);
    },
    //lấy quán theo tỉnh 
    getByProvince(id){//truyền vào id tỉnh
       return axios.get( url+'/GetAllGanToiProvince?id=' + id).then(response => response.data);
    },
    //lấy quán theo tỉnh và tính lại khoảng cách
    getByProvince_distance(id, lat, long){//truyền vào id tỉnh lat lng của địa chỉ
        return axios.get(url+'/GetAllGanToiProvince?id=' + id + '&Lat='+lat+'&Long='+long).then(response => response.data);
     },
    //lấy quán theo tỉnh 
    getByBussinessType(id){
       return axios.get(url + '/GetByIDBusinessType?id=' +id ).then(response =>response.data);
    },
    //update thông tin quán
    updateStore(id,store, token){//truyền vào id quán, đối tượng quán, token
        return axios.post(url+ "/EditByID?id=" + id,store,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //thêm quán
    addStore(store, token){//truyền vào đối tượng quán, token
        return axios.post(url + '/CreateStore', store,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    // searchStore(key){
    //     return axios.get(url3+'/Search?dishname=' +key).then(response => response.data);
    // },
    //Lấy danh sách tất cả loại quán
    getAllBussinessType(){
        return axios.get( url2+'/GetAll').then(response => response.data);
    },
    //api lấy loại quán theo id
    getBussinessTypeById(id){
        return axios.get( url2+'/GetByID?id='+ id).then(response => response.data[0].businessTypeName);
    },
    //lấy quán theo người dùng
    getByUser(id,token){//truyền vào id người dùng và token
        return axios.get(url+'/GetByIDOwner?id='+id,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api lấy tất cả loại món ăn
    getDishType(){
        return axios.get( url4+'/GetAll').then(response => response.data);
    },
    //api thêm món ăn
    addDish(dish,token)//truyền vào token và đối tượng món ăn
    {
        return axios.post(url3 + '/CreateDish',dish,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api lấy món ăn theo quán
    getDishByStore(id){//truyền vào id quán
        return axios.get(url3 + '/GetByIDStore?id='+id).then(response => response.data);
    },
    //lấy thông tin món ăn theo id món
    getDishByID(id){
        return axios.get(url3 + '/GetByID?id='+id).then(response => response.data);
    },
    //cập nhật món ăn 
    updateDish(id,dish,token){//truyền vào id món , đối tượng món token
        return axios.post(url3 + '/EditByID?id='+id,dish,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data); 
    },
    //lấy lat lng của quán 
    getLatLong(id){//truyền vào id quán
        return axios.get(url + '/GetByIDLatLong?id=' + id).then(response => response.data);
    },
    // updateLatLong(store){
    //     return axios.post(url + '/CreateLatLong',store).then(response => response.data);  
    // },

    //update điểm của quán
    updateRate(id){//truyền vào id quán
        return axios.post(url + '/UpdateRatePoint?id='+ id).then(response => response.data);
    },
    //tạo mới 1 menu
    createMenu(){
        return axios.post(url5 + '/CreateMenu').then(response => response.data);
    },
    //đăng kí quán
    registerStore(credentials){//truyền vào đối tượng quán
        return axios
        .post( url + '/CreateStoreOwner', credentials)
        .then(response => response.data);
    },
    //xóa món ăn 
    deleteDish(id){//truyền vào id món ăn
        return axios
        .post(url3 + '/DeleteByID?id='+id)
        .then(response => response.data);
    },
    //lấy danh sách quán theo id loại quán
    getByBussinessType(id){//truyền vào id loại quán
        return axios.get('https://api.viefood.info/api/Store/GetByIDBusinessType?id='+ id).then(response => response.data);
    },
    //lấy danh sách quán theo id loại quán tính toán khoảng cách
    getByBussinessType_distance(id,lat, long){//truyền vào id loại quán lat lng của địa chỉ 
        return axios.get('https://api.viefood.info/api/Store/GetByIDBusinessType?id='+ id + '&Lat='+lat+'&Long='+long).then(response => response.data);
    },
    //lấy danh sách quán theo quận
    getByDistrict(id){//truyền vào id quận
        return axios.get('https://api.viefood.info/api/Store/GetByIDDistrict?id='+ id ).then(response => response.data);
    },
    //lấy danh sách quán theo quận  tính toán khoảng cách
    getByDistrict_distance(id, lat, long){//truyền vào id quận lat lng của địa chỉ 
        return axios.get(url+'/GetByIDDistrict?id=' + id + '&Lat='+lat+'&Long='+long).then(response => response.data);
    },
    // viewCount(view){
    //     return 
    // },

    //lấy danh sách tất cả món ăn
    getAllDish(){
        return axios
        .get(url3 + '/GetAll')
        .then(response => response.data);
    },
    //lấy danh sách tất cả loại khuyến mãi
    getDiscountAll(){
        return axios
        .get(url6 + '/GetAll')
        .then(response => response.data);
    },
    //lấy danh sách quán chưa xác nhận
    getConfirmStore(token){//truyền vào token 
        return axios.get(url+'/GetAllCheck',{ headers: {'Accept': 'application/json',
        'Content-Type': 'application/json' , "Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //thay đổi trạng thái của quán
    changeStatus(token, status, id){//truyền và token , trạng thái(1,2,-1), id quán
        return axios.post(url+'/ChangeStatusStore?id=' +id+ '&status='+status,[],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //xóa quán 
    delete( id, token){//truyền vào id quán và token 
        return axios
          .post(url + '/DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
          .then(response => response.data);
    },
    //lấy danh sách đánh giá của quán
    getListRate(id){//truyền vào id quán
        return axios.get( url+'/ListRate?id=' + id).then(response => response.data);
    }
}