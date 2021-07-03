<template>
<div>
	<CoolLightBox 
	v-if="imgs"
      :items="imgs" 
      :index="index"
      loop
      @close="index = null">
    </CoolLightBox>
	<div>
	<div class="microsite-gallery" style="overflow: visible; min-height: 220px; margin-bottom:15px">
		<div class="microsite-professional-photo">
            <div class="microsite-box-heading">
              <a href="" style="color: #333">HÌNH ẢNH TỪ KHÁCH HÀNG</a>
            </div>
            <div v-for="(dish,index) in commentList" v-bind:key="index" class="prof-photos-items">
				<div @click="visible = true" v-if="dish.image" class="microsite-professional-photo-item">
					<img style="width: 225px; height: 150px"
					  :src="dish.image"
					  @click="setIndex(index)"
					/>
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
					<div class="row" >
						<p  style="margin-right:5px;font-size: 15px;">5 <CIcon height="20" name="cil-star"/></p>
						<CProgress
							:value="rate5" :max="commentList.length"
							color="success"
							:striped="striped"
							class="mb-2 col-11"
						/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">4 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						:value="rate4" :max="commentList.length"
						color="info"
						:striped="striped"
						class="mb-2 col-11"
					/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">3 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						:value="rate3" :max="commentList.length"
						color="warning"
						:striped="striped"
						class="mb-2 col-11"
					/>
					</div>
					<div class="row">
						<p style="margin-right:5px; font-size: 15px;">2 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						:value="rate2" :max="commentList.length"
						color="danger"
						:striped="striped"
						class="mb-2 col-11"
					/>
					</div>
					<div class="row">
						<p style="margin-right:5px; font-size: 15px;">1 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						:value="rate1" :max="commentList.length"
						color="danger"
						:striped="striped"
						class="mb-2 col-11"
					/>
					</div>
				</div>	
			<transition v-if="active">
				<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container"  style="width: 35%">
					<div class="modal-header" style="background: red; color: white">
						<slot name="header">
						<h5>ĐÁNH GIÁ QUÁN ĂN</h5>
						<i v-on:click="active=false" class="fas fa-times" style="float: right; font-size: 20px;"></i>
						</slot>
					</div>

					<div class="modal-body">
						<slot name="body" >
						<b-form-rating v-model="rateSubmit" show-value no-border variant="warning" class="mb-2"></b-form-rating>
						<textarea v-model="commentContent" style="border-radius:5px;height: 150px; width: 100%; padding:5px;border:1px solid #ddd;">
							</textarea>
						<label for="files">Đính kèm ảnh</label>
						<input id="files" type="file"  @change="previewImage" >
						</slot>
					</div>
					<div class="modal-footer" style="background: #fff; border:none">
						<button style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: darkblue; color: white; border: none; font-size: 15px" @click="responseComment()">
							Submit
						</button>
						<button  style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 15px" @click="cancel">
							Cancel
						</button>
					</div>	
					</div>
				</div>
				</div>
			</transition>
<!--EditComment-->
			<transition v-if="activeEdit">
				<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container"  style="width: 35%">
					<div class="modal-header" style="background: red; color: white">
						<slot name="header">
						<h5>ĐÁNH GIÁ QUÁN ĂN</h5>
						<i v-on:click="active=false" class="fas fa-times" style="float: right; font-size: 20px;"></i>
						</slot>
					</div>

					<div class="modal-body">
						<slot name="body" >
						<b-form-rating v-model="rateSubmit" show-value no-border variant="warning" class="mb-2"></b-form-rating>
						<textarea v-model="commentContent" style="border-radius:5px;height: 150px; width: 100%; padding:5px;border:1px solid #ddd;">
							</textarea>
						<label for="files">Đổi ảnh</label>
						<input id="files" type="file"  @change="previewImage" >
						<img :src="commentPicture" alt="">
						</slot>
					</div>
					<div class="modal-footer" style="background: #fff; border:none">
						<button style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: darkblue; color: white; border: none; font-size: 15px" @click="responseComment()">
							Submit
						</button>
						<button  style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 15px" @click="cancel">
							Cancel
						</button>
					</div>	
					</div>
				</div>
				</div>
			</transition>
<!--end-EditComment-->
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
									<div class="review-block-rep" style="font-weight: bold"><a @click="getParentID(comment.commentID)"><i class="fas fa-comments"></i> Trả lời  </a>
									<a v-show="user && comment.userID === user.userID" class="user-edit" @click="deleteComment(comment.commentID)"><i class="fas fa-trash-alt"></i> Xóa </a>
									<a v-show="user && comment.userID === user.userID" class="user-edit" @click="openEdit(comment)"><i class="fas fa-edit"></i> Chỉnh sửa </a>
									</div>
								</div>						
							</div>
							<div v-for="(comment2,index2) in commentList" :key="index2" class="row">
								<div class="row" v-if="comment2.parentComment_ID===comment.commentID" style="margin-top:15px; margin-left:63px;">
									
									<div class="col-sm-11" style="border-left: 3px solid #DCDCDC" >
										<div  class="review-block-rate" >
											<img v-if="comment2.userPicture != ''" class="review-block-name-img" :src="comment2.userPicture">
											<img v-else class="review-block-name-img" src="http://dummyimage.com/60x60/666/ffffff&text=No+Image">
											<div class="review-block-name-child"><a v-if="comment2.userName">{{comment2.userName}} </a><b-form-rating style="width: 150px; float:right;" inline id="rating-disabled" :value="comment2.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
											<div class="review-block-date">{{comment2.date}}</div>
										</div>
									</div>
									<div class="col-sm-11" style="border-left: 3px solid #DCDCDC;">
										<div class="review-block-description"><p style="width:107%">{{comment2.content}}</p></div>
										<div v-if="comment2.image != ''" class="review-block-description-img"><img :src="comment2.image"></div>
										<div class="review-block-rate"  style="margin-top: 5px;">
									<div class="review-block-rep" style="font-weight: bold" v-show="user && comment2.userID === user.userID" >
									<a class="user-edit" @click="deleteComment(comment2.commentID)"><i class="fas fa-trash-alt"></i> Xóa </a>
									<a class="user-edit" @click="openEdit(comment2)"><i class="fas fa-edit"></i> Chỉnh sửa </a>
									</div>
								</div>	
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
import firebase from '@/firebase/init.js';
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import CommentService from '@/services/CommentService.js';
import StoreService from '@/services/StoreService.js';
import AuthService from '@/services/AuthService.js';
import UserService from '@/services/UserService.js';
import { loadOptions } from '@babel/core';
export default {
	components:{
		CoolLightBox
	},
	data() {
		return{
			imageData: null,
			commentPicture: null,
			striped: true,
			userCommentParent: [],
			// commentRate:'',
			commentList:[],
			imgs:[],
			index: null,
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
			activeEdit:false,
			readonly: false,
			visble: false
		}
	},
	props:{
		storeID: String,
	},
	created(){
		this.getComments();
		this.getUser();
		this.token=localStorage.getItem('isAuthen');
	},
	mounted(){
	},
	methods:{
		setIndex(index) {
			this.index = index;
		},
		async getUser(){
		try{
			if(localStorage.getItem('isAuthen')){
				let infor = await UserService.getInfo(localStorage.getItem('isAuthen'));
				if(infor[0] == "Bạn cần đăng nhập"){
					AuthService.logout();
					return;
				}
				this.user = infor[0];
				console.log(this.user)
				return;
			}
			this.isLoggedin = false;
		}
		catch(err){console.log(err)}
		},
		async getComments(){
		try{
			this.rate1 = 0; this.rate2 = 0; this.rate3 = 0; this.rate4=0; this.rate5 = 0;
			this.commentList = await CommentService.getCommentByStore(this.storeID);
			let rate = 0;
			this.commentList.forEach(element => {
					this.imgs.push(element.image);
					rate+=parseInt(element.ratePoint);
					switch(parseInt(element.ratePoint)){
						case 1: this.rate1+=1; break;
						case 2: this.rate2+=1; break;
						case 3: this.rate3+=1; break;
						case 4: this.rate4+=1; break;
						case 5: this.rate5+=1; break;
					}
					});
			this.averageRate=rate/this.commentList.length;
			const response3 = await StoreService.updateRate(this.storeID,this.averageRate);
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
		catch(err){console.log(err)}
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
			try{
				if(this.imageData == null){
					if(this.activeEdit) this.editComment();
					else this.submitRateComment();
				}
				else{
					const storageRef = firebase.storage().ref(`image/comment/${this.imageData.name}`).put(this.imageData);
					storageRef.on(`state_change`, snapshot => {
					},error =>{console.log(error.message)},
					()=> {
						storageRef.snapshot.ref.getDownloadURL().then((url) => {
							this.commentPicture = url;
							if(this.activeEdit) this.editComment();
							else this.submitRateComment();
							})
						}
					)
				}
			}
			catch(err){ console.log(err)}
		},
		async submitRateComment(){
			try{
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
				this.getComments();
			}
			catch(err){
				console.log(err)
			}
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
		openEdit(comment){
			this.parentCommentID=comment.parentComment_ID;
			this.commentContent = comment.content;
			this.commentPicture = comment.image;
			this.rateSubmit = parseInt(comment.ratePoint);
			this.activeEdit=true;
		},
		cancel(){
			this.parentCommentID='';
			this.commentContent = '';
			this.commentPicture = '';
			this.rateSubmit = 0;
			this.activeEdit=false;
			this.active= false;
		},
		async editComment(id){
			try{
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
				const response = await CommentService.editComment(id,comment,this.token);
				console.log(response);
				this.getComments();

			}
			catch(err){
				console.log(err)
			}
		},
		async deleteComment(id){
			try{
				if(confirm('Bạn có muốn xóa bình luận này?'))
				{
					const response = await CommentService.deleteComment(id, this.token);
					alert(response)
				}
			}catch{}
		},
	}
}
</script>

<style>
@import url('../../../assets/css/comments.css');
@import url('../../../assets/css/bootstrap.min.css');
.center{
	display: block;margin-left: auto;margin-right: auto;
}
.user-edit{
	float: right; cursor: pointer; margin-right: 5px;
}
</style>