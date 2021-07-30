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
        v-model="updateId"
        @change="updateNavItem($event)">
        <option v-for="(business,index) in businessTypes" v-bind:key="index" :value="business.businessTypeID">
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
        businessTypes: [],        //danh sách các loại hình quán
        navItems: [],             //danh sách các mục trên thanh menu
        updateId: '',             //id item cần update
        updateName: '',           //tên item cần update
        businessTypeSelected: '', //id loại hình quán dang được chọn
      }
  },
  mounted(){
    this.getBussinessType();     //lấy danh sách các loại hình quán
    this.getNavItem();           //lấy danh sách các mục trên thanh menu
  },
  methods:{
    async getBussinessType(){     //lấy danh sách các loại hình quán
      this.businessTypes = await StoreService.getAllBussinessType();
    },
    updateNavItem(event){         //update một mục trên thanh menu
      let index = event.target.value; //lấy vị trí của loại hình quán mới chọn
        try{
          firebase
            .database()           //update trên firebase
            .ref("Nav/"+ this.updateId)
            .update({lable: this.businessTypes[index].businessTypeName,
                     id: this.businessTypes[index].businessTypeID });
            alert("update thành công");
          }
          catch(err){
            console.log(err);
        }
      },
    deleteNavItem(id){                                //xóa 1 mục trên thanh menu
    try{
      if(confirm('Bạn có muốn xóa mục này???'))
      {
         firebase                                     //xóa trên firebase
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
    addNavItem(event){                                //thêm các mục trên thanh menu
        let index = event.target.value;
        index = parseInt(index);
        const nav = {                                 //tạo một đối tượng nav chứa các thông tin vừa nhập
          lable: this.businessTypes[index].businessTypeName,
          id: this.businessTypes[index].businessTypeID,
        };
        firebase                                       //thêm vào firebase 
          .database()
          .ref("Nav")
          .push(nav);
        alert("Thêm thành công");
    },
    getNavItem(){                                     //lấy danh sách các mục trên thanh menu
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
  margin: 10px 10px 0 0;
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