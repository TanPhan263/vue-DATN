<template>
<CCol>
    <CModal
    title="Thêm Key"
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
          <HereMap v-if="render==true && this.apiKey" v-bind:apikey="apiKey.apikey"/>
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
            render: false,          //biến render component HereMap
            apikeyName:'',          // thuộc tính cua apikey
            apikeyValue:'',
            addModal: false,        //biến mở hộp thoại add apikey 
            apiKey:'',              //apikey đang được dùng
            listApikey:[],          //danh sách apikey
        }
    },
    mounted(){
        this.getKeys();             //lấy danh sách apikey từ firebase
    },
    methods: {
        getKeys:_.debounce(function(){   //lấy danh sách apikey từ firebase
            this.apiKey = '';
            const apiRef = firebase.database().ref("HereMap/ListApi/");
            apiRef.on("value", snapshot => {
            let data = snapshot.val();
            if(data){
            let apikeys = [];
            Object.keys(data).forEach(key => {
                if(data[key].status == 1){this.apiKey = { //nếu status = 1 thì là key đang sử dụng
                    id : key,                              //gán dữ liệu vào biến apiKey
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
                this.listApikey = apikeys                  //gán danh sách apikey vừa lấy được vào ListApikey
            }
            else{
                this.listApikey='';
            }
          });
           this.render = true;
        },1000),
        updateKey(newid){                                   //update apikey mới thành đang sử dụng
            try{
            this.render = false;
            if(this.apiKey.id){                             //update status của apikey cũ thành 0 là không sử dụng
            firebase
                .database()
                .ref("HereMap/ListApi/" + this.apiKey.id)
                .update({status: 0 });
            }
            firebase
                .database()
                .ref("HereMap/ListApi/" + newid)
                .update({status: 1 });                      //update status của apikey mới thành 1 là đang sử dụng
            alert("sử dụng thành công");
            this.getKeys();
            }
            catch(err){
                console.log(err);
            }
        },
        addKey(){                                           //thêm apikey mới 
            try{
                const apikey = {                            //tạo một đối tượng apikey
                    name: this.apikeyName,
                    apikey: this.apikeyValue,
                    status: 0
                };
                firebase                                    //thêm vào firebase
                    .database()
                    .ref("HereMap/ListApi/")
                    .push(apikey);
                alert('Thêm thành công');
                this.getKeys();
                this.apikeyValue = '';                     //reset các biến
                this.apikeyName = '';
            }
            catch(err){
                console.log(err);
            }
        },
        deleteKey(id){                                      //xóa apikey bằng id
            if(confirm('Bạn chắc chắn muốn xóa???')){
            firebase
                .database()
                .ref("HereMap/ListApi/"+ id).remove();
                alert("delete thành công");
                this.getKeys();
            }
            else return;
        },
        closeModal(status, evt, accept) { if (accept) {  //hàm bắt sự kiện khi modal đóng
            this.addKey();                                //nếu oke thì tiến hành add key
            }
            else{
            this.apikeyValue = '';                     //reset các biến
            this.apikeyName = '';
            } 
        },
    },
}
</script>

<style>

</style>