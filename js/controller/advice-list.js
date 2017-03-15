/**
 * Created by tuchl on 2016-08-12.
 */
(function ($) {
	var g = function(id){ return document.getElementById(id); };
	
	var getListHtml = function(list){
        var html='';
        for(var i in list){
        	var item = list[i];
        	var state = item.isNewReply?'<span class="red-dot">&nbsp;</span>':'';
        	if(item.consultStatus===2){
        		var star = '';
        		for(var x=0;x<item.score;x++){ star+='<span class="fa fa-star"></span>';}
        		state= star;//+' <span>关闭</span>';
        	}
        	html+=[
	    		'<li class="advice mui-card">',
	    			'<div class="mui-card-content">',
		                '<div class="mui-card-content-inner to-detail" aid="',item.id,'">',
							'<div class="advice-title mui-clearfix">',
								'<span class="title">',item.title,'</span>',
								'<span class="state">',state,'</span>',
							'</div>',
							'<p class="advice-info">',
			                    '<span class="info mui-ellipsis">', 
			                    	geo.names[geo.codes.indexOf(item.cityCode)],'-',
			                    	item.counCateName,
			                    	item.counQuerCateName?'-'+item.counQuerCateName:'',
			                    '</span>',
			                    '<span class="mui-pull-right">',item.creatTime,'</span>',
			                '</p>',
			            '</div>',
		            '</div>',
	            '</li>'].join('');
        }
        return html;
    };
    
    var getList = function (pullSel){
        SerSvc.getConsultList().then(function(data){
        	list.innerHTML = getListHtml(data);
        	if(pullSel) pullSel.endPullDownToRefresh();
        }).catch(function(err){
        	if(pullSel) pullSel.endPullDownToRefresh();
        	if(err.code===0){
				g('list').innerHTML = '<div class="not-network"><span>点击页面 重新加载</span></div>';
			}else{
				return $.toast(err.message);
			}
        });
    };

    var openDetailPage = function () {
        var id = this.getAttribute("aid");
        $.openWindow({
            url:'advice-detail.html',
            extras:{aid:id},
            waiting: {autoShow: false}
        });
    };
    
    $('#list').on('tap','.to-detail',openDetailPage);
    $('#list').on('tap','.not-network',getList);
 	g('newQues').addEventListener('tap',function(){
 		$.openWindow({url:'advice-cate.html'});
 	},false);

    
 	$.init();
    var scroll = $('.mui-scroll-wrapper').scroll();
	var pull = $('#pullRefresh').pullToRefresh({
		down: {
			callback: function() {
				var self = pull = this;
				setTimeout(function() {
					getList(self);
				}, 1000);
			}
		}
	});
	pull.pullDownLoading();
	
	window.addEventListener('refresh_data',function(){
		console.log('advices refresh');
		pull.pullDownLoading();
	},false);
	window.addEventListener('refreshAdviceState',function(){
		var redDot = document.querySelector('div[aid="'+event.detail.id+'"] .red-dot');
		if(redDot) redDot.parentNode.removeChild(redDot);
	},false);
	
})(mui);