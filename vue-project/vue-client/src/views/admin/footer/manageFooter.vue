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
        socials:[],
        socialName:'',
        socialPic:'',
        imageData: null,
        socialLink:'',
        companyInfo:[],
        logo:'',
        isLogo:false,
        banner:'',
        isBanner:false,
        lable: '',
        content:'',
        categories:[],
        cateID:'',
        cateName:'',
        childcategories:[],
        childName:'',
        childLink:'',
        collapse:''
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
    getLogo(){
        const socialRef = firebase.database().ref("Footer/logo/");
        socialRef.on("value", snapshot => {
        let data = snapshot.val();
        if(data){
          let logo = [];
          Object.keys(data).forEach(key => {
                logo.push({
                  id: key,
                  picture: data[key].picture,
                });
            });
            this.logo = logo[0].picture;
        }
        else{
          this.logo='';
        }
      });
    },
    getBanner(){
      const socialRef = firebase.database().ref("Footer/banner/");
        socialRef.on("value", snapshot => {
        let data = snapshot.val();
        if(data){
          let banner = [];
          Object.keys(data).forEach(key => {
              banner.push({
                id: key,
                picture: data[key].picture,
              });
          });
          this.banner = banner[0].picture;
        }
        else{
          this.banner='';
        }
      });
    },
    getSocial(){
      const socialRef = firebase.database().ref("Footer/socials/");
            socialRef.on("value", snapshot => {
            let data = snapshot.val();
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
                this.socials = socials;
            }
            else{
             this.socials=[];
            }
          });
    },
    getCompanyInfo(){
      const companyRef = firebase.database().ref("Footer/companyinfo/");
            companyRef.on("value", snapshot => {
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
                this.companyInfo = company;
            }
            else{
             this.companyInfo=[];
            }
          });
    },
    getCategory(){
      const categoryRef = firebase.database().ref("Footer/categories/");
            categoryRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){
              let category = [];
              Object.keys(data).forEach(key => {
                    category.push({
                    id: key,
                    lable: data[key].lable,
                    });
                });
                this.categories = category;
                this.getCategoryChild(this.categories[0].id);
            }
            else{
             this.categories =[];
            }
          });
    },
    getCategoryChild(id){
      this.cateID = id;
      firebase.database().ref("Footer/categories-child").orderByChild('cateId').equalTo(this.cateID).on("value", snapshot => {
            let data = snapshot.val();
            if(data){
              let category = [];
              Object.keys(data).forEach(key => {
                    category.push({
                    id: key,
                    lable: data[key].lable,
                    link: data[key].link,
                    cateId: data[key].cateId
                    });
                });
                this.childcategories = category;
            }
            else{
             this.childcategories=[];
            }
          });
    },
    addSocial(){
      try{
       if(this.socialPic == '' || this.socialLink == '' || this.socialName == '') return;
          const social = {
                picture: this.socialPic,
                socialName: this.socialName,
                link: this.socialLink
          };
          firebase
            .database()
            .ref("Footer/socials/")
            .push(social);
          this.socialPic  = '';
          this.socialLink = '';
          this.socialName = '';
          alert('Thêm thành công');
          this.getSocial();
      }
      catch(err){
        console.log(err);
      }
    },
    addCompanyInfo(){
       if(this.lable == '') {alert("Vui lòng nhập đầy đủ"); return;}
          const infor = {
                lable: this.lable,
                content:this.content,
          };
          firebase
            .database()
            .ref("Footer/companyinfo/")
            .push(infor);
      alert("Thêm thành công");
      this.lable = '';this.content = '' 
    },
    addCategory(){
      if(this.cateName == '') {alert("Vui lòng nhập đầy đủ"); return;}
          const cate = {
                lable: this.cateName,
          };
          firebase
            .database()
            .ref("Footer/categories/")
            .push(cate);
      alert("Thêm thành công");
      this.cateName= '';
    },
    addCategoryChild(){
      if(this.childName == '') {alert("Vui lòng nhập đầy đủ"); return;}
          const child = {
                lable: this.childName,
                link:this.childLink,
                cateId: this.cateID
          };
          firebase
            .database()
            .ref("Footer/categories-child/")
            .push(child);
      alert("Thêm thành công");
      this.childName = '';this.childLink = '';
      this.getCategoryChild(this.cateID); 
    },
    deleteSocial(id){
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
    deleteCompanyInfo(id){
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
    deleteCategory(id){
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
    deleteCategoryChild(id){
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
    updateSocial(id,name,link,picture){
      try{
       console.log(id,name,link,picture)
       firebase
            .database()
            .ref("Footer/socials/"+ id)
            .update({link: link, picture: picture , socialName: name});
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    updateCompanyInfo(id,lable,content){
       try{
       console.log(id,lable,content)
       firebase
            .database()
            .ref("Footer/companyinfo/"+ id)
            .update({lable: lable, content: content });
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    updateCategory(id,lable){
      try{
       firebase
            .database()
            .ref("Footer/categories/"+ id)
            .update({ lable: lable });
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }
    },
    updateCategoryChild(id,lable,link,cateId){
       try{
       firebase
            .database()
            .ref("Footer/categories-child/"+ id)
            .update({cateId: cateId, lable: lable, link: link});
        alert("update thành công");
      }
      catch(err){
        console.log(err);
      }

    },
    uploadLogo(picture){
      try{
      firebase
            .database()
            .ref("Footer/logo/").child('-McQ5jA7Ke_W69Loo1Jj')
            .update({ picture: picture });
      alert("update thành công");
      }
      catch(err){console.log(err)}
    },
    uploadBanner(picture){
      try{
      firebase
        .database()
        .ref("Footer/banner/").child('-MeG1i5jAc_PmKUIXPRu')
        .update({ picture: picture });
        alert("update thành công");
      }
      catch(err){console.log(err)}
    },
    previewImage(event){
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
      if(this.imageData == null)
      {
        if(this.isLogo)
        {
          alert('Vui lòng chọn hình ảnh');
          return;
        }
        else if(this.isBanner)
        {
          alert('Vui lòng chọn hình ảnh');
          return;
        }
        this.addSocial();
        return;
      }
      const storageRef = firebase.storage().ref(`image/${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_change`, snapshot => {
      },error =>{console.log(error.message)},
      ()=> {
        storageRef.snapshot.ref.getDownloadURL().then((url) => { 
          if(this.isLogo && !this.isBanner)
          {
            this.logo=url;
            this.uploadLogo(url);
            return;
          }
          else if(this.isBanner && !this.isLogo)
          {
            this.banner=url;
            this.uploadBanner(url);
            return;
          }
          else if(!this.isLogo && !this.isBanner){
            this.socialPic=url;
            this.addSocial();
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