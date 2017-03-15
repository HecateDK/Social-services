(function(myStorage, mui) {
    var first=null;
    function getItem(key) {
        var jsonStr = window.localStorage.getItem(key.toString());
        return jsonStr ? JSON.parse(jsonStr).data : null;
    }
    function getItemPlus(key) {
    	if(window.plus){
    		var jsonStr = plus.storage.getItem(key.toString());
	        return jsonStr ? JSON.parse(jsonStr).data : null;
    	}
        return null;
    }
    myStorage.getItemPlus = getItemPlus;
    myStorage.getItem = function(key) {
        first=new Date().getTime();
        return getItem(key) || getItemPlus(key);
    };

    myStorage.setItem = function(key, value) {
        first=new Date().getTime();
        value = JSON.stringify({
            data: value
        });
        key=key.toString();
        try {
             window.localStorage.setItem(key, value);
        } catch (e) {
            console.log(e.toString());
            if(window.plus){
            	removeItem(key);
            	plus.storage.setItem(key, value);
            }
        }
    };
	myStorage.setItemPlus = function(key,value){
		first=new Date().getTime();
        value = JSON.stringify({
            data: value
        });
        key=key.toString();
        plus.storage.setItem(key, value);
	};
	
    function getLength() {
        return window.localStorage.length;
    }
    myStorage.getLength = getLength;

    function getLengthPlus() {
        if(window.plus) return plus.storage.getLength();
        return 0;
    }
    myStorage.getLengthPlus = getLengthPlus;

    function removeItem(key) {
        return window.localStorage.removeItem(key);
    }

    function removeItemPlus(key) {
       if(window.plus) return plus.storage.removeItem(key);
    }
    myStorage.removeItemPlus = removeItemPlus;
    myStorage.removeItem = function(key) {
        window.localStorage.removeItem(key);
        if(window.plus) return plus.storage.removeItem(key);
    };
    myStorage.clear = function() {
        window.localStorage.clear();
        if(window.plus) return plus.storage.clear();
    };

    function key(index) {
        return window.localStorage.key(index);
    }
    myStorage.key = key;

    function keyPlus(index) {
        if(window.plus) return plus.storage.key(index);
        return null;
    }
    myStorage.keyPlus = keyPlus;

    function getItemByIndex(index) {
        var item = {
            keyname: '',
            keyvalue: ''
        };
        item.keyname = key(index);
        item.keyvalue = getItem(item.keyname);
        return item;
    }
    myStorage.getItemByIndex = getItemByIndex;

    function getItemByIndexPlus(index) {
        var item = {
            keyname: '',
        	keyvalue: ''
    	};
	    item.keyname = keyPlus(index);
	    item.keyvalue = getItemPlus(item.keyname);
	    return item;
	}
    myStorage.getItemByIndexPlus = getItemByIndexPlus;
    
    /**
     * @description 获取所有存储对象 
     * @param {Object} key 可选，不传参则返回所有对象，否则返回含有该key的对象 
     */ 
    myStorage.getItems = function(key) { 
        var items = []; 
        var numKeys = getLength(); 
        var numKeysPlus = getLengthPlus(); 
        var i = 0; 
        if (key) { 
            for (; i < numKeys; i++) { 
                if (key(i).toString().indexOf(key) != -1) { 
                    items.push(getItemByIndex(i)); 
                } 
            } 
            for (i = 0; i < numKeysPlus; i++) { 
                if (keyPlus(i).toString().indexOf(key) != -1) { 
                    items.push(getItemByIndexPlus(i)); 
                } 
            } 
        } else { 
            for (i = 0; i < numKeys; i++) { 
                items.push(getItemByIndex(i)); 
            } 
            for (i = 0; i < numKeysPlus; i++) { 
                items.push(getItemByIndexPlus(i)); 
            } 
        } 
        return items; 
    }; 
    
    /**
     * @description 清除指定前缀的存储对象 
     * @param {Object} keys 
     * @default ["filePathCache_","ajax_cache_"] 
     */ 
    myStorage.removeItemByKeys = function(keys, cb) { 
        if (typeof(keys) === "string") { 
            keys = [keys]; 
        } 
        keys = keys || ["filePathCache_", "ajax_cache_", "Wedding", "wedding"]; 
        var numKeys = getLength(); 
        var numKeysPlus = getLengthPlus(); 
        //TODO plus.storage是线性存储的，从后向前删除是可以的  
        //稳妥的方案是将查询到的items，存到临时数组中，再删除   
        var tmpks = []; 
        var tk, 
            i = numKeys - 1; 
        for (; i >= 0; i--) { 
            tk = key(i); 
            Array.prototype.forEach.call(keys, function(k, index, arr) { 
                if (tk.toString().indexOf(k) != -1) { 
                    tmpks.push(tk); 
                } 
            }); 
        } 
        tmpks.forEach(function(k) { 
            removeItem(k); 
        }); 
        for (i = numKeysPlus - 1; i >= 0; i--) { 
            tk = keyPlus(i); 
            Array.prototype.forEach.call(keys, function(k, index, arr) { 
                if (tk.toString().indexOf(k) != -1) { 
                    tmpks.push(tk); 
                } 
            }); 
        } 
        tmpks.forEach(function(k) { 
            removeItemPlus(k); 
        }) 
        cb && cb(); 
    }; 
    
    //test=123; expires=Friday,24-Jan-2015 16:24:36 GMT; path=/
    myStorage.pluseCookieUrl = "http://m.joyshebao.com/";
    myStorage.setCookiePlus = function(key,value,hour){
    	var hours = hour || 12;
		var exp = new Date();
		exp.setTime(exp.getTime() + hours*60*60*1000);
		var cookieValue = plus.navigator.getCookie(myStorage.pluseCookieUrl);
		var keyVal = key + "="+encodeURIComponent(JSON.stringify(value))+"; ";
		var expires = "expires="+exp.toGMTString()+"; "
		var path = "path=/";
		var cookieValue = keyVal+expires+path;
		plus.navigator.setCookie(myStorage.pluseCookieUrl, cookieValue);
    };
    myStorage.getCookiePlus = function(key,autoUpdate){
       	var cookieValue = plus.navigator.getCookie(myStorage.pluseCookieUrl);
       	var value = null;
       	if(cookieValue){
       		var reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
			var arr=cookieValue.match(reg);
			if(arr!==null){
				value = JSON.parse(decodeURIComponent(arr[2]));
       			if(autoUpdate) myStorage.setCookiePlus(key,value);
			}
       	}
       	return value;
    };
    myStorage.delCookiePlus = function(key){
    	var cookieValue = plus.navigator.getCookie(myStorage.pluseCookieUrl);
    	if(cookieValue){
    		myStorage.setCookiePlus(key,null,-1);
    	}
    };
    
    
}(window.myStorage = {}, mui)); 