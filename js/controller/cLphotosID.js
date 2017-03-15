(function($,doc,app,userSvc){
	var logUser = {},
		dirty = false,
		photograph = document.getElementById("photograph"),
		uploading = document.getElementById("uploading");
	
	$.init();
	
	// 初始化单页的区域滚动
	$('.mui-scroll-wrapper').scroll();
	
	function setImg(user){
		logUser = user;
		var headPath = user.headPath ? app._imgUrl + user.headPath : '../images/user-photo.png';
		jel('#frontImg').attr( 'src',headPath );
	};
	function getImg(){
		setImg( app.getUser() );
		userSvc.getImg().then( function(user){
			setImg(user);
		}).catch( function( err ){
			err.toast( err.message );
		});
	};
	function setUser(user){
		app.setState( 'info',user );
		dirty = true;
		setImg( user );
	};
	function uploadImg(path){
		var w = plus.nativeUI.showWaiting('正在上传照片...');
		userSvc.modifyUserHead( path,function( data ){
			logUser.headPath = data;
			console.log( logUser );
			setUser( logUser );
			w.close();
		},function( err ){
			w.close();$.toast( err.message );
		});
	};
	function setImgByPhotograph(){
		myStorage.setItem( 'notlock',true );
		var cmr = plus.camera.getCamera(2);
		cmr.captureImage( function( file ){
			console.log( file );
			uploadImg( file );
		},function( err ){
			console.log(JSON.stringify( err ));
		});
	};
	function setImgByuploading(){
		myStorage.setItem( 'notlock',true );
		plus.gallery.pick(function(path){
			console.log(path);
			uploadImg(path);
		},function(err){
			console.log( '取消选择图片' );
		},{ filter:'image' });
	};
	
	$.plusReady(function(){
		photograph.addEventListener('tap',setImgByPhotograph);
		uploading.addEventListener('tap',setImgByuploading);
		getImg();
	});
})(mui,document,app,userSvc);















