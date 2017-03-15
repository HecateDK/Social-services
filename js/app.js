(function($,myStorage) {
	var app = {};	
	app.needLoginCode = '30005';
	
	app._baseUrl='****';
	app._imgUrl='****';
	app._webUrl='****';
	
 	function getState(key){
 		var state = null;
 		if(window.plus) 
 			state = myStorage.getItemPlus("StatePlus") || {};
 		else
 			state = myStorage.getItem("State") || {}
 		var res = key ? state[key]:state;
 		return res;
 	}
 	function removeLogin(){
 		var state = myStorage.getItem("State")||{};
 		delete state.token;
 		delete state.info;
 		myStorage.setItem("State",state);
		if(window.plus){
			var statePlus = myStorage.getItemPlus("StatePlus")||{};
	 		delete statePlus.token;
	 		delete statePlus.info;
			myStorage.setItemPlus('StatePlus',state);
		} 
 	}
 	function setState(key,value){ 
 		var state = getState();
 		state[key] = value;
 		myStorage.setItem("State",state);
 		if(window.plus) myStorage.setItemPlus('StatePlus',state);
 	}
 	function createState(data){
 		var state = getState();
 		state.info = data;
 		state.token = data.token;
		myStorage.setItem("State",state);
		if(window.plus) myStorage.setItemPlus('StatePlus',state);
 	}
 	function getDeviceInfo(vercode){
 		var cusinfo = app.getState("cusinfo");
 		if(!cusinfo || !cusinfo.deviceId){
 			cusinfo = {};
 			if(window.plus){
 				cusinfo.deviceId = plus.device.uuid;
				cusinfo.deviceModel = plus.device.model;
				cusinfo.deviceVendor = plus.device.vendor;
				
				cusinfo.os = plus.os.name;
				cusinfo.osVersion = plus.os.version;
				cusinfo.osLanguage = plus.os.language;
				
				cusinfo.origin = plus.runtime.origin;
				cusinfo.appid = plus.runtime.appid;
 			}
 		}
 		if((vercode && vercode!=cusinfo.appVersion) || !cusinfo.appVersion){
			cusinfo.appVersion = vercode || myStorage.getItem('appver');
			app.setState("cusinfo",cusinfo);
		}
 		return cusinfo;
 	}
 	function getUser(){
		return getState('info');
	}
 	function checkLogin(){
		var token = getState('token');
		return token ? true :false;
	}
	function checkToLogin(){
		var token = getState('token');
		if(!token) toLogin(true);
	}
 	function getSetting(key){
 		var settings = myStorage.getItem("Settings")||{};
 		var res = key ? settings[key]:settings;
 		return res;
 	}
 	function setSetting(key,value){
 		var settings = myStorage.getItem("Settings")||{};
 		settings[key] = value;
 		myStorage.setItem("Settings",settings);
 	}
	
	function testQuit(){
		$.oldBack = $.back;
		var backButtonPress = 0;
		$.back = function(event) {//重新定义Android的返回按钮
			backButtonPress++;
			if (backButtonPress > 1) {//一秒内连续按两次则推出
				plus.runtime.quit();
			} else {
				$.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	}
 
	function toLogin(notBack){
		document.activeElement.blur();
		$.openWindow({
			url:"_www/view/auth-login.html",
			id:'login',
			waiting:{autoShow:false},
			extras:{notback:notBack}
		});
	}
	function toKefu(){
		if(window.plus){
			var chatWin = plus.webview.getWebviewById('kefu') || $.preload({
				url:'_www/view/chat.html',
				id:'kefu',
				show:{aniShow:'slide-in-bottom'},
				waiting: {autoShow: false}
			});
			chatWin.show();
		}
	}
	function showUnlock(){
 		document.activeElement.blur();
 		$.openWindow({
			url:'_www/view/auth-unlock.html',
			id:'unlock',
			styles:{zindex:98,hardwareAccelerated:true},
			show:{aniShow:'slide-in-bottom'},
			waiting:{autoShow:false}
		});
	}
	function showGuide(){
 		document.activeElement.blur();
 		$.openWindow({
			url:'_www/view/guide.html',
			id:'guide',
			styles:{zindex:99},
			show:{aniShow:'pop-in'},
			waiting:{autoShow:false}
		});
	}
	
 	function showMask(){
 		app.mask = app.mask || $.createMask();
 		app.mask.show();//显示遮罩
 	}
	function closeMask(){
 		if(app.mask) app.mask.close();//关闭遮罩
 	}
	
	function getCity(allowEmpty){
		var city = myStorage.getItem('city');
		if(!city && window.plus) city = myStorage.getCookiePlus('city',true);
        if(!city && !allowEmpty ) city = {cityName:'北京市',cityCode:'110000',geo:0};
		return city; 
	};
  
	function fireEvent(viewId,eventName,data) {
        if(window.plus) {
            var view = viewId==='main' ? plus.webview.getLaunchWebview() : plus.webview.getWebviewById(viewId);
            if(view) $.fire(view,eventName,data);
        }
    }
	function refresh(){
       if(window.plus) {
            var views =  plus.webview.all();
	        for(var i=0;i<views.length;i++){
	            $.fire(views[i],'refresh_data');
	        }
        }
    }

    function getVersionCode(callback) {
        callback = callback || $.noop;
        plus.runtime.getProperty(plus.runtime.appid, function(inf) {
            callback(inf.version);
            console.log("当前版本："+inf.version);
        });
    }
    
    function copyText(text){
    	if(mui.os.ios){
    		var UIPasteboard  = plus.ios.importClass("UIPasteboard");
			var generalPasteboard = UIPasteboard.generalPasteboard();
			// 设置/获取文本内容:
			generalPasteboard.setValueforPasteboardType(text, "public.utf8-plain-text");
    	}else if(mui.os.android){
	        var Context = plus.android.importClass("android.content.Context");
            var main = plus.android.runtimeMainActivity();
            var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
            plus.android.invoke(clip,"setText",text);
    	}
    }
    
    /**
	 * 打开新窗口
	 * @param {URIString} url : 要打开页面url
	 * @param {String} id : 要打开页面id
	 * @param {JSON} styles : 窗口样式
	 * @param {JSON} extras : 扩展参数
	 * @param {JSON} waiting : 显示等待框，默认为false
	 * @param {JSON} show : 页面loaded事件发生后自动显示，默认为true
	 */
    function openWebview(url,id,styles,extras,waiting,show){
    	//id,wa,ns,ws,extras
		if(window.plus){
			id = id || url
			var nw = plus.webview.getWebviewById(id);
			show = show || {autoShow:true,aniShow:'slide-in-right'};
			if(!nw){
				var waitingBox = null;
				styles = styles || {};
				extras = extras || {};
				styles.scrollIndicator||(styles.scrollIndicator='none');
				styles.scalable||(styles.scalable=false);
				waiting = waiting || {autoShow:false};
				if(waiting.autoShow) waitingBox=plus.nativeUI.showWaiting();
				nw=plus.webview.create(url,id,styles,extras);
				if(show.autoShow!=false){
					nw.addEventListener('titleUpdate',function(){
						nw.show(show.aniShow,show.duration);
						waitingBox&&waitingBox.close();
						waitingBox=null;
					},false);
				}
			}else if(nw.getURL()!==url){
				nw.loadURL(url);
			}else{
				nw.show(show.aniShow,show.duration);
			}
			return nw;
		}else{
			return window.open(id);
		}
    }
   	function hideWebview(id,st){
		$.later(function () {
            var view = plus.webview.getWebviewById(id);
            if(view) view.hide();
        },st || 10);
	}
    function closeWebview(id,st) {
        $.later(function () {
            var view = plus.webview.getWebviewById(id);
            if(view) view.close();
        },st || 10);
    }
    function getLevelView(level,url,title,autoShow) {
		var vid = 'Level-'+level;
		var reload = false;
		var aniShow = "slide-in-right";
		var childView,
			parentView = plus.webview.getWebviewById(vid);
		if (!parentView) {
			parentView = plus.webview.create('_www/view/template.html',vid,{popGesture:'hide'},{mType:'jwHeader'});
			parentView.addEventListener('titleUpdate', function() {
				mui.fire(parentView, 'updateHeader', {title:title});
				if(autoShow!=false) parentView.show(aniShow);
			});
			parentView.addEventListener('hide', function() {
				childView.hide("none");
			});
			var navbarHeight = plus.navigator.isImmersedStatusbar() ? plus.navigator.getStatusbarHeight()+44:44;
			var styles = {top:navbarHeight+'px',bottom:'0px'};
			childView = plus.webview.create(url,'Level-'+level+'-child',styles,{mType:'jwChild'});
			childView.addEventListener('titleUpdate', function() {
				setTimeout(function() {
					parentView.append(childView);
					childView.show();
				}, 50);
			});
			childView.hide();
		}else{
			childView = parentView.children()[0];
			if (url && childView.getURL() != url) {
				reload = true;
				childView.loadURL(url);
			}else{
				mui.fire(parentView, 'updateHeader', {title:title});
				if(autoShow!=false) parentView.show(aniShow);
			}
		}
		var nw = {
			header: parentView,
			content: childView
		};
		nw.show = function(){
			setTimeout(function () {
				parentView.show(aniShow);
			},10);
			if(!reload) childView.show();
		};
		nw.hide = function(){
			childView.hide();
			setTimeout(function () {
				parentView.hide();
			},10);
		};
		return nw;
	};
	function toggleHardwareAccelerated(webview,flag){
		if(typeof webview ==='string'){
			plus.webview.getWebviewById(webview).setStyle({hardwareAccelerated:false});
		} else if(typeof webview ==='object'){
			webview.setStyle({hardwareAccelerated:false});
		}
	}
	
	
 	app.showMask = showMask;
 	app.closeMask = closeMask;
 	
	app.getDeviceInfo = getDeviceInfo;
	app.removeLogin = removeLogin; 
	app.getState = getState;
	app.setState = setState;
	app.createState = createState;
	app.getSetting = getSetting;
	app.setSetting = setSetting;

	app.getUser = getUser;
	app.checkLogin = checkLogin;
	app.checkToLogin = checkToLogin;

	app.testQuit = testQuit;
 
	app.toKefu = toKefu;
	app.toLogin = toLogin;
	app.showUnlock = showUnlock;
	app.showGuide = showGuide;
	app.toggleHardwareAccelerated = app.toggleHardwareAccelerated;
	
	app.getCity = getCity;

	app.openWebview = openWebview;
	app.hideWebview = hideWebview;
    app.closeWebview = closeWebview;
    app.getLevelView = getLevelView;

    app.fireEvent = fireEvent;
    app.appRefresh = refresh;
	app.copyText = copyText;
    app.getVersionCode = getVersionCode;
    
    window.app= app;
	return app;
})(mui,myStorage);
 
(function($){
	function getStyle(ele,pclass) {
	    var style = ele.style;
	    if(window.getComputedStyle) {
	        style = window.getComputedStyle(ele, pclass);
	    }else if(ele.currentStyle){
	        style = ele.currentStyle;
	    }
	    return style;
	}
	function queryString(name){
	    var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)", "i");
	    var matchs = location.search.substr(1).match(reg);
	    if(matchs!==null) return matchs[2];
	    return null;
	}
	
	var imbar = {};
	var navBar = document.querySelector('body>.mui-bar:first-child');
	var isImbar = queryString("isImbar")==="1";
	var barHeight = queryString("barHeight")? parseInt(queryString("barHeight")):0;
	
	imbar.isImmersedStatusbar = myStorage.getItem("isImmersedStatusbar")||isImbar;
	imbar.statusBarheight = myStorage.getItem("statusBarHeight")||barHeight||0;
	imbar.navBarHeight = navBar ? navBar.offsetHeight : 0;
	imbar.isSet = false;

	imbar.ImmersedStatusbar = function(exEl,con){
		var pEl = document.querySelector(exEl);
		if(pEl && imbar.isImmersedStatusbar && !imbar.isSet){
			var style = getStyle(pEl,null);
			var barH = parseInt(style.height);
			if(style.boxSizing==='border-box'){
				barH = parseInt(imbar.statusBarheight) + parseInt(style.height);
				pEl.style.height = barH + "px";
			}
			pEl.style.paddingTop = imbar.statusBarheight + "px";
			con = con || pEl.nextElementSibling;
			if(!pEl.classList.contains('mui-bar-transparent') && con && con.classList.contains('mui-content')){
				con.style.paddingTop = barH + "px";
			}
			imbar.navBarHeight = barH;
			imbar.isSet = true;
		}
	}
	imbar.ImmersedStatusbar('body>.mui-bar:first-child');
	$.plusReady(function(){
		imbar.isImmersedStatusbar = plus.navigator.isImmersedStatusbar();
		imbar.statusBarheight =  plus.navigator.getStatusbarHeight();
		imbar.ImmersedStatusbar('body>.mui-bar:first-child');
	});
	window.imbar = imbar;
	return imbar;
})(mui);
