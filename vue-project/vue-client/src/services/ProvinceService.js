import axios from 'axios';
const url = 'https://api.viefood.info/api/Province';
const url2 = 'https://api.viefood.info/api/District';
export default{
    //lấy tất cả các tỉnh
    getAll(){
        return axios.get( url +'/GetAll').then(response => response.data);
    },
    //api lấy tất cả quận huyện
    getAllDistrict(){
        return axios.get( url2 +'/GetAll').then(response => response.data);
    },
    //api lấy thông tin quận theo id
    getDistrict(id){//truyền vào id quận
        return axios.get( url2 +'/GetByID?id='+id).then(response => response.data);
    },
    //api lấy danh sách quận theo id tỉnh
    getDistrictByID(id){//truyền vào id tỉnh
        return axios.get( url2 +'/GetByIDProvince?id='+id).then(response => response.data);
    },
    //api thêm quận
    addDistrict(token,district){//truyền vào token và đối tượng quận
        return axios.post(url2 +'/Create',district,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api xóa quận
    deleteDistrict(id,token){//truyền vào id quận và token
        return axios
        .post(url2 + '/DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.data);
    },
    //api xóa tỉnh 
    deleteProvince(id,token){//truyền vào id tỉnh và token
        return axios
        .post(url + '/DeleteByID?id='+ id, [],{ headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.data);
    },
    //thêm tỉnh 
    addProvince(token,province){//truyền vào token và đối tượng tỉnh 
        return axios.post(url +'/CreateProvince',province,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //cập nhật tỉnh
    updateProvince(token,province,id){//truyền vào token, đối tượng tỉnh, id tỉnh
        return axios.post(url +'/EditByID?id='+ id,province,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //cập nhật quận
    updateDistrict(token,district, id){//truyền vào token, đối tượng quận, id quận
        return axios.post(url2 +'/EditByID?id='+ id,district,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    }
}