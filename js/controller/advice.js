(function($,win,doc){
	$.init({swipeBack:true});
	var g = function(id){return document.getElementById(id)};
	var queryString = function (name){
	    var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)", "i");
	    var matchs = location.search.substr(1).match(reg);
	    if(matchs!==null) return matchs[2];
	    return '';
	};
	var initCityPicker = function(){
		SerSvc.getConsultCity(type).then(function(data){
			var citys = [];
			for(var i in data){
				citys.push({text:data[i].value,value:data[i].key});
			}
			cityPicker.setData(citys);
		});
	};
	var initCatePicker = function(){
		SerSvc.getAdviceCate(type).then(function(data){
			var cates = [];
			for(var i in data){
				cates.push({text:data[i].value,value:data[i].key});
			}
			catePicker.setData(cates);
		});
	};
	
	var cityPicker = null;
	var catePicker = null;
	var type = queryString('type');
	var nt = queryString('nt');

	g('selCity').addEventListener('tap',function(){
		cityPicker.show(function(items) {
 			g('cityCode').value = items[0].value;
			g('city').value = items[0].text;
		});
	},false);
	
	g('counCate').addEventListener('tap',function(){
		catePicker.show(function(items) {
 			g('cateId').value = items[0].value;
			g('counCate').value = items[0].text;
		});
	},false);

	g('postAdvice').addEventListener('tap',function(){
		var postData = {type:type};
		if(nt==='1') postData.counCate = g('counCate').value.trim();
		postData.cityCode = g('cityCode').value.trim();
		postData.counContent = g('counContent').value.trim();
		postData.title =   g('counTitle').value.trim();
		if(postData.title.length<10){
			return $.alert('咨询问题不少于10个字符');
		}
		if(postData.counContent.length<20){
			return $.alert('咨询内容不少于20个字符');
		}
		SerSvc.postAdvice(postData).then(function(data){
			app.fireEvent('advices','refresh_data');
			$.alert('咨询内容已成功提交',"",function(){
				$.back();
			});
		}).catch(function(err){
			$.alert(err.message);
		});
	},false);
	
	$.ready(function(){
		cityPicker = new $.PopPicker();
		catePicker = new $.PopPicker();
		initCityPicker();
		initCatePicker();
		g('cate-type').style.display=nt==='0'?'none':'block';
	});
	
})(mui,window,document);