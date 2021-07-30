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
				<h1 style="font-weight: bold;text-align:center; font-size:55px; margin-bottom:10px;">{{ formatRate }}<p style="font-size: 15px; font-style: italic;" v-if="rateList">{{rateList.length}} (Tổng số đánh giá)</p></h1>
					<b-form-rating class="mb-2" v-model="averageRate" size="lg" variant="warning" :readonly="true"></b-form-rating>
			</div>
				<div v-if="rateList" class="col-sm-7">
					<div class="row" >
						<p  style="margin-right:5px;font-size: 15px;">5 <CIcon height="20" name="cil-star"/></p>
						<CProgress
							style="width:500px"
							:value="rate5" :max="rateList.length"
							color="success"
							:striped="striped"
							class="mb-2"
						/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">4 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						style="width:500px"
						:value="rate4" :max="rateList.length"
						color="info"
						:striped="striped"
						class="mb-2"
					/>
					</div>
					<div class="row">
						<p  style="margin-right:5px; font-size: 15px;">3 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						style="width:500px"
						:value="rate3" :max="rateList.length"
						color="warning"
						:striped="striped"
						class="mb-2"
					/>
					</div>
					<div class="row">
						<p style="margin-right:5px; font-size: 15px;">2 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						style="width:500px"
						:value="rate2" :max="rateList.length"
						color="danger"
						:striped="striped"
						class="mb-2"
					/>
					</div>
					<div class="row">
						<p style="margin-right:5px; font-size: 15px;">1 <CIcon height="20" name="cil-star"/></p>
					<CProgress
						style="width:500px"
						:value="rate1" :max="rateList.length"
						color="danger"
						:striped="striped"
						class="mb-2"
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
						<b-form-rating v-if="checkRated(commentList.length,user.userID) && checkOwnerAdmin(user.userID)" v-model="rateSubmit" show-value no-border variant="warning" class="mb-2"></b-form-rating>
						<textarea v-model="commentContent" style="border-radius:5px;height: 150px; width: 100%; padding:5px;border:1px solid #ddd;">
							</textarea>
						<label for="files">Đính kèm ảnh</label>
						<input id="files" type="file"  @change="previewImage" >
						</slot>
					</div>
					<div class="modal-footer" style="background: #fff; border:none">
						<button style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: darkblue; color: white; border: none; font-size: 15px" @click="responseComment()">
							Bình luận
						</button>
						<button  style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 15px" @click="cancel">
							Hủy
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
						<i v-on:click="activeEdit=false" class="fas fa-times" style="float: right; font-size: 20px;"></i>
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
							Bình luận
						</button>
						<button  style="width:15%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 15px" @click="cancel">
							Hủy
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
									<b-form-rating v-if="checkRated(index,comment.userID) && checkOwnerAdmin(comment.userID)" style="width: 150px; float:right" inline id="rating-disabled" :value="comment.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
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
											<div class="review-block-name-child"><a v-if="comment2.userName">{{comment2.userName}} </a><b-form-rating v-if="checkRated(index2,comment2.userID) && checkOwnerAdmin(comment.userID)" style="width: 150px; float:right;" inline id="rating-disabled" :value="comment2.ratePoint" size="sm" variant="warning" class="mb-2" :readonly="true" no-border></b-form-rating></div>
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
				<button style=" width:100%; height:40px; border-radius: 5px;margin-top: 30px; background-color: red; color: white; border: none; font-size: 20px" @click="checkLoggedin" type="button" data-toggle="modal" data-target="#exampleModal">
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
			commentList:[],			//danh sách các comments
			rateList:[],			//danh sách các đánh giá		
			imgs:[],				//danh sách hình ảnh của comments
			index: null,			//thứ tự của hinh ảnh
			parentCommentID:'', 	//id của comment cha
			// value:[],
			//rate:0,					
			averageRate:0,			//điểm trung bình đánh giá của quán ăn
			rate5:0,				//số lượng đánh giá 5 sao
			rate4:0,				//số lượng đánh giá 4 sao
			rate3:0,				//số lượng đánh giá 3 sao
			rate2:0,				//số lượng đánh giá 2 sao
			rate1:0,				//số lượng đánh giá 1 sao
			user:'',				//người dùng 
			token:'',				//token
			commentContent:'',		//nội dung của comment
			rateSubmit:0,			//điểm mà người dùng đánh giá
			active:false,			//biến mở hộp thoại đánh giá 
			activeEdit:false,		//biến mở hộp thoại chỉnh sửa đánh giá 
			readonly: false,		//biến set chỉ đọc của b-form-rating
			visble: false
		}
	},
	computed:{
		formatRate(){ // hàm format điểm 
      		return Math.ceil((parseFloat(this.averageRate)*100))/100; 
    	}
	},
	props:{ //khai báo các biến đc truyền vào từ component cha
		storeID: String,
		storeRate: String,
		ownerID:String
	},
	created(){
		this.averageRate = this.storeRate;
		this.getComments();
		this.getUser();
		this.token=localStorage.getItem('isAuthen');
	},
	mounted(){
	},
	methods:{
		checkRated(index, id){//Kiểm tra đã đánh giá rồi thì sẽ không hiện đánh giá của những lần sau
			for(var i=0; i<index ; i++)
			{
				if(this.commentList[i].userID == id)
					return false
			}
			return true;
		},
		checkOwnerAdmin(id){  //Hàm kiếm tra amin và chủ quán thì không đc đánh giá 
			if(id == this.ownerID || id == '-M_UX0kqNgaXGTYa2_FJ')
				return false;
			return true;
		},
		setIndex(index) { 
			this.index = index;
		},
		async getUser(){	//Lấy thông tin user qua token
		 try{
			if(localStorage.getItem('isAuthen')){
				let infor = await UserService.getInfo(localStorage.getItem('isAuthen'));
				if(infor[0] == "Bạn cần đăng nhập"){
					this.isLoggedin =false;
					AuthService.logout();
					return;
				}
				this.user = infor[0];
				this.isLoggedin = true;
			}
			else this.isLoggedin = false;
		}
		catch(err){console.log(err)}
		},
		async getComments(){ //Hàm lấy Danh sách khuyến mãi ,rate và điểm trung bình 
		try{
			this.rate1 = 0; this.rate2 = 0; this.rate3 = 0; this.rate4=0; this.rate5 = 0;
			this.commentList = await CommentService.getCommentByStore(this.storeID);
			this.commentList.forEach(element =>{
				this.imgs.push(element.image);		//Lấy danh sách hình ảnh của comment
			})
			this.rateList = await StoreService.getListRate(this.storeID);
			this.rateList.forEach(element => {		//phân loại đánh giá theo sao
				switch(parseInt(element.ratePoint)){
					case 1: this.rate1+=1; break;
					case 2: this.rate2+=1; break;
					case 3: this.rate3+=1; break;
					case 4: this.rate4+=1; break;
					case 5: this.rate5+=1; break;
				}
			});
		}
		catch(err){console.log(err)}
		},
		responseComment(){
			this.active=true;
			if(this.parentCommentID=='') this.parentCommentID=null; //set ID comment cha = null nếu không trả lời comment nào 
			this.onUpload();
		},
		previewImage(event){
			this.commentPicture=null;
			this.imageData= event.target.files[0];
		},
		onUpload(){ //Hàm upload hình ảnh lên firebase và gọi api comment
			try{
				if(this.imageData == null){ //Nếu không có hình ảnh
					if(this.activeEdit) this.editComment(); //nếu đang mở edit comment thì sẽ gọi hàm edit comment
					else this.submitRateComment(); //nếu không thì gọi hàm comment
				}
				else{
					const storageRef = firebase.storage().ref(`image/comment/${this.imageData.name}`).put(this.imageData); //đưa hình ảnh lên firebase
					storageRef.on(`state_change`, snapshot => {
					},error =>{console.log(error.message)},
					()=> {
						storageRef.snapshot.ref.getDownloadURL().then((url) => {//trả về url của ảnh
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
				const comment =  { //tạo một đối tượng comment
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
				const response = await CommentService.submitComment(this.token,comment);//gọi api tạo comment mới 
				this.averageRate = await StoreService.updateRate(this.storeID); //update lại điểm của quán
				this.changeRate(this.averageRate); //đưa thông tin điêm mới cập nhật đến component cha là StoreDetail
				console.log(response)
				this.getComments(); //reload lại comment
			}
			catch(err){
				console.log(err)
			}
		},
		async editComment(id){ //Hàm update lị comment
			try{
				this.active=false;
				var date = new Date();
				const comment =  { //tạo một đối tượng comment
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
				const response = await CommentService.editComment(id,comment,this.token);//gọi api update
				this.averageRate = await StoreService.updateRate(this.storeID); //update lại điểm cua quán
				this.changeRate(this.averageRate);
				console.log(response);
				this.getComments();//reload comments

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
					this.averageRate = await StoreService.updateRate(this.storeID);
					this.changeRate(this.averageRate);
					alert(response)
				}
			}catch{}
		},
		getParentID(index){//nhấn vào nut trả lời sẽ mở hộp thoại comment và lấy ra Id của comment cần trả lời
			this.active=true;
			this.parentCommentID=index;
		},
		// getCommentRate(index){
		// 	var temp = 0 ;
		// 	this.value.forEach(element => {
		// 		if(element.commentID==index)
		// 			temp = parseInt(element.ratePoint) ;
		// 	});
		// 	return temp;
		// },
		checkLoggedin(){ //kiểm tra đã đăng nhập mới được comment
			this.getUser();
			if(this.isLoggedin == false) {
				alert("Bạn cần đăng nhập để thự hiện chức năng này");
				return;
			}
			this.active=true;
		},
		openEdit(comment){ //mở hộp thoại edi comment
			this.parentCommentID=comment.parentComment_ID;
			this.commentContent = comment.content;
			this.commentPicture = comment.image;
			this.rateSubmit = parseInt(comment.ratePoint);
			this.activeEdit=true;
		},
		cancel(){ //hủy comment
			this.parentCommentID='';
			this.commentContent = '';
			this.commentPicture = '';
			this.rateSubmit = 0;
			this.activeEdit=false;
			this.active= false;
		},
		changeRate(rate){//gọi hàm change-rate ở component cha là StoreDetail
			this.$emit('change-rate',rate);
		}
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