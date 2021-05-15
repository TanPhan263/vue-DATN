<template>
<div>
	 <div class="microsite-gallery">
          <div class="microsite-professional-photo">
            <div class="microsite-box-heading">
              <a href="" style="color: #333">HÌNH ẢNH TỪ KHÁCH HÀNG</a>
            </div>
            <div v-for="(dish,index) in commentList " v-bind:key="index" class="prof-photos-items">
              <div v-if="dish.image" class="microsite-professional-photo-item">
                <a >
                  <img
                    :src="dish.image"
                  />
                </a>
              </div>
			  <div class="zoom" style="z-index: 2">
                <a >
                  <img
                    :src="dish.image"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
		<div id="comment" class="microsite-gallery" style="margin-top: 15px">
		<div class="microsite-box-heading">
		</div> 
		<div class="row" style="margin: 0 auto;">
			<div class="col-sm-5">
				<h1 style="font-weight: bold;text-align:center; font-size:55px; margin-bottom:10px;">{{ Math.ceil(averageRate*100)/100}}<p style="font-size: 15px; font-style: italic;" v-if="value">{{commentList.length}} (Tổng số đánh giá)</p></h1>
					<b-form-rating v-model="averageRate" size="lg" variant="warning" class="mb-2" :readonly="true"></b-form-rating>
			</div>
				<div class="col-sm-7">
					<div class="row">
						<p  style="margin-right:5px;font-size: 15px;">5 <CIcon height="20" name="cil-star"/></p>
						<CProgress
							style="width: 500px;"
							:value="rate5" :max="commentList.length"
							color="success"
							:striped="striped"
							class="mb-2"
						/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">4 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						style="width: 500px;"
						:value="rate4" :max="commentList.length"
						color="info"
						:striped="striped"
						class="mb-2"
					/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">3 <CIcon height="20" name="cil-star"/></p>
					<CProgress
					style="width: 500px;"
						:value="rate3" :max="commentList.length"
						color="warning"
						:striped="striped"
						class="mb-2"
					/>
					</div>
					<div class="row">
						<p style="margin-right:5px; font-size: 15px;">2 <CIcon height="20" name="cil-star"/></p>
					<CProgress
					style="width: 500px;"
						:value="rate2" :max="commentList.length"
						color="danger"
						:striped="striped"
						class="mb-2"
					/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">1 <CIcon height="20" name="cil-star"/></p>
					<CProgress
					style="width: 500px;"
						:value="rate1" :max="commentList.length"
						color="danger"
						:striped="striped"
						class="mb-2"
					/>
					</div>
				</div>	
			<transition v-if="active">
				<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container">
					<div class="modal-header">
						<slot name="header">
						<h5>ĐÁNH GIÁ QUÁN ĂN</h5>
						<i v-on:click="active=false" class="fa fa-window-close" style="float: right; font-size: 20px;"></i>
						</slot>
					</div>

					<div class="modal-body">
						<slot name="body">
						<b-form-rating v-model="rateSubmit" size="lg" no-border variant="warning" class="mb-2"></b-form-rating>
						<textarea v-model="commentContent" style="border-radius:10px;height: 150px; width: 100%; padding:5px;border:1px solid #ddd;">
							</textarea>
						<label for="files">Đính kèm ảnh</label>
						<input id="files" type="file"  @change="previewImage" >
						</slot>
					</div>
					<div class="modal-footer" style="background: #fff; border:none">
						<button style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: darkblue; color: white; border: none; font-size: 15px" @click="responseComment()">
							Submit
						</button>
						<button  style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 15px" @click="active=false">
							Cancel
						</button>
					</div>	
					</div>
				</div>
				</div>
			</transition>
			<div class="col-sm-12" style="margin-left: 40px;">
				<div class="review-block">
					<div v-for="(comment, index) in commentList" :key="index" class="row" style="margin-top:15px;">
						<div class="row" v-if="comment.parentComment_ID===''">
							<div class="col-sm-2">
								<img v-if="comment.userPicture != ''" style="width:55px ; height: 55px;border-radius:50%;" :src="comment.userPicture">
								<img v-else style="border-radius:50%;" src="http://dummyimage.com/60x60/666/ffffff&text=No+Image" class="img-rounded">
							</div>
							<div class="col-sm-9"  style="">
								<div  class="review-block-rate">
									<div class="review-block-name"><a>{{comment.userName}}</a> <b-form-rating style="width: 150px; float:right;" inline id="rating-disabled" :value="comment.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
									<div class="review-block-date">{{comment.date}}</div>
								</div>
							<div class="review-block-description">{{comment.content}}</div>
							<div v-if="comment.image != null" class="review-block-description"><img width="100" height="100" :src="comment.image"></div>
							<div  class="review-block-rate">
									<div class="review-block-name"><a @click="getParentID(comment.commentID)">Trả lời</a></div>
							</div>						
							</div>
							<div v-for="(comment2,index2) in commentList" :key="index2" class="row">
								<div v-if="comment2.parentComment_ID===comment.commentID" class="row" style="margin-top:15px;">
									<div class="col-sm-2"></div>
									<div class="col-sm-2">
										<img  v-if="comment2.userPicture != ''" style="width:55px ; height: 55px;border-radius:50%;" :src="comment2.userPicture" class="img-rounded">
										<img v-else style="border-radius:50%;" src="http://dummyimage.com/60x60/666/ffffff&text=No+Image" class="img-rounded">
									</div>
									<div class="col-sm-8" style=" boder-radius:10px;">
										<div  class="review-block-rate">
											<div  class="review-block-name"><a v-if="comment2.userName">{{comment.userName}} </a><b-form-rating style="width: 150px; float:right;" inline id="rating-disabled" :value="comment2.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
											<div class="review-block-date">{{comment2.date}} {{index2}}</div>
										</div>
										<div class="review-block-description">{{comment2.content}}</div>
										<div v-if="comment2.image != ''" class="review-block-description"><img width="100" height="100" :src="comment2.image"></div>
										<!-- <div  class="review-block-rate">
											<div class="review-block-name"><a @click="getParentID(comment.commentID)">Trả lời</a></div>
										</div>	 -->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<button style=" width:90%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 20px" @click="isLoggedin" type="button" data-toggle="modal" data-target="#exampleModal">
						Thêm nhận xét
					</button>
			</div>
		</div>
		</div>
</div>
</template>

<script>
import firebase from 'firebase'
import { freeSet } from '@coreui/icons'
const baseUrl='https://localhost:44398/api';
import CommentService from '@/services/CommentService.js';
import StoreService from '@/services/StoreService.js';
import UserService from '@/services/UserService.js';
import AuthService from '@/services/AuthService.js';
import { loadOptions } from '@babel/core';
export default {
	data() {
		return{
			imageData: null,
			commentPicture: null,
			striped: true,
			userCommentParent: [],
			commentRate:'',
			commentList:[],
			parentCommentID:'', 
			value:[],
			rate:0,
			averageRate:0,
			rateSubmit:0,
			rate5:0,
			rate4:0,
			rate3:0,
			rate2:0,
			rate1:0,
			user:'',
			token:'',
			commentContent:'',
			active:false,
			readonly: false
		}
	},
	props:{
		storeID: String,
	},
	created(){
		this.getComments();
		this.user=localStorage.getItem('userInfor');
		this.user=JSON.parse(this.user);
		this.token=localStorage.getItem('isAuthen');
	},
	mounted(){
	},
	methods:{
		async getComments(){
			try{
				this.commentList = await CommentService.getCommentByStore(this.storeID);
				let rate = 0;
				this.commentList.forEach(element => {
						rate+=parseInt(element.ratePoint)
						switch(parseInt(element.ratePoint)){
							case 1: this.rate1+=1; break;
							case 2: this.rate2+=1; break;
							case 3: this.rate3+=1; break;
							case 4: this.rate4+=1; break;
							case 5: this.rate5+=1; break;
						}
						});
				this.averageRate=rate/this.commentList.length;
				// this.commentList.forEach( element =>{
				// 	UserService.getUserbyIDnoToken_pic(element.userID).then(x =>
				// 	{
				// 		const temp={
				// 		userName: x.userName,
				// 		picture: x.picture,
				// 		commentID: element.commentID
				// 		}
				// 		this.userCommentParent.push(temp);
				// 	});
				// });
				// console.log(this.userCommentParent[0])
			}
			catch{}
		},
		responseComment(){
			this.active=true;
				if(this.parentCommentID=='') this.parentCommentID=null;
			this.onUpload();
		},
		previewImage(event){
			this.commentPicture=null;
			this.imageData= event.target.files[0];
		},
		onUpload(){
			if(this.imageData == null) this.submitRateComment();
			else{
				const storageRef = firebase.storage().ref(`image/comment/${this.imageData.name}`).put(this.imageData);
				storageRef.on(`state_change`, snapshot => {
				},error =>{console.log(error.message)},
				()=> {
					storageRef.snapshot.ref.getDownloadURL().then((url) => {
						this.commentPicture = url;
						this.submitRateComment();
						})
					}
				)
			}
		},
		async submitRateComment(){
			this.active=false;
			var date = new Date();
			const comment =  {
				content: this.commentContent,
				date: date.toString().slice(4,15),
				image: this.commentPicture,
				userID: this.user.userID,
				storeID:  this.storeID,
				parentComment_ID: this.parentCommentID,
				userName: this.user.userName,
				userPicture: this.user.picture,
				ratePoint: this.rateSubmit.toString(),
			};
			const response = await CommentService.submitComment(this.token,comment);
			console.log(response)
			// const rate=  {
			// 	ratePoint: this.rateSubmit.toString(),
			// 	storeID: this.storeID,
			// 	userID: this.user.userID,
			// 	CommentID: response.toString()
			// };
			// const respone2 = await CommentService.submitRate(this.token,rate);
			// console.log(respone2);
			// this.getRate();
			this.getComments();
			const response3 = await StoreService.updateRate(this.storeID,this.getAverageRate(this.rateSubmit));
			console.log(response3);
		},
		// async getRate(){
		// 	try{
		// 		let rate = 0;
		// 		this.value= await CommentService.getRateByStore(this.storeID)
		// 		this.value.forEach(element => {
		// 				rate+=parseInt(element.ratePoint)
		// 				switch(parseInt(element.ratePoint)){
		// 					case 1: this.rate1+=1; break;
		// 					case 2: this.rate2+=1; break;
		// 					case 3: this.rate3+=1; break;
		// 					case 4: this.rate4+=1; break;
		// 					case 5: this.rate5+=1; break;
		// 				}
		// 				});
		// 		this.averageRate=rate/this.commentList.length;
		// 	}
		// 	catch{
		// 	}
		// },
		getParentID(index){
			this.active=true;
			this.parentCommentID=index;
		},
		getCommentRate(index){
			var temp = 0 ;
			this.value.forEach(element => {
				if(element.commentID==index)
					temp = parseInt(element.ratePoint) ;
			});
			return temp;
		},
		isLoggedin(){
			if(this.token == null || this.token == 'Đăng nhập thất bại' || !AuthService.isAuthented(localStorage.getItem('isAuthen'))) {
				alert("Bạn cần đăng nhập để thự hiện chức năng này");
				return;
			}
			this.active=true;
		},
		getAverageRate(rate){
			var total = 0;
			this.commentList.forEach(element => {
						total+=parseInt(element.ratePoint);
			});
			console.log(total);
			return (total+ parseInt(rate))/(this.commentList.length + 1);
		},
		// getName(index){
		// 	var temp = 'unknow'
		// 	this.userCommentParent.forEach(element => {
		// 		if(element.commentID == index)
		// 		{
		// 			temp = element.userName;
		// 		}
					
		// 	});
		// 	return temp;
		// },
		// getPicture(index){
		// 	var temp = "http://dummyimage.com/60x60/666/ffffff&text=No+Image"
		// 	this.userCommentParent.forEach(element => {
		// 		if(element.commentID == index)
		// 		{
		// 			if(element.picture != '')
		// 			temp = element.picture;
		// 		}
					
		// 	});
		// 	return temp;
		// }
	}
}
</script>

<style>
@import url('../../../../assets/css/comments.css');
@import url('../../../../assets/css/bootstrap.min.css');
.center{
	display: block;margin-left: auto;margin-right: auto;
}
</style>