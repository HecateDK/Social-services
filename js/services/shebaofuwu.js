(function($,myStorage,app,req,Q) {
	var state = app.getState();
	var sbSvc = {};
	
	sbSvc.postSecurityProductList = function(pCityCode,pCategory){
		var url = app._baseUrl + '/sociSecuService/getSecurityProductList';
		return req.post( url,{"pageNum":1,"pageSize":100,"pCityCode":pCityCode,"pCategory":pCategory} );
	}
	sbSvc.postSecurityProduct = function(pId){
		var url = app._baseUrl + '/sociSecuService/getSecurityProduct';
		return req.post( url,{"pId":pId} );
	}
	sbSvc.createSecurityOrder = function(productId,name,bodyCode,phoneNum,startMonth,endMonth,bz,count){
		var url = app._baseUrl + '/sociSecuService/createSecurityOrder';
		return req.post( url,{
			"productId": productId,
			"name": name,
			"bodyCode": bodyCode,
			"phoneNum": phoneNum,
			"startMonth": startMonth,
			"endMonth": endMonth,
			"bz": bz,
			"count": count
		});
	}
	
	window.sbSvc=sbSvc;	
})(mui,myStorage,app,request,Q);