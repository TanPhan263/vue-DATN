<template>
<CCol>
    <CModal
    title="Thêm tỉnh"
    :show.sync="addModal"
    color="primary"
    @update:show="closeModal">
    <CInput label="Tên key" v-model="apikeyName"/>
    <CInput label="Key" v-model="apikeyValue"/>
    </CModal>
  <CCard>
      <CCardHeader>
          <strong>Danh sách apikey</strong>
          <CButton style="float:right" @click="addModal= true" color="primary"> Thêm Key </CButton>
      </CCardHeader>
      <CCardBody style="height: 300px; overflow-y:scroll">
        <div v-for="(item, index) in listApikey" :key="index" class="progress-group" style="border-bottom: 1px solid #e6e6e6">
            <div class="progress-group-header">
                <i class="fas fa-key" style="font-size:17px;margin-right: 20px;padding-left: 5px"></i>
                <span class="title" style="font-weight: bold">{{item.name}}</span>
                <span class="ml-auto font-weight-bold">
                <CButtonGroup style="float:right" size="sm">
                <CButton v-if="item.id === apiKey.id" color="info">Used</CButton>
                <CButton v-else @click="updateKey(item.id)" color="success">Use</CButton>
                <CButton @click="deleteKey(item.id)" color="danger">Delete</CButton>
                </CButtonGroup>
                </span>
            </div>
                {{item.apikey}}
            </div>
      </CCardBody>
  </CCard>
  <CCard>
     <CCardHeader>
          <strong> API key đang sử dụng: </strong> <p style="float:right"> <strong> {{apiKey.name}} : </strong> {{apiKey.apikey}} </p>
      </CCardHeader>
      <CCardBody>
          <HereMap/>
      </CCardBody>
  </CCard>
</CCol>
</template>

<script>
import firebase from '@/firebase/init.js';
import HereMap from '../../user/homepage/HereMap.vue'
export default {
    name:'HereMapApiKey',
    components:{
        HereMap
    },
    data(){
        return{
            //add
            apikeyName:'',
            apikeyValue:'',
            addModal: false,
            apiKey:'',
            listApikey:[],
        }
    },
    mounted(){
        this.getKeys();
    },
    methods: {
        getKeys(){
            this.apiKey = '';
            const apiRef = firebase.database().ref("HereMap/ListApi/");
            apiRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){
            let apikeys = [];
            Object.keys(data).forEach(key => {
                if(data[key].status == 1){this.apiKey = {
                    id : key,
                    name: data[key].name,
                    apikey: data[key].apikey,
                    status: data[key].status
                    }
                }
                apikeys.push({
                    id : key,
                    name: data[key].name,
                    apikey: data[key].apikey,
                    status: data[key].status
                    });
                });
                this.listApikey = apikeys
            }
            else{
            this.listApikey='';
            }
          });
        },
        updateKey(newid){
            try{
            if(this.apiKey.id){
            firebase
                .database()
                .ref("HereMap/ListApi/" + this.apiKey.id)
                .update({status: 0 });
            }
            firebase
                .database()
                .ref("HereMap/ListApi/" + newid)
                .update({status: 1 });
            alert("sử dụng thành công");
            this.getKeys();
            }
            catch(err){
                console.log(err);
            }
        },
        addKey(){
            try{
                const apikey = {
                    name: this.apikeyName,
                    apikey: this.apikeyValue,
                    status: 0
                };
                firebase
                    .database()
                    .ref("HereMap/ListApi/")
                    .push(apikey);
                alert('Thêm thành công');
                this.getKeys();
                this.apikeyValue = '';
                this.apikeyName = '';
            }
            catch(err){
                console.log(err);
            }
        },
        deleteKey(id){
            if(confirm('Bạn chắc chắn muốn xóa???')){
            firebase
                .database()
                .ref("HereMap/ListApi/"+ id).remove();
                alert("delete thành công");
                this.getKeys();
            }
            else return;
        },
        closeModal(status, evt, accept) { if (accept) { 
            this.addKey();
        } 
        },
    },
}
</script>

<style>

</style>