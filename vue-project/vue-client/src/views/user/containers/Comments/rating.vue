<template>
   	<div class="row">
			<div class="col-sm-8">
        <h1 style="font-weight: bold;text-align:center; font-size: 55px;">{{ Math.ceil(averageRate*100)/100}}</h1>
				<b-form-rating v-model="averageRate" size="lg" variant="warning" class="mb-2"></b-form-rating>
			</div>
      <button @click="active=true" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Đánh giá
      </button>
      <transition v-if="active">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  <h3>ĐÁNH GIÁ QUÁN ĂN</h3>
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                  <b-form-rating v-model="rateSubmit" size="lg" variant="warning" class="mb-2"></b-form-rating>
                  <textarea v-model="commentContent" style="border-radius:10px; padding:5px;border:1px solid  #ddd;" rows="8" cols="66">
                    </textarea>
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <button class="btn btn-primary" @click="submitRateComment">
                    Submit
                  </button>
                  <button class="btn btn-warning" @click="active=false">
                    Cancel
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
		</div>	
</template>

<script>
const baseUrl='https://localhost:44398/api';
export default {
data(){
	return{
    value:'',
    rate:0,
    averageRate:0,
    rateSubmit:0,
    rate5:10,
    rate4:2,
    rate3:3,
    rate2:4,
    rate1:5,
    user:'',
    commentContent:'',
    active:false
	}
},
props:{
  storeID: String,
},
mounted(){
  this.getRate();
  this.user=localStorage.getItem('userInfor');
  this.user=JSON.parse(this.user)
},
methods:{
  submitRateComment(){
    var date = new Date()
    const rate=  {
        ratePoint: this.rateSubmit.toString(),
        storeID: this.storeID,
        userID: this.user.userID
    };
    const comment =  {
        content: this.commentContent,
        date: date.toString(),
        image: null,
        userID: this.user.userID,
        storeID:  this.storeID,
        parentComment_ID: null
      };
     this.$http.post(baseUrl +'/ListOfReview/CreateListOfReviews',rate,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.value = response.data;
      })
      this.$http.post(baseUrl +'/Comment/CreateComment',comment,{ headers: {"Authorization" : `Bearer ${localStorage.getItem('isAuthen')}`}}).then(response => {
            this.value = response.data;
      })
      this.updateRate()
      this.active=false;
  },
  getRate(){
    this.$http.get(baseUrl +'/ListOfReview/GetByID?id='+this.storeID).then(response => {
            this.value = response.data;
            this.value.forEach(element => {
              this.rate+=parseInt(element.ratePoint)
            });
            this.averageRate=this.rate/this.value.length;
      })
  },
  getRatePercent(){
  },
  addRate(){

  },
  updateRate() {
    this.rate+=this.rateSubmit
    this.averageRate=this.rate/(this.value.length+1)
  },
}
}
</script>

<style>
  @import url('../../../../assets/css/comments.css');
  .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
  font-size: 30px;
  margin: 0 auto;
}

.modal-body {
  margin: 5px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>