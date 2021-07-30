<template>
  <CRow>
    <div class="container">
      <h3>Social connection </h3>
      <div class="row" >
        <div class="col-12" >
        <table class="table table-image" >
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Ảnh</th>
              <th scope="col">Tên</th>
              <th scope="col">Link</th>
              <th scope="col" class="manage">Manage</th>
            </tr>
          </thead>
          <tbody v-if="socials">
            <tr v-for="(social,index) in socials" v-bind:key="index">
              <th scope="row">{{index + 1}}</th>
              <td class="w-25">
                <img :src="social.picture" style="height: 120px;width:120px">
              </td>
              <td>  
                <CInput
                v-model="social.socialName"/>
                </td>
              <td>
                <CInput
                v-model="social.link"/>
              </td>
              <td>
                 <CButtonGroup style="float:left" size="sm">
                  <CButton @click="updateSocial(social.id,social.socialName,social.link,social.picture)" color="primary">Save</CButton>
                  <CButton @click="deleteSocial(social.id)" color="danger">Delete</CButton>
                </CButtonGroup>
              </td>
            </tr>
             <tr>
              <th scope="row">*</th>
              <td class="w-25">
                <input type="file" @change="previewImage"/>
              </td>
              <td> 
                  <CInput
                  v-model="socialName"
                  />
              </td>
              <td>
                  <CInput
                  v-model="socialLink"
                  />
              </td>
              <td>
                 <CButtonGroup style="float:left" size="sm">
                  <CButton @click="isLogo=false,isBanner=false,onUpload()" color="success">Add</CButton>
                  <CButton color="danger">Cancle</CButton>
                </CButtonGroup>
              </td>
            </tr>
          </tbody>
        </table>   
        </div>
      </div>
      <div class="row col-12">
      <div class="col-5">
        <h4>Logo</h4>
        <div>
          <img
            :src="logo"
            class="img-thumbnail"
            alt="..."
            style="height: 200px;width:320px; margin-bottom:10px"
          />
          <div>
            <input type="file" @change="previewImage" style="margin-bottom: 20px">
            <CButton @click="isLogo=true,isBanner= false,onUpload()" color="primary">Save</CButton>
          </div>
        </div>
      </div>
      <div class="col-7" style="float:right">
        <h4>Banner</h4>
        <div >
          <img
            :src="banner"
            class="img-thumbnail"
            alt="..."
            style="height: 200px;width:100%; margin-bottom:10px"
          />
          <div>
          <input type="file" @change="previewImage" style="margin-bottom: 20px">
          <CButton @click="isBanner=true,isLogo=false,onUpload()" color="primary">Save</CButton>
          </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h3 class="header-h3">Footer information</h3>
        <table class="table table-image"  style="width: 100%">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Lable</th>
              <th scope="col">Content</th>
              <th scope="col" class="manage">Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(info,index) in companyInfo" v-bind:key="index">
              <th scope="row">{{index + 1}}</th>
              <td class="w-25">
                 <CInput
                 v-model="info.lable"
                  />
              </td>
              <td> 
                <CInput
                v-model="info.content"
                  />
              </td>
              <td>
                 <CButtonGroup style="float:left" size="sm">
                  <CButton @click="updateCompanyInfo(info.id,info.lable,info.content)" color="primary">Save</CButton>
                  <CButton @click="deleteCompanyInfo(info.id)" color="danger">Delete</CButton>
                </CButtonGroup>
              </td>
            </tr>
             <tr>
              <th scope="row">*</th>
              <td class="w-25">
                <CInput
                  v-model="lable"
                  />
              </td>
              <td> <CInput
                v-model="content"
                  />
              </td>
              <td>
                 <CButtonGroup style="float:left" size="sm">
                  <CButton @click="addCompanyInfo()" color="success">Add</CButton>
                  <CButton color="danger">Cancle</CButton>
                </CButtonGroup>
              </td>
            </tr>
          </tbody>
        </table>   
        </div>
    </div>


   
    <div class="row">
       
        <div class="col-6">
          <h3>Footer Category</h3>
        <table class="table table-image"  style="width: 100%">
          <thead>
            <tr>
              <th scope="col" style="width: 10%">STT</th>
              <th scope="col" style="width: 60%" >Lable</th>
              <th scope="col"  style="width: 30%">Manage</th>
            </tr>
          </thead>
          <tbody v-if="categories">
            <tr  v-for="(cate,index) in categories" v-bind:key="index" >
              <th scope="row">{{index + 1}}</th>
              <td class="w-25">
                 <CInput
                 v-model="cate.lable"
                  />
              </td>
              <td>
                 <CButtonGroup style="float:left" size="sm">
                  <CButton @click="updateCategory(cate.id,cate.lable)"  color="primary">Save</CButton>
                   <CButton @click="getCategoryChild(cate.id)" color="warning">Detail</CButton>
                  <CButton @click="deleteCategory(cate.id)" color="danger">Delete</CButton>
                </CButtonGroup>
              </td>
            </tr>
             <tr>
              <th scope="row">*</th>
              <td class="w-25">
                <CInput
                  v-model="cateName"
                  />
              </td>
              <td>
                 <CButtonGroup style="float:left" size="sm">
                  <CButton @click="addCategory()" color="success">Add</CButton>
                  <CButton @click="cateName = ''" color="danger">Cancle</CButton>
                </CButtonGroup>
              </td>
            </tr>
          </tbody>
        </table>   
        </div>
        <div class="col-6">
          <h3>Footer Child Category</h3>
          <table class="table table-image"  style="width: 100%">
                  <thead>
                    <tr> 
                      <th scope="col">STT</th>
                      <th scope="col">Lable</th>
                      <th scope="col">Link</th>
                      <th scope="col">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr  v-for="(cate,index) in childcategories" v-bind:key="index">
                  <th scope="row">{{index + 1}}</th>
                  <td class="w-25">
                    <CInput
                      v-model="cate.lable"
                      />
                  </td>
                  <td> 
                    <CInput
                       v-model="cate.link"
                      />
                  </td>
                  <td>
                    <CButtonGroup style="float:left" size="sm">
                      <CButton @click="updateCategoryChild(cate.id,cate.lable,cate.link,cate.cateId)" color="primary">Save</CButton>
                      <CButton @click="deleteCategoryChild(cate.id)" color="danger">Delete</CButton>
                    </CButtonGroup>
                  </td>
                </tr>
                <tr>
                  <th scope="row">*</th>
                  <td class="w-25">
                    <CInput
                      v-model="childName"
                      />
                  </td>
                  <td> <CInput
                      v-model="childLink"
                      />
                  </td>
                  <td>
                    <CButtonGroup style="float:left" size="sm">
                      <CButton @click="addCategoryChild()" color="success">Add</CButton>
                      <CButton color="danger">Cancle</CButton>
                    </CButtonGroup>
                  </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </div>
  </CRow>
</template>

<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService.js'
export default {
    beforeRouteEnter(to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'manageNavBar',
  data(){
      return{
        socials:[],                     //danh sách mạng xã hội hiển thị ở footer
        socialName:'',                  //các biến chứa thông tin của liên kết
        socialPic:'',
        imageData: null,
        socialLink:'',
        companyInfo:[],                 //danh sách thông tin của website ở footer
        lable: '',                      //các biến chứa thông tin của một info
        content:'',
        logo:'',                        //logo trang web
        isLogo:false,                   //biến cờ xác nhận đang update logo
        banner:'',                      //banner của trnag web 
        isBanner:false,                 //biến cờ xác nhận đang update logo
        categories:[],                  //danh sách danh mục ở footer
        cateID:'',                      //các biến chứa thông tin của một danh mục
        cateName:'',
        childcategories:[],             //danh sách danh mục con ở footer
        childName:'',                   //các biến chứa thông tin của một danh mục con
        childLink:'',
      }
  },
  mounted() {
    this.onInit();
  },
  methods:{
    onInit(){
      this.getSocial();
      this.getLogo();
      this.getBanner();
      this.getCompanyInfo();
      this.getCategory();
    },
    getLogo(){                                              //lấy logo từ firebase 
        const socialRef = firebase.database().ref("Footer/logo/");
        socialRef.on("value", snapshot => {
        let data = snapshot.val();
        if(data){                                           //nếu data tồn tại
          let logo = [];
          Object.keys(data).forEach(key => {
                logo.push({
                  id: key,
                  picture: data[key].picture,
                });
            });
            this.logo = logo[0].picture;                     //gán dữ liệu vừa nhận được vào logo
        }
        else{
          this.logo='';
        }
      });
    },
    getBanner(){                                            //lấy banner từ firebase 
      const socialRef = firebase.database().ref("Footer/banner/");
        socialRef.on("value", snapshot => {
        let data = snapshot.val();
        if(data){                                           //nếu data tồn tại
          let banner = [];
          Object.keys(data).forEach(key => {                
              banner.push({
                id: key,
                picture: data[key].picture,
              });
          });
          this.banner = banner[0].picture;                //gán dữ liệu vừa nhận được vào banner
        }
        else{
          this.banner='';
        }
      });
    },
    getSocial(){                                             //lấy danh sách mạng xã hội hiển thị ở footer
      const socialRef = firebase.database().ref("Footer/socials/");
            socialRef.on("value", snapshot => {
            let data = snapshot.val();                          //nếu data tồn tại
            if(data){
              let socials = [];
              Object.keys(data).forEach(key => {
                    socials.push({
                    id: key,
                    picture: data[key].picture,
                    socialName:data[key].socialName,
                    link: data[key].link,
                    });
                });
                this.socials = socials;                    //gán dữ liệu vừa nhận được vào socials
            }
            else{
             this.socials=[];
            }
          });
    },
    getCompanyInfo(){                                      //lấy danh sách thông tin của website ở firebase
      const companyRef = firebase.database().ref("Footer/companyinfo/");
            companyRef.on("value", snapshot => {          //nếu data tồn tại
            let data = snapshot.val();
            if(data){
              let company = [];
              Object.keys(data).forEach(key => {
                    company.push({
                    id: key,
                    lable: data[key].lable,
                    content:data[key].content,
                    });
                });
                this.companyInfo = company;             //gán dữ liệu vừa nhận được vào companyInfo
            }
            else{
             this.companyInfo=[];
            }
          });
    },
    getCategory(){                                       //lấy danh sách danh mục ở firebase  
      const categoryRef = firebase.database().ref("Footer/categories/");
            categoryRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){                                     //nếu data tồn tại
              let category = [];
              Object.keys(data).forEach(key => {
                    category.push({
                    id: key,
                    lable: data[key].lable,
                    });
                });
                this.categories = category;                //gán dữ liệu vừa nhận được vào categories
                this.getCategoryChild(this.categories[0].id);//lấy thông tin danh mục con của categories đầu tiên
            }
            else{
             this.categories =[];
            }
          });
    },
    getCategoryChild(id){                                   //lấy thông tin danh mục con của categories
      this.cateID = id;
      firebase.database().ref("Footer/categories-child").orderByChild('cateId').equalTo(this.cateID).on("value", snapshot => {
            let data = snapshot.val();
            if(data){                                         //nếu data tồn tại
              let category = [];
              Object.keys(data).forEach(key => {
                    category.push({
                    id: key,
                    lable: data[key].lable,
                    link: data[key].link,
                    cateId: data[key].cateId
                    });
                });
                this.childcategories = category;     //gán dữ liệu vừa nhận được vào childcategories
            }
            else{
             this.childcategories=[];
            }
          });
    },
    addSocial(){                                //thêm mới một mạng xã hội vào danh sách
      try{
       if(this.socialPic == '' || this.socialLink == '' || this.socialName == '') return;
          const social = {                      //tạo một đối tượng xã hội 
            picture: this.socialPic,
            socialName: this.socialName,
            link: this.socialLink
          };
          firebase                              //thêm vào firebase 
            .database()
            .ref("Footer/socials/")
            .push(social);
          this.socialPic  = '';                 //reset dữ liệu
          this.socialLink = '';
          this.socialName = '';
          alert('Thêm thành công');
          this.getSocial();
      }
      catch(err){
        console.log(err);
      }
    },
    addCompanyInfo(){                            //thêm mới một CompanyInfo vào danh sách
       if(this.lable == '') {alert("Vui lòng nhập đầy đủ"); return;}
          const infor = {                        //tạo một đối tượng info 
                lable: this.lable,
                content:this.content,
          };
          firebase                                //thêm vào firebase 
            .database()
            .ref("Footer/companyinfo/")
            .push(infor);
      alert("Thêm thành công");
      this.lable = '';this.content = '';            //reset dữ liệu
    },
    addCategory(){                                  //thêm mới một Category vào danh sách
      if(this.cateName == '') {alert("Vui lòng nhập đầy đủ"); return;}
          const cate = {                              //tạo một đối tượng Category 
                lable: this.cateName,
          };
          firebase                                     //thêm vào firebase 
            .database()
            .ref("Footer/categories/")
            .push(cate);
      alert("Thêm thành công");
      this.cateName= '';                                 //reset dữ liệu
    },
    addCategoryChild(){                                 //thêm mới một chile category vào danh sách
      if(this.childName == '') {alert("Vui lòng nhập đầy đủ"); return;}
          const child = {                               //tạo một đối tượng child category 
                lable: this.childName,
                link:this.childLink,
                cateId: this.cateID
          };
          firebase                                      //thêm vào firebase 
            .database()
            .ref("Footer/categories-child/")
            .push(child);
      alert("Thêm thành công");                           //reset dữ liệu
      this.childName = '';this.childLink = '';
      this.getCategoryChild(this.cateID);                 //tải danh sách child category của category hiện tại
    },
    deleteSocial(id){                                     //xóa một mục mạng xã hội bằng id
      try{
        if(confirm('Bạn chắc chắn muốn xóa???')){
          firebase
                .database()
                .ref("Footer/socials/"+ id).remove();
            alert("delete thành công");
        }
        else return;
      }
      catch(err){console.log(err)}
    },
    deleteCompanyInfo(id){                                //xóa một mục CompanyInfo bằng id
      try{  
        if(confirm('Bạn chắc chắn muốn xóa???')){
        firebase
              .database()
              .ref("Footer/companyinfo/"+ id).remove();
          alert("delete thành công");
          }
        else return;
      }
      catch(err){console.log(err)}
    },
    deleteCategory(id){                                   //xóa một mục Categories bằng id
      try{
        if(confirm('Bạn chắc chắn muốn xóa???')){
        firebase
              .database()
              .ref("Footer/categories/"+ id).remove();
          alert("delete thành công");
          }
        else return;
      }
      catch(err){console.log(err)}
    },
    deleteCategoryChild(id){                              //xóa một mục child Categories bằng id
      try{
        if(confirm('Bạn chắc chắn muốn xóa???')){
          firebase
                .database()
                .ref("Footer/categories-child/"+ id).remove();
            alert("delete thành công");
        }
        else return;
      }
      catch(err){console.log(err)}
    },
    updateSocial(id,name,link,picture){                    //update một mục mạng xã hội
      try{
       console.log(id,name,link,picture)
       firebase
            .database()
            .ref("Footer/socials/"+ id)                   //truy xuất phần tử có id = id được truyền vào 
            .update({link: link, picture: picture , socialName: name});//update các thuộc tính của phần tử 
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    updateCompanyInfo(id,lable,content){                  //update một mục CompanyInfo 
       try{
       firebase
            .database()
            .ref("Footer/companyinfo/"+ id)               //truy xuất phần tử có id = id được truyền vào 
            .update({lable: lable, content: content });   //update các thuộc tính của phần tử 
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    updateCategory(id,lable){                             //update một mục Category
      try{
       firebase
            .database()
            .ref("Footer/categories/"+ id)                //truy xuất phần tử có id = id được truyền vào 
            .update({ lable: lable });                    //update các thuộc tính của phần tử 
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    updateCategoryChild(id,lable,link,cateId){               //update một mục ChildCategory 
       try{
       firebase
            .database()
            .ref("Footer/categories-child/"+ id)              //truy xuất phần tử có id = id được truyền vào 
            .update({cateId: cateId, lable: lable, link: link});//update các thuộc tính của phần tử
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    uploadLogo(picture){                                     //update logo trên firebase                          
      try{
      firebase
            .database()
            .ref("Footer/logo/").child('-McQ5jA7Ke_W69Loo1Jj')  
            .update({ picture: picture });
      alert("update thành công");
      }
      catch(err){console.log(err)}
    },
    uploadBanner(picture){                                    //update banner trên firebase  
      try{
      firebase
        .database()
        .ref("Footer/banner/").child('-MeG1i5jAc_PmKUIXPRu')
        .update({ picture: picture });
        alert("update thành công");
      }
      catch(err){console.log(err)}
    },
    previewImage(event){                                      //hàm lấy thông tin hình ảnh trước khi nhấn vào input file
      if(this.isLogo)
        {
         this.logo=null;
        }
        else if(this.isBanner)
        {
          this.banner=null;
        }
        else this.socialPic = null;
      this.imageData = event.target.files[0];
    },
    onUpload(){
      if(this.imageData == null)                  //nếu không có hình ảnh
      {
        if(this.isLogo)                           //nếu đang update logo thì thông báo chọn hình ảnh 
        {
          alert('Vui lòng chọn hình ảnh');
          return;
        }
        else if(this.isBanner)                     //nếu đang update banner thì thông báo chọn hình ảnh 
        {
          alert('Vui lòng chọn hình ảnh');
          return;
        }
        this.addSocial();                       //thêm mới một mục mạng xã hội
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => {  //trả về url của ảnh
          if(this.isLogo && !this.isBanner)                       //nếu đang update logo 
          {
            this.logo=url;                                         //gán url trả về vào logo
            this.uploadLogo(url);                                  //update logo
            return;                                                //thoát hàm
          }
          else if(this.isBanner && !this.isLogo)                  //nếu đang update banner
          {
            this.banner=url;                                      //gán url trả về vào banner
            this.uploadBanner(url);                               //update banner
            return;                                               //thoát hàm
          }
          else if(!this.isLogo && !this.isBanner){
            this.socialPic=url;                                    //gán url trả về vào socialPic
            this.addSocial();                                     //thêm mới một mục mạng xã hội
          }
          })
        }
      )
    },
  },  
}
</script>

<style>
h4 {
  margin: 2rem 0rem 1rem;
}

.table-image {
  background: white;
}
.table-image td, th {
    vertical-align: middle;
  }
.hiddenRow {
    padding: 0 !important;
}
.manage{
  width: 15%;
}
</style>