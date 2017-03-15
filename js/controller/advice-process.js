(function($,app,myStorage,doc,sbSvc) {
	$.init({swipeBack:true});
	$('.mui-scroll-wrapper').scroll({
		indicators:true   // 是否显示滚动条
	});
	
	var url = window.location.href.split("&");
	var pId = parseInt(url[0].split("pid=")[1]),
		pType = parseInt(url[1].split("pType=")[1]);
	
	// var pId =  window.location.href.split("?")[1];
	var handleBtn = doc.getElementById("handle");
	var kefuBtn = doc.getElementById("kefuBtn");
	var location = doc.getElementById("location");
	
	var getSecurityProduct = function (pId) {
		sbSvc.postSecurityProduct(pId).then(function(data){
			console.log(data);
			var miniAmount = doc.getElementById("miniAmount"),
				miniServiceFee = doc.getElementById("miniServiceFee"),
				miniAmountp_1 = doc.querySelectorAll("#miniAmount .minstandard")[0],
				miniAmountp_2 = doc.querySelectorAll("miniAmount .minstandard")[1],
				miniServiceFeep_1 =  doc.querySelectorAll("#miniServiceFee .minstandard")[0],
				miniServiceFeep_2 = doc.querySelectorAll("#miniServiceFee .minstandard")[1];
			if( data.pAmount === null || data.pAmount === 0 ){
				miniAmount.style.display = "none";
				miniServiceFee.style.width = "100%";
				miniServiceFeep_1.style.float = "left";
				miniServiceFeep_2.style.float = "right";
			}else if( data.pServiceFee === null || data.pServiceFee === 0 ){
				miniServiceFee.style.display = "none";
				miniAmount.style.width = "100%";
				miniAmountp_1.style.float = "left";
				miniAmountp_2.style.float = "right";
			}
			var processTips = doc.getElementById("processTips");
			if( data.tips === null ){
				processTips.style.display = "none";
			}else{
				processTips.innerText = data.tips;
			}
			var minNum = doc.getElementById("minNum");
			jscope.bind(minNum,data,'min');
			handleBtn.addEventListener('tap', function() {
				var state = app.getState();
				if(!state.token){
					console.log("用户没登录");
					app.toLogin();
				}else{
					var _link;
					if( pType == 1 ){
						_link = "advice-transact.html";
					}else if( pType == 2 ){
						_link = "advice-afTransact.html";
					}else if( pType == 3 ){
						_link = "advice-taxTransact.html";
					}else if( pType == 4 ){
						_link = "advice-jzzTransact.html";
					}
				  	$.openWindow({
				  		// url: 'advice-transact.html?sType='+ 0 +'&pAmount='+data.pAmount, 
				    	url: _link+'?sType='+ data.serviceType+'&pAmount='+data.pAmount+'&pType='+pType+'&_pType='+data.pType, 
				    	id: "transact",
				   		extras:{
							pid:data.id,  //扩展参数
							minMonth: data.minMonth,
							maxnMonth: data.maxnMonth,
							pServiceFee: data.pServiceFee,
							pFeeType: data.pFeeType,
							pName: data.pName
						}
				  	});
				}
			});
		}).catch(function(err){
			$.toast(err.message);
		});
	};
	
	var setLocation = function(){
		var city = app.getCity();
		location.innerHTML = city.cityName;
		getSecurityProduct(pId);
	};
	
	setLocation();
	
	var tabItems = document.querySelector(".tab-items"),
		tabList = document.querySelectorAll(".tab-items li"),
		tabCon = document.querySelectorAll(".tab-content .tab-list");
		tabItems.addEventListener("tap",function(){
		for( var i = 0;i < tabList.length;i++ ){
			if( !hasClass(tabList[i],"active") ){
				addClass(tabList[i],"active");
				tabCon[i].style.display = "block";
			} 
			else{
				removeClass(tabList[i],"active");
				tabCon[i].style.display = "none";
			} 
		};
	});	
	
	kefuBtn.addEventListener('tap',app.toKefu,false);
	
})(mui,app,myStorage,document,sbSvc);