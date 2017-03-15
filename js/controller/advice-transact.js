(function($,app,myStorage,doc,sbSvc) {
	$.init({swipeBack:true});
	
	var serviceTime = doc.getElementById("serviceTime");
	var ssDetails = doc.getElementById("ssDetails");
	var startTime = doc.getElementById("startTime");
	var endTime = doc.getElementById("endTime");
	var tips = doc.getElementById('tips');
	var timeUnit = doc.getElementById("timeUnit");
	var servicesInfo = doc.getElementById("services-info");
	var infoNotice = doc.getElementById("info-notice");
	var submitOrder = doc.getElementById("submitOrder");
	var ssMonth = doc.getElementById("ssMonth");
	var _number = doc.getElementById("number");
	var count = doc.getElementById("count");
	var minusBtn = doc.getElementById("minusBtn");
	var plusBtn = doc.getElementById("plusBtn");
	var finish = doc.getElementById("finish");
	var detailData = new Object();
	var _data = new Object();
	
	var url = window.location.href.split("&");
	var serviceType = parseInt(url[0].split("sType=")[1]),    // 周期性 0：非周期   1：周期
		pAmount = url[1].split("pAmount=")[1],                // 产品价格  值为空则不显示
		pType = parseInt(url[2].split("pType=")[1]),         // 产品类型 1：社保服务    2：公积金服务    3：个税服务    4：居住证服务
		_pType = parseInt(url[3].split("_pType=")[1]);       // 产品类型  1 代缴 2 补缴 3 提取 4 户口居住证
	
	var getYears = function(begin,end){
		var res = [];
		for( var i = begin; i <= end; i++ ){
			res.push({
				value: i,
				text: i
			});
		}
		return res;
	};

	var selectTime = function(result){         // 补缴情况
		// console.log("配置picker的数据",optionsJson);
		var picker = new $.DtPicker(optionsJson);
		picker.show(function(rs){
			result.innerText = rs.text;
			picker.dispose();
			var selectStartTime = new Date(startTime.innerText).getTime();
			var selectEndTime = new Date(endTime.innerText).getTime();
			// console.log("按月算 所选择时间的时间戳，用于比较大小",selectStartTime,selectEndTime);
			if( selectStartTime > selectEndTime ){
				tips.style.visibility = "visible";
				_data.ssUnit = 0;
				detailData.count =  _data.ssUnit;
				_data.timeStart = null;
				_data.timeEnd = null;
				// console.log("购买数量",detailData.count);
			}else{
				tips.style.visibility = "hidden";
				var diffenYear = endTime.innerText.substring(0,4) - startTime.innerText.substring(0,4),
					diffenMonth = endTime.innerText.substring(5) - startTime.innerText.substring(5);
				if( diffenYear === 0 ){
					var resultMonth = diffenMonth + 1;
				}else{
					var resultMonth = diffenYear * 12 + diffenMonth + 1;
				}
				// console.log(diffenYear,diffenMonth,resultMonth);
				_data.ssUnit = resultMonth;
				detailData.count =  _data.ssUnit;
				_data.timeStart = startTime.innerText;
				_data.timeEnd = endTime.innerText;
				// console.log("购买数量",detailData.count);
			}
			
			var ptAmount = pAmount * _data.ssUnit;
			var ptServiceFee = pServiceFee * _data.ssUnit;
			doc.getElementById("totalPrice").innerText = ptAmount + ptServiceFee;
			_data.pAmount = _data.ssUnit + ' × ' + pAmount+'元';
			_data.pServiceFee =  _data.ssUnit + ' × ' + pServiceFee+'元';
			
			jscope.bind(ssDetails,_data,'cost');
		});
	};

	var purchaseNum = function(result){    // 代缴情况
		// console.log("配置picker的数据",optionsJson);
		var picker = new $.DtPicker(optionsJson);
		picker.show(function(rs){
			result.innerText = rs.text;
			picker.dispose();
			countNum(detailData.count);
		});
	};
	
	var countNum = function(num){
		if( pFeeType === 1 ){          // 代缴时，按年算	
			var diffenYear = parseInt(num),
				diffenMonth = (parseInt(startTime.innerText.substring(5)) - 1) < 10 ? '0' + (parseInt(startTime.innerText.substring(5))-1) : (parseInt(startTime.innerText.substring(5))-1).toString();
			if( diffenMonth == "00" ){
				diffenYear = diffenYear - 1;
				diffenMonth = "12";
			}
			_data.timeStart = startTime.innerText;
			_data.timeEnd = (parseInt(startTime.innerText.substring(0,4)) + diffenYear) + '-' + diffenMonth;
			doc.getElementById("buyNum").innerText = num + "年";
		}else if( pFeeType === 2 ){    // 代缴时，按月算	
			if( parseInt(num) >= 12 ){
				var diffenYear = parseInt(num / 12),
					diffenMonth = parseInt(num) - diffenYear*12 - 1;
			}else if( parseInt(num) < 12 ){
				var diffenYear = 0,
					diffenMonth = parseInt(num) - 1;
			}
			var _endMonth = parseInt(startTime.innerText.substring(5)) + diffenMonth < 10 ? '0' + (parseInt(startTime.innerText.substring(5)) + diffenMonth).toString() : (parseInt(startTime.innerText.substring(5)) + diffenMonth).toString();
			if( parseInt(_endMonth) > 12 ){
				diffenYear = diffenYear + 1;
				_endMonth = (parseInt(_endMonth) - 12) < 10 ? '0' + (parseInt(_endMonth) - 12) : (parseInt(_endMonth) - 12).toString();
			}else if( parseInt(_endMonth) === 12 ){
				diffenYear = diffenYear;
				_endMonth = 12;
			}
			if( _endMonth == "00" ){
				diffenYear = diffenYear - 1;
				_endMonth = "12";
			}
			_data.timeStart = startTime.innerText;
			_data.timeEnd = (parseInt(startTime.innerText.substring(0,4)) + diffenYear) + '-' + _endMonth;
			doc.getElementById("buyNum").innerText = num + "个月";
		}
		
		_data.ssUnit = num;
		detailData.count =  _data.ssUnit;

		var ptAmount = pAmount * _data.ssUnit;
		var ptServiceFee = pServiceFee * _data.ssUnit;
		doc.getElementById("totalPrice").innerText = ptAmount + ptServiceFee;
		_data.pAmount = _data.ssUnit + ' × ' + pAmount+'元';
		_data.pServiceFee =  _data.ssUnit + ' × ' + pServiceFee+'元';
		jscope.bind(ssDetails,_data,'cost');
	};
	
	var closePage = function(){
		var payment = plus.webview.getWebviewById("payment"),
			process = plus.webview.getWebviewById("process"),
			transact = plus.webview.getWebviewById("transact");
		if(payment) payment.close();
		if(process) process.close();
		if(transact) transact.close();
		// console.log(payment,process,transact);
	};

	var changePrice = function(ssUnit){
		var ptAmount = pAmount * ssUnit;
		var ptServiceFee = pServiceFee * ssUnit;
		doc.getElementById("totalPrice").innerText = ptAmount + ptServiceFee;
		_data.pAmount = ssUnit + ' × ' + pAmount+'元';
		_data.pServiceFee =  ssUnit + ' × ' + pServiceFee+'元';
	}
	
	if( pAmount == "null" || pAmount == "0" ){
		pAmount = 0;
		doc.getElementById("ssCost").style.display = "none";
	}
	if( serviceType == 0 ){
		serviceTime.style.display = "none";
		ssMonth.style.display = "none";
	}
	if( _pType ===2 ){
		_number.style.display = "none";
	}else if( _pType === 1 ){
		finish.style.display = "none";
	}
	// console.log("url",url,"pAmount",pAmount,"serviceType",serviceType,"_pType",_pType);
	
	$.plusReady(function() {
		var self = $.currentWebview;
		// console.log("这是社保办理流程页面传过来的数据",self);
		var	productId = self.pid,
			pServiceFee = self.pServiceFee,      // 产品服务费用
			minMonth = self.minMonth,          
			maxnMonth = self.maxnMonth,
			pFeeType = self.pFeeType,          // 费用类别 1按年2 按月 3按次 4面议（现已不用）5 按半年   
			pName = self.pName;
		_data.ssUnit = 1;
		detailData.count = 	_data.ssUnit;	
			
		if( serviceType == 0 ){              // 非周期性产品
			var _year = new Date().getFullYear(),
				_month = new Date().getMonth()+1 < 10 ? '0' + (new Date().getMonth()+1) : new Date().getMonth()+1;
			minMonth = _year + _month;
			maxnMonth = _year + _month;
			var periodData = {
				"begYear": _year,
				"begMonth": _month,
				"endYear": _year,
				"endMonth": _month,
				"startTime": _year + '-' + _month,
				"endTime": _year + '-' + _month
			};
			$.extend(_data,periodData);
			_data.timeStart = periodData.startTime;
			_data.timeEnd = periodData.endTime;

			changePrice(_data.ssUnit);
			jscope.bind(serviceTime,_data,'time');
			jscope.bind(ssDetails,_data,'cost');
			
		}else if( serviceType == 1 ){       // 周期性产品
			if( _pType === 1 ){   // 代缴，可选最大月份无限制
				var begYear = minMonth.substring(0,4),
					begMonth = minMonth.substring(4);
				var endMonth = (parseInt(begMonth) - 1).toString() < 10 ? '0'+(parseInt(begMonth) - 1).toString() : (parseInt(begMonth) - 1).toString();
				var periodData = {
					"begYear": begYear,
					"begMonth": begMonth,
					"endYear": (parseInt(begYear) + 1).toString(),
					"endMonth": endMonth,
					"startTime": begYear + '-' + begMonth,
					"endTime": (parseInt(begYear) + 1).toString() + '-' + endMonth
				};
				if( pFeeType === 1 ){    // 代缴，按年算
					_data.ssUnit = 1;
					detailData.count =  _data.ssUnit;
					doc.getElementById("buyNum").innerText = _data.ssUnit + "年";
					// console.log("购买数量",detailData.count);
					var yearPicker = new $.PopPicker();
						yearPicker.setData(getYears(1,3));
				}else{         // 代缴 按月算
					_data.ssUnit = 12;
					detailData.count =  _data.ssUnit;
					doc.getElementById("buyNum").innerText = _data.ssUnit + "个月";
					// console.log("购买数量",detailData.count);
					var yearPicker = new $.PopPicker();
						yearPicker.setData(getYears(1,36));
				}
				_data.timeStart = periodData.startTime;
				_data.timeEnd = periodData.endTime;
				$.extend(_data,periodData);
				
				changePrice(_data.ssUnit);
				jscope.bind(serviceTime,_data,'time');
				jscope.bind(ssDetails,_data,'cost');
				
				var optionsJson = {
					"value":begYear +"-"+ begMonth,
					"type":"month",
					"beginDate":new Date(begYear, begMonth - 1),
				};
				startTime.addEventListener('tap',purchaseNum.bind(startTime,startTime),false);
				_number.addEventListener('tap',function(event){
					yearPicker.show(function(items){
						_data.ssUnit = items[0].value;
						countNum(_data.ssUnit);
					});
				},false);
				
			}else if( _pType === 2 ){   // 补缴 可选最大月份为maxMonth
				var begYear = minMonth.substring(0,4),
					begMonth = minMonth.substring(4),
					endYear = maxnMonth.substring(0,4),
					endMonth = maxnMonth.substring(4);
				var periodData = {
					"begYear": begYear,
					"begMonth": begMonth,
					"endYear": endYear,
					"endMonth": endMonth,
					"startTime": begYear + '-' + begMonth,
					"endTime": endYear + '-' + endMonth
				};
				$.extend(_data,periodData);

				var optionsJson = {
					"value":begYear +"-"+ begMonth,
					"type":"month",
					"beginDate":new Date(begYear, begMonth - 1),
					"endDate":new Date(endYear,endMonth - 1)
				};
				var _diffenYear = endYear - begYear,
					_diffenMonth = endMonth - begMonth;
				if( _diffenYear === 0 ){
					var _resultMonth = _diffenMonth + 1;
				}else{
					var _resultMonth = _diffenYear * 12 + _diffenMonth + 1;
				}
				_data.ssUnit = _resultMonth;
				detailData.count =  _data.ssUnit;
				_data.timeStart = periodData.startTime;
				_data.timeEnd = periodData.endTime;
				changePrice(_data.ssUnit);
				
				startTime.addEventListener('tap',selectTime.bind(startTime,startTime),false);
				endTime.addEventListener('tap',selectTime.bind(endTime,endTime),false);

				jscope.bind(serviceTime,_data,'time');
				jscope.bind(ssDetails,_data,'cost');
			}
		}
		
		servicesInfo.addEventListener('tap', function() { // 点击“个人信息”把getUser获取到的参数传到advice-information.html页面
			var _link;
			if( pType == 1 ){
				_link = "advice-information.html";
			}else if( pType == 2 ){
				_link = "advice-afInformation.html";
			}else if( pType == 3 ){
				_link = "advice-taxInformation.html";
			}else if( pType == 4 ){
				_link = "advice-jzzInformation.html";
			}
		 	$.openWindow({
		   		url: _link + '?pType='+pType, 
		   		id: "information",
		   		extras:{
					pAmount: pAmount,
					serviceType: serviceType,
					productId: productId
				}
			});
		},false);	
		
		detailData.productId = productId;
		detailData.startMonth = doc.getElementById("timeStart").innerText;
		detailData.endMonth = doc.getElementById("timeEnd").innerText;
		detailData.bz = null;
		// console.log(detailData);
		
		window.addEventListener('getinfor',function(event){   // 接收到advice-information.html页面返回数据
			// console.log("填写完个人信息，返回。")
			var confirmData = {
				"name": event.detail.name,
				"bodyCode": event.detail.bodyCode,
				"phoneNum": event.detail.phoneNum,
				"bz": event.detail.bz
			}
			$.extend(detailData,event.detail);
			// console.log("这是填写完个人信息后返回的信息",confirmData);
			infoNotice.style.visibility = "hidden";
		},false);	
		
		submitOrder.addEventListener('tap',function(){
			if( detailData.productId !== null && detailData.name !== null && detailData.bodyCode !== null && detailData.phoneNum !== null && detailData.startMonth !== null && detailData.endMonth !== null && detailData.bz !== null && detailData.count !== null ){
				Object.defineProperties(detailData,{
					startMonth: {
						value: doc.getElementById("timeStart").innerText.replace(/-/,'')
					},
					endMonth: {
						value: doc.getElementById("timeEnd").innerText.replace(/-/,'')
					}
				});
				// console.log("提交时候的detailData",detailData);
				sbSvc.createSecurityOrder(          
					detailData.productId,
					detailData.name,
					detailData.bodyCode,
					detailData.phoneNum,
					detailData.startMonth,
					detailData.endMonth,
					detailData.bz,
					detailData.count
				).then(function(data){
					// console.log("成功提交订单，返回订单id",data);
					app.fireEvent('main','refreshOrderNum');
					var buzzId = data.buzzId,
						pro = pName,
						amt = doc.getElementById("totalPrice").innerText;
					var detail = data;
					$.openWindow({
					 	url: 'order-pay.html?id='+buzzId+'&pro='+encodeURIComponent(pro)+'&amt='+amt,  // buzzId 订单ID    pro 产品姓名    amt 总价格
					 	extras: { detail: detail }
				 	});
				 	window.setTimeout(closePage,1000);
				}).catch(function(err){
					$.toast(err.message);
				});
			}else{
				$.alert("请确认信息填写正确完毕");
			}	
		},false);
	
	});
	
	var location = doc.getElementById("location");
	var setLocation = function(){
		var city = app.getCity();
		location.innerHTML = city.cityName;
	};
	setLocation();
	
})(mui,app,myStorage,document,sbSvc);