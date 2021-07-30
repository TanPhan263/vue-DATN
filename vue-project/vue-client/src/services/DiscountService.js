import axios from 'axios';
const urlDiscountType='https://api.viefood.info/api/DiscountType';
const urlDiscount='https://api.viefood.info/api/Discount';
const urlDiscountDish='https://api.viefood.info/api/DiscountDish';
export default{
    //DiscountType
    //lấy danh sách tất cả loại khuyến mãi
    getAll(){
        return axios.get(urlDiscountType +'/GetAll').then(response => response.data);
    },
    //lấy danh sách loại khuyến mãi do admin tạo
    getByAdmin(){
        return axios.get(urlDiscountType +'/GetAllAdmin').then(response => response.data);
    },
    //lấy danh sách loại khuyến mãi do chủ quán tạo
    getByOwner(id){
        return axios.get(urlDiscountType +'/GetAllOwner?IDStore='+id).then(response => response.data);
    },
    //lấy loại khuyến mãi theo id
    getByID(id){
        return axios.get(urlDiscountType +'/GetByID?id='+id).then(response => response.data);
    },
    //chỉnh sửa loại khuyến mãi 
    editDitscount(id, discount,token){//truyền vào id khuyến mãi,đối tượng loại khuyến mãi và token
        return axios.post(urlDiscountType +'/EditByID?id='+id,discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api tạo mới khuyến mãi
    createDiscount(discount,token){//truyền vào đối tượng loại khuyến mãi, token
        return axios.post(urlDiscountType +'/Create',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //tạo loại khuyến mãi bởi chủ quán
    createDiscountOwner(storeID,discount,token){//truyền vào id quán, đối tượng loại khuyến mãi, token
        return axios.post(urlDiscountType +'/CreateDiscountTypeOwner?IDStore=' + storeID,discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api xóa loại khuyến mãi
    deleteDiscount(id,token){//truyền vào id loại khuyến mãi, token
       return axios.post(urlDiscountType+'/DeleteByID?id='+id, [],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //Discount
    //lấy khuyến mãi theo quán 
    getStore(id){//truyền vao id quán
        return axios.get(urlDiscount +'/GetByIDDiscountType?id='+id).then(response => response.data);
    },
    //thêm quán vào khuyến mãi 
    addStoreToDiscount(discount,token){//truyền vào đối tượng khuyến mãi, token
        return axios.post(urlDiscount +'/CreateDiscount',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api loại bỏ quán ra khỏi loại khuyến mãi
    removeStoreToDiscount(idStore,idDiscount,token){//truyền vào id quán, id loại khuyến mãi,token
        return axios.post(urlDiscount +'/DeleteByID?idstore='+idStore+ '&iddiscounttype='+ idDiscount, [],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api lấy khuyến mãi theo quán
    getDiscountbyStore(id){//truyền vào id quán
        return axios.get(urlDiscount +'/GetByIDStore?id='+id).then(response => response.data);
    },
    //DiscountDish
    //api lấy khuyến mãi theo món 
    getDishDiscounts(id){//truyền vào id món ăn
        return axios.get(urlDiscountDish +'/GetByID?id='+id).then(response => response.data);
    },
    //thêm món vào khuyến mãi
    addDishDiscount(discount,token){//truyền vào đối tượng khuyến mãi, token
        return axios.post(urlDiscountDish +'/CreateDiscountDish',discount,{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    },
    //api loại bỏ quán ra khỏi loại khuyến mãi
    removeDishDiscount(id,token){//truyền vào id khuyến mãi của món ăn
        return axios.post(urlDiscountDish +'/DeleteByID?id='+id, [],{ headers: {"Authorization" : `Bearer ${token}`}}).then(response => response.data);
    }
}