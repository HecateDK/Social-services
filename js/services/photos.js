(function($,app,req,Q) {
	var state = app.getState();
	var svc = {};

	svc.modifyUserHead = function (filePath,success,fail) {
        success = success || $.noop;
        fail = fail || $.noop;
        var url = app._baseUrl + '/user/modifyUserHead';
        var task = plus.uploader.createUpload( url, {method:'POST'}, function ( t, status ) { // 上传完成
            if ( status == 200 ) {
                var data = JSON.parse(t.responseText);
                if(data.err)
                    fail(data.err);
                else
                    success(data.data);
            } else {
                fail({err:status,message:'上传文件出错'});
            }
        });
        task.addFile( filePath, {key:"imageFile"} );
        task.addData("typeFile", "04" );
        task.start();
    };

	window.userSvc=svc;
	
})(mui,app,request,Q);