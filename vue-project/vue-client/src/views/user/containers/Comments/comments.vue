<template>
<div>
	<div>
		<div class="microsite-gallery" style="overflow: visible; min-height: 220px; margin-bottom:15px" >
		<div class="microsite-professional-photo" style="overflow: visible;">
            <div class="microsite-box-heading">
              <a href="" style="color: #333">HÌNH ẢNH TỪ KHÁCH HÀNG</a>
            </div>
            <div v-for="(dish,index) in commentList " v-bind:key="index" class="prof-photos-items" style="overflow: visible;">
				<div v-if="dish.image" class="microsite-professional-photo-item" style="overflow: visible;">
					<div  class="popup"> 
						<img style="width: 225px; height: 150px"
						:src="dish.image"
					/>
					<div @click="openPopup('myPopup'+ index)" class="middle" @mouseleave="closePopup('myPopup'+ index)">
						<div class="text">View Image</div>
					</div>
					<span class="popuptext" style="margin-right: 100px" :id="'myPopup'+ index"><img height="500" width="800"  :src="dish.image" ></span>
					</div>
				</div>
              <!-- <div v-if="dish.image" class="microsite-professional-photo-item">
				<a >
                  <img style="width: 200px; height: 150px"
                    :src="dish.image"
                  />
                </a>
			  </div> -->
                <!-- <a >
                  <img style="width: 200px; height: 150px"
                    :src="dish.image"
                  />
                </a>
              </div>
			  <div class="zoom" style="z-index: 10">
                <a >
                  <img
                    :src="dish.image"
                  />
                </a>
              </div> -->
            </div>
          </div>
        </div>
	</div>	
	 <div class="microsite-gallery" >
          
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
			<div class="col-sm-12" style="padding: 20px;">
				<div class="review-block">
					<div v-for="(comment, index) in commentList" :key="index" class="row" style="margin-top:15px;">
						<div style="border: 1px solid #efefef" class="row" v-if="comment.parentComment_ID===''">
							<div class="col-sm-12">
								<div class="review-block-rate">
									<img v-if="comment.userPicture != ''"  class="review-block-name-img" :src="comment.userPicture">
									<img v-else  class="review-block-name-img" src="http://dummyimage.com/60x60/666/ffffff&text=No+Image" >
									<div class="review-block-name"><a>{{comment.userName}}</a>
									<b-form-rating style="width: 150px; float:right" inline id="rating-disabled" :value="comment.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
									<div class="review-block-date">{{comment.date}}</div>
								</div>
							</div>
							<div class="col-sm-12" >
								<div class="review-block-description"><p style="width:auto">{{comment.content}}</p></div>
								<div v-if="comment.image != null" class="review-block-description-img"><img :src="comment.image"></div>
								<div class="review-block-rate"  style="margin-top: 5px;">
									<div class="review-block-rep" style="font-weight: bold"><a @click="getParentID(comment.commentID)"><i class="fas fa-comments"></i>Trả lời</a></div>
								</div>						
							</div>
							<div v-for="(comment2,index2) in commentList" :key="index2" class="row">
								<div class="row" v-if="comment2.parentComment_ID===comment.commentID" style="margin-top:15px; margin-left:63px;">
									
									<div class="col-sm-11" style="border-left: 3px solid #DCDCDC" >
										<div  class="review-block-rate" >
											<img v-if="comment2.userPicture != ''" class="review-block-name-img" :src="comment2.userPicture">
											<img v-else class="review-block-name-img" src="http://dummyimage.com/60x60/666/ffffff&text=No+Image">
											<div class="review-block-name-child"><a v-if="comment2.userName">{{comment2.userName}} </a><b-form-rating style="width: 150px; float:right;" inline id="rating-disabled" :value="comment2.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
											<div class="review-block-date">{{comment2.date}} {{index2}}</div>
										</div>
									</div>
									<div class="col-sm-11" style="border-left: 3px solid #DCDCDC;">
										<div class="review-block-description"><p style="width:107%">{{comment2.content}}</p></div>
										<div v-if="comment2.image != ''" class="review-block-description-img"><img :src="comment2.image"></div>
									</div>
								</div>
									
							</div>
						</div>
					</div>
				</div>
				<button style=" width:100%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 20px" @click="isLoggedin" type="button" data-toggle="modal" data-target="#exampleModal">
						Thêm nhận xét
					</button>
			</div>
		</div>
		</div>
	</div>
</div>
</template>
<script>
import firebase from 'firebase'
import CommentService from '@/services/CommentService.js';
import StoreService from '@/services/StoreService.js';
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
			readonly: false,
			isPopup : false
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
            openPopup(name) {
				if(this.isPopup == false){
				this.isPopup = true;
				var popup = document.getElementById(name);
				popup.classList.toggle("show");
				}
			},
			closePopup(name) {
				if(this.isPopup == true){
					var popup = document.getElementById(name);
					popup.classList.toggle("show");
					this.isPopup = false;
				}
			},
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