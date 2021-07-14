<template>
<CCol>
   <CCard>
      <CCardHeader>
        <CIcon name="cil-justify-center"/><strong> Manage Navs</strong>
         <select 
              id="navSelect"
              class="selectBox"
              vertical
              @change="addNavItem($event)">
              <option v-for="(business,index) in businessTypes" v-bind:key="index" :value="index" >
                  {{business.businessTypeName}}
              </option>
          </select>
            <p class="selectLable">Thêm mới: </p>
      </CCardHeader>
      <CCardBody>
        <CNav>
          <div v-for="(nav,index) in navItems" v-bind:key="index">
          <CNavItem :class="'navItems ' + [updateId === nav.navId? 'activeNav':'']" > {{nav.lable}}
            <i @click="updateId = nav.navId, updateName = nav.lable" class="fas fa-edit"></i>	<i @click="deleteNavItem(nav.navId)" class="fa fa-window-close"></i>
           </CNavItem>
             </div>
        </CNav>
        
      </CCardBody>
    </CCard>
    <CCard class="updateNav" :show="true" :duration="400">
     <CCardHeader>
        <p>Chỉnh sửa nav item: </p><strong>{{updateName}}</strong> 
     </CCardHeader>
     <CCardBody>
        <select 
        id="province"
        class="selectBox"
        style="float:left"
        vertical
        @change="updateNavItem($event)">
        <option v-for="(business,index) in businessTypes" v-bind:key="index" :value="index">
          {{business.businessTypeName}}
        </option>
      </select>
     </CCardBody>
    </CCard>
</CCol>
</template>
<script>
import firebase from '@/firebase/init.js';
import AuthService from '@/services/AuthService.js'
import StoreService from '@/services/StoreService.js'
  export default {
    beforeRouteEnter (to, from, next) {
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    AuthService.checkAdmin(localStorage.getItem('isAuthen'))
    next();
  },
  name: 'manageNavBar',
  data(){
      return{
        businessTypes: [],
        navItems: [],
        collapse: false,
        updateId: '',
        updateName: '',
        businessTypeSelected: '',
        active:''
      }
  },
  mounted(){
    this.getBussinessType();
    this.getNavItem();
  },
  methods:{
    async getBussinessType(){
      this.businessTypes = await StoreService.getAllBussinessType();
    },
    updateNavItem(event){
      let index = event.target.value;
        try{
          firebase
                .database()
                .ref("Nav/"+ this.updateId)
                .update({lable: this.businessTypes[index].businessTypeName, id: this.businessTypes[index].businessTypeID });
            alert("update thành công");
          }
          catch(err){
            console.log(err);
        }
      },
    deleteNavItem(id){
    try{
      if(confirm('Bạn có muốn xóa mục này???'))
      {
         firebase
            .database()
            .ref("Nav/"+ id).remove();
          alert("delete thành công");
      }
      else{
        return;
      }
      }
      catch(err){console.log(err)}
    },
    addNavItem(event){
        let index = event.target.value;
        index = parseInt(index);
        const nav = {
                lable: this.businessTypes[index].businessTypeName,
                id: this.businessTypes[index].businessTypeID,
          };
          firebase
            .database()
            .ref("Nav")
            .push(nav);
      alert("Thêm thành công");
    },
    getNavItem(){
      const navRef = firebase.database().ref("Nav");
            navRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){
              let items = [];
              Object.keys(data).forEach(key => {
                    items.push({
                    navId: key,
                    id:  data[key].id,
                    lable: data[key].lable,
                    });
                });
                this.navItems = items;
            }
            else{
             this.navItems =[];
            }
          });
      },
    },
}
</script>

<style>
.navItems{
  border: none;
  background: lightblue;
  margin: 0 10px 0 0;
}
.selectBox{
height:35px;border-radius:4px; border: 1px solid #D3D3D3; float: right;
}
.selectLable{
  padding: 5px;
  float: right;
}
.updateNav{
  padding: 10px;
  width: 100%;
}
.activeNav{
  border: steelblue 2px solid;
  font-weight: bold;
}
</style>