<template>
   <div class="footer">
      <div class="member-top">
        <div class="member">
           <h3 style="color:#df0024;">Kết nối với chúng tôi trên</h3>
           <div v-if="socials" class="social-banner">
            <a v-for="(social,index) in socials" v-bind:key="index" :href="social.link"><img :src="social.picture" width="50" height="50"></a>
            
            </div>
        </div>    
     </div>
     <div class="footer">
         <div class="menu-footer">
             <div class="colume-one">
               <a href="/" title="">
					  <img :src="logo" alt="sunnie.vn" width="112">
				   </a>
               <br>
                <a class="info" v-for="(info ,index) in companyInfo" v-bind:key="index" href="">{{info.lable}} <strong>{{info.content}} </strong></a>
             </div>
             <div v-for="(cate,index) in categories" v-bind:key="index" class="colume-two">
                <p style="font-size:16px;font-weight:bold">{{cate.lable}}</p>
                <div v-for="(child,index) in childcategories" v-bind:key="index">
                  <a class="cateChild" v-if="child.cateId === cate.id" :href="child.link">{{child.lable}}</a>
                </div>
             </div>
         </div>    
     </div>
     </div>
</template>

<script>
import firebase from '@/firebase/init.js';
export default {
   name: 'Footer',
   data(){
      return{
         socials:[],
         logo:'',
         companyInfo:[],
         categories:[],
         childcategories:[],
      }
   },
   mounted() {
      this.getSocial();
      this.getLogo();
      this.getCompanyInfo();
      this.getCategory();
      this.getCategoryChild();
   },
   methods:{
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
    getCategoryChild(){
      firebase.database().ref("Footer/categories-child").on("value", snapshot => {
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
   }
}
</script>

<style scoped>
@import url('../../../assets/css/footer.css');
#button-addon1 {
  color:#ff5f6d;
}

i {
  color: #ff5f6d;
}

.form-control::placeholder {
  font-size: 0.95rem;
  color: #aaa;
  font-style: italic;
}

.form-control.shadow-0:focus {
  box-shadow: none;
}
.info{
   padding: 7px;
}
.cateChild{
   padding:10px 0 10px 0;
}
</style>