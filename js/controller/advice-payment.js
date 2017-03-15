(function($,app,myStorage,doc,sbSvc) {
	$.init({ swipeBack:true });
	mui.currentWebview = "payment";
	var obj = {};
	obj.ssList = {};
	
	var url = window.location.href.split("?")[1];
	var pCate = parseInt(url.split("pCategory=")[1]);
	// console.log(pCate);
	
	var changeLink = function(){
		var links = doc.querySelectorAll('#ssList .joy-link');
		// console.log(links);
		$.each(links, function(i,link) {
	        link.addEventListener('tap',function(){            	
	        	var _url = link.getAttribute('jhref'); 
	        	$.openWindow({
	        		url: _url,
	        		id: "process"
	        	});
	        },false);
		});
	}
	
	var getSecurityProductList = function (pCityCode,pCategory) {
		sbSvc.postSecurityProductList(pCityCode,pCategory).then(function(data){
			// console.log(data);
			var ssList = doc.getElementById('ssList');		
			for(var i = 0; i <= data.list.length - 1;i++){
				var imgSrc = {},
					jhrefUrl = {};
				if( data.list[i].pType === 1 ){
					data.list[i].imgsrc = "../images/advice/payment.jpg";
				} 
				else if( data.list[i].pType === 2 ){
					data.list[i].imgsrc = "../images/advice/repair.jpg";
				} 
				else if( data.list[i].pType === 3 ){
					data.list[i].imgsrc = "../images/advice/extract.jpg";
				}else if( data.list[i].pType === 4 ){
					data.list[i].imgsrc = "../images/advice/residence.jpg";
				}
				if( pCate === 1 ){
					data.list[i].jhrefUrl = "advice-ssProcess.html?pid=" + data.list[i].id + '&pType=' + pCate;
				}else if( pCate === 2 ){
					data.list[i].jhrefUrl= "advice-afProcess.html?pid=" + data.list[i].id + '&pType=' + pCate;
				}else if( pCate === 3 ){
					data.list[i].jhrefUrl = "advice-taxProcess.html?pid=" + data.list[i].id + '&pType=' + pCate;
				}
				if( data.list[i].pType === 4 ){
					data.list[i].jhrefUrl = "advice-jzzProcess.html?pid=" + data.list[i].id + '&pType=' + data.list[i].pType;
				}
				console.log(data.list[i]);
			}
			jscope.bindRepeat(ssList,{ssList:data.list});
			/*var Img = doc.querySelectorAll("#ssList .compImg");
			for(var i = 0; i <= data.list.length - 1;i++){
				if( data.list[i].pType === 1 ){
					data.list[i].imgsrc = "../images/advice/payment.png";
					Img[i].style.backgroundImage = "url(../images/advice/payment.jpg)";
					console.log(Img[i]);
				} 
				else if( data.list[i].pType === 2 ){
					data.list[i].imgsrc = "../images/advice/repair.png";
				} 
				else if( data.list[i].pType === 3 ){
					data.list[i].imgsrc = "../images/advice/extract.png";
				}else if( data.list[i].pType === 4 ){
					data.list[i].imgsrc = "../images/advice/residence.png";
				}
			}*/
			changeLink();
		}).catch(function(err){
			$.toast(err.message);
		});
	};
	
	var location = document.getElementById("location");
	var setLocation = function(){
		var city = app.getCity();
		// console.log(city);
		location.innerHTML = city.cityName;
		getSecurityProductList( city.cityCode,pCate );
	};
	location.addEventListener('tap',function(){
		$.openWindow({ url:'pick-city.html',id:'pickCity',waiting:{autoShow:false} });
	},false);
	window.addEventListener("changeCity",function(event){
		var city = event.detail;
		location.innerHTML = city.cityName;
		getSecurityProductList( city.cityCode,pCate );
	},false);
	setLocation();
	
})(mui,app,myStorage,document,sbSvc);