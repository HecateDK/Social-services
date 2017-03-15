(function($,app,Q) {
	var request = {};
	request.setting = {
		dataType:'json',
		timeout:10000,
		headers:{'Content-Type':'application/json'},
		waiting:false
	};
	request.request = function(url,options,setting){
		var deferred = Q.defer();
		var netState = window.plus ? plus.networkinfo.getCurrentType():myStorage.getItem('NetType');
		if(netState==='EMPTY' || netState===1){
			deferred.reject({code:0,message:'网络不可用'});
		}else{
			var state = app.getState();
			var cusInfo = app.getDeviceInfo();
			var fextrs = {deviceId:cusInfo.deviceId,appVersion:cusInfo.appVersion}; 
			if(state.token){
				fextrs.userId = state.info ? ""+state.info.userId : undefined;
				fextrs.token = state.token || undefined;
			}
			$.extend(request.setting,setting);
			$.extend(request.setting.headers,fextrs);
			var waiting = null;
		    if(request.setting.waiting && window.plus){
		    	waiting = plus.nativeUI.showWaiting(request.setting.waiting.title);
		    }
			$.ajax(url,{
				data:JSON.stringify(options.data),
				type:options.type,
				dataType:request.setting.dataType,
				headers:request.setting.headers,
				success:function(data){
					if(window.plus) plus.nativeUI.closeWaiting();
					if (data.err && data.err!==null) {
						if(data.err.code == app.needLoginCode){
                            app.removeLogin();
							app.toLogin();
						}else{
							data.err.code = parseInt(data.err.code);
                            deferred.reject(data.err);
						}
			       	} else {
			    		deferred.resolve(data.data);
			    	}
			    	 
				},
				error:function(xhr,type,errorThrown){
					if(window.plus) plus.nativeUI.closeWaiting();
					deferred.reject({code:xhr.status,message:type});	 
				}
			});
		}
		return deferred.promise;
	};
	request.get = function(url,setting){
		var promise = request.request(url,{type:'get'},setting);
		promise.catch(function(err){
			if(err.code===0) {
				$.toast('网络不可用');
			} else if(err.message==='timeout'){
				$.toast('连接超时');
			} else if(err.message==='error'||err.message==='abort'){
				$.toast('服务器维护中');
			}
		});
		return promise;
	};
	request.post = function(url,data,setting){
		var promise = request.request(url,{type:'post',data:data},setting);
		promise.catch(function(err){
			if(err.code===0) {
				$.toast('网络不可用');
			} else if(err.message==='timeout'){
				$.toast('连接超时');
			} else if(err.message==='error'||err.message==='abort'){
				$.toast('服务器维护中');
			}
		});
		return promise;
	};
	
	window.request=request;
	return request;
})(mui,app,Q);
