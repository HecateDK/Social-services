/**
 * Created by tuchl on 2016-08-12.
 */
(function ($) {
	var aid = null;
	var ques0 = {};
	var consultOrderId = null;

	var g = function(id){ return document.getElementById(id); };
	
	var getListHtml = function(list){
		var user = {};
		user = app.getUser();
		var headImg = '<span class="mui-icon fa fa-user-circle"></span>';
		if(user.headBase64){
			headImg='<img src="'+user.headBase64+'">';
		}else{
			headImg='<img src="'+app._imgUrl+user.headPath+'">';
		}
        var html='';
        for(var i in list){
        	var item = list[i];
        	if(item.type===0){
        		html+=[
	    		'<li class="que',item.type?' kf':' me','">',
 					'<div class="que-con">',
 						'<span>',item.counContent,'</span>',
 						'<p>',item.createDatetime,'</p>',
 					'</div>',
 					'<div class="que-img">',headImg,'</div>',
	            '</li>'].join('');
        	}else if(item.type===1){
        		html+=[
	    		'<li class="que',item.type?' kf':' me','">',
	    			'<div class="que-img"><span class="mui-icon fa fa-user-circle-o"></span></div>',
 					'<div class="que-con">',
 						'<span>',item.counContent,'</span>',
 						'<p>',item.createDatetime,'</p>',
 					'</div>',
	            '</li>'].join('');
        	}else if(item.type===2){
        		html+=[
        		'<li class="que mui-text-center">',
        			'<div class="que-tip fs-14">',
        			 	'<i class="fa fa-volume-up"></i>',
        				'<span class="color-dark"> ',item.counContent,'</span>',
        			'</div>',
        		'</li>'].join('');
        	}
        }
        return html;
    };
    
    var getDetail = function (){
        SerSvc.getConsultDetail(aid).then(function(data){
        	ques0 = data.list[0];
        	consultOrderId = data.consultOrderId;
        	app.fireEvent('main','refreshAdviceState');
        	app.fireEvent('advices','refreshAdviceState',{id:aid});
        	if(data.consultStatus===2){
        		$('#resBox').off('tap','.fa');
        		g('resBox').classList.remove('ani');
        		g('resBox').style.top='0';
        		g('state').style.display='inline-block';
				g('sendClose').style.display='none';
				g('cancleClose').style.display='none';
        		var stars = g('resBox').querySelectorAll('.fa');
        		for(var i=0;i<data.score;i++){
        			stars[i].classList.remove('fa-star-o');
        			stars[i].classList.add('fa-star');
        		}
        	}
        	g('dtitle').innerHTML=data.title;
        	g('dtime').innerHTML= [
        		'<span>',ques0.counCateName,'</span>',
	        	'<span>',ques0.counQuerCateName?'-'+ques0.counQuerCateName:'','</span>'
	        	//,'<span> - ',ques0.createDatetime,'</span>'
        	].join('');
        	g('ques').innerHTML = getListHtml(data.list);
        	setTimeout(function(){
				$('#content').scroll().scrollToBottom(500);
			},200);
        }).catch(function(err){
        	if(err.code===0){
				g('topics').innerHTML = '<div class="not-network"><span>点击页面 重新加载</span></div>';
			}else{
				console.log(err.message);
				return $.toast(err.message);
			}
        });
    };
 	var focusEdit = function () {
		window.setTimeout(function () {
			var sel,range;
			if (window.getSelection && document.createRange) {
				range = document.createRange();
				range.selectNodeContents(g('conQues'));
				range.collapse(true);
				range.setEnd(g('conQues'), g('conQues').childNodes.length);
				range.setStart(g('conQues'), g('conQues').childNodes.length);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(g('conQues'));
				range.collapse(true);
				range.select();
			}
		}, 1);
	};
	 
	var showClose = function(){
		document.activeElement.blur();
		g('funcBox').style.bottom='0';
		g('conQues').style.display='none';
		g('conFuns').style.display='none';
		g('conQues').setAttribute('contenteditable',false);
	};
	var hideClose = function(){
		g('funcBox').style.bottom='-100%';
		g('conQues').style.display='inline-block';
		g('conFuns').style.display='inline-block';
		g('conQues').setAttribute('contenteditable',true);
		g('conQues').focus();
	};
	
	var sendQues = function(){
		var conQues = g('conQues');
		if(conQues.innerText.trim()==='') return;
		var time = new Date().toJSON().replace(/(.+)T(\d{2}:\d{2}:\d{2}).+/g,"$1 $2");
		var list = [$.extend({},ques0,{
			counContent:conQues.innerHTML,
			createDatetime:time,
			consultOrderId:consultOrderId
		})];
		g('ques').innerHTML += getListHtml(list);
		setTimeout(function(){
			$('#content').scroll().scrollToBottom();
		},10);
		
		conQues.innerHTML='';
		g('conQues').setAttribute('contenteditable',false);
		g('conQues').setAttribute('contenteditable',true);
		testLength();
		SerSvc.postAdvice(list[0]).then(function(data){
			$.toast('问题提交成功');
		}).catch(function(err){
			$.toast('问题提交失败');
		});
	};
	var testLength = function(){
		var conQues = g('conQues');
		var ms = conQues.innerHTML.match(/<br>/g);
		var brnum = ms?ms.length:0;
		if(brnum>2 || conQues.innerHTML.length>30){
			g('tips').style.display="block";
		}else{
			g('tips').style.display="none";
		}
		if(conQues.innerHTML.length>250){
			conQues.innerHTML = conQues.innerHTML.substr(0,250);
			focusEdit();
		}
		g('tips').innerText ='剩余'+(250-conQues.innerHTML.length)+'字';
	};
	
	var startClose = function(){
		var resBox = g('resBox');
		resBox.style.top="0";
	};
	var endClose = function(){
		var resBox = g('resBox');
		resBox.style.top="100%";
	};
	var sendClose = function(){
		var score = g('resBox').querySelectorAll('.fa-star').length;
		if(score===0){
			$.alert('我们的客服人员也很辛苦，请为他的工作评个分！');
			return;
		}
		var pdata = {consultOrderId:consultOrderId,score:score};
		g('sendClose').innerHTML='<span class="mui-spinner"></span>';
		g('cancleClose').style.display='none';
		SerSvc.setConsultScore(pdata).then(function(data){
			g('state').style.display='inline-block';
			g('sendClose').style.display='none';
			g('cancleClose').style.display='none';
		}).catch(function(err){
			$.toast('操作失败');
			g('cancleClose').style.display='inline-block';
			g('sendClose').innerHTML='关闭';
		});
	}
	
    $('#list').on('tap','.not-network',getDetail);
    $('#resBox').on('tap','.fa',function(){
    	var index = parseInt(this.getAttribute("index"));
	  	var parent = this.parentNode;
	  	var children = parent.children;
	  	if(this.classList.contains("fa-star-o")){
	  		for(var i=0;i<index;i++){
  				children[i].classList.remove('fa-star-o');
  				children[i].classList.add('fa-star');
	  		}
	  	}else{
	  		for (var i = index; i < 5; i++) {
	  			children[i].classList.add('fa-star-o');
	  			children[i].classList.remove('fa-star');
	  		}
	  	}
    });
    
 	g('showInput').addEventListener('tap',hideClose,false);
 	g('hideInput').addEventListener('tap',showClose,false);
 	
 	g('sendQues').addEventListener('tap',sendQues,false);
 	g('closeQues').addEventListener('tap',startClose,false);
 	
 	g('sendClose').addEventListener('tap',sendClose,false);
 	g('cancleClose').addEventListener('tap',endClose,false);

 	g('conQues').addEventListener('keydown',testLength,false);
 	g('conQues').addEventListener('focus',focusEdit,false);
 	
    $.init();
    
    $.plusReady(function(){
    	aid = $.currentWebview.aid;
    	getDetail();
    });
 
})(mui);