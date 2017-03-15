(function($,app,myStorage,doc,sbSvc) {
function verifyIdcard(num){
	num = num.toUpperCase();
	// console.log(num);
	if ( !(/(^\d{15}$)|^\d{17}([0-9]|X)$/.test(num)) ) {
		$.alert('您输入的身份证号不正确，请重新输入');
		return false;
	}
	var len,re,arrSplit,dtmBirth,bGoodDay,arrInt,arrCh,nTemp,i;
	len = num.length;
	if( len === 15 ){
		re = new RegExp( /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/ );    
		arrSplit = num.match(re);   
		dtmBirth = new Date( '19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4] );    
		bGoodDay = ( dtmBirth.getYear() == Number(arrSplit[2]) ) && ( (dtmBirth.getMonth() + 1 ) == Number(arrSplit[3]) ) && ( dtmBirth.getDate() == Number(arrSplit[4]) );
		// console.log(len,re,arrSplit,dtmBirth,bGoodDay);
		if( !bGoodDay ){
			$.alert("您输入的身份证号不正确，请重新输入")
			return  false;
		}else{
			arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   
			arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			nTemp = 0;
			num = num.substr(0,6) + '19' + num.substr(6,num.length - 6);
			for( i = 0;i < 17;i++ ){
				nTemp += num.substr(i,1) * arrInt[i];          
			}
			num += arrCh[nTemp % 11];                          
			// console.log(nTemp,arrCh[nTemp % 11],num);
			return num;
		}
	}
	if( len == 18 ){
		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		arrSplit = num.match(re);
		dtmBirth = new Date( arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4] );
		bGoodDay = ( dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]) );
		// console.log(len,re,arrSplit,dtmBirth,bGoodDay);
		if( !bGoodDay ){
			$.alert("您输入的身份证号码里出生日期不对");
			return false;
		}else{
			var valnum;
			arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			nTemp = 0;
			for (i = 0; i < 17; i++) {
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			// console.log(nTemp,arrCh[nTemp % 11],num);
			if( valnum != num.substr(17,1) ){
				$.alert("18位身份证的校验码不正确！应该为：" + valnum);
				return false;
			}
			return num;
		}
	}
	return false;
}

function verifyMail(val){
	if( val === '' ){
		// console.log("没有填写电子邮箱");
	}else{
		var re = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
		// console.log(re.test(val));
		if( !re.test(val) ){
			$.alert("您输入的电子邮箱格式不正确，请重新输入");
			return false;
		}
		// console.log(val);
	}
	return true;
}

function verifyName(val){
	// [\u4E00-\u9fa5]   匹配中文字符
	// {2,4} 允许2-5个字节
	var re = new RegExp(/^[\u4e00-\u9fa5\][\u4e00-\u9FA5a-zA-Z]{2,4}$/);
	// console.log(re.test(val));
	if( !re.test(val) ){
		$.alert("您输入的姓名格式不正确，请重新输入");
		return false;
	}
	// console.log(val);
	return true;
}

function verifyPhoneNum(num){
	var re = new RegExp(/^1[3|4|5|6|7|8]\d{9}$/);
	// console.log(re.test(num));
	if( !re.test(num) ){
		$.alert("您输入的手机号码格式不正确，请重新输入");
		return false;
	}
	// console.log(num);
	return true;
}

function verifyqqNum(num){
	if( num === '' ){
		// console.log("没有填写QQ号码");
	}else{
		var re = new RegExp(/^[1-9]\d{4,10}$/);
		// console.log(re.test(num));
		if( !re.test(num) ){
			$.alert("您输入的QQ号码格式不正确，请重新输入");
			return false;
		}
		// console.log(num);
	}
	return true;
}

	$.init({swipeBack:true});
	$('.mui-scroll-wrapper').scroll({
		indicators:true   // 是否显示滚动条
	});
	
	var url = window.location.href.split("?");
	var pType = parseInt(url[1].split("pType=")[1]);
	
	var height = document.body.scrollHeight;
	document.body.style.height = height + "px";
	console.log("zzz",document.querySelector(".info-residence .mui-active"));
	
	var detailData,data;
	$.plusReady(function() {
		var user = app.getUser();
		detailData = {
			"name": user.name,
			"bodyCode": user.bodyCode,
			"phoneNum": user.mobile
		}
		// console.log("根据getUser获取的用户信息detailData",detailData);
		
		var uesrInfo = doc.getElementById("uesrInfo");
		var self = $.currentWebview;
		data = {
			name:detailData.name,  
			bodyCode: detailData.bodyCode,
			phoneNum: detailData.phoneNum,
			pAmount: self.pAmount,
			serviceType: self.serviceType,
			productId: self.productId
		};
		jscope.bind(uesrInfo,data,'info');
		// console.log(data);
		return data;
	});
			
	var location = document.getElementById("location");
	var setLocation = function(){
		var city = app.getCity();
		location.innerHTML = city.cityName;
	};
	setLocation();
			
	var idCardNum = document.getElementById("idCardNum"),
		nextStep = document.getElementById("nextStep"),
		name = document.getElementById("name"),
		phoneNum = document.getElementById("phoneNum"),
		email = document.getElementById("email"),
		qqNum = document.getElementById("qqNum");
			
	nextStep.addEventListener("tap",function(){
		/*verifyIdcard(idCardNum.value);
		verifyName(name.value);
		verifyPhoneNum(phoneNum.value);
		verifyMail(email.value);
		verifyqqNum(qqNum.value);*/
		
		if( verifyName(name.value) &&
			verifyIdcard(idCardNum.value) &&  
			verifyPhoneNum(phoneNum.value) ){
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
		 	var transactPage = plus.webview.getWebviewById("transact");
			mui.fire(transactPage,'getinfor',{
				name:name.value,  //扩展参数
				bodyCode: idCardNum.value,
				phoneNum: phoneNum.value,
				bz:email.value + '-' + qqNum.value
			});
			mui.back();
		}
	},false);
})(mui,app,myStorage,document,sbSvc);


