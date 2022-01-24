var this_type;var is_login=0;
layui.use(['carousel','layer','form','element'], function(){
	$ = layui.jquery,layer = layui.layer,form = layui.form;element = layui.element;
	$(document).on('click','.login',function(){
		$('#login,.login-parent-div').show();
		$(".get-code").bind("click", phone_code_function);
		getQrcode();
	});
	change_login();
	if($('.bdsharebuttonbox').size() > 0){
		baidu_share();
		$('.bdsharebuttonboxp').hover(function(){
			$('.bdsharebuttonbox').show();
		},function(){
			$('.bdsharebuttonbox').hide();
		});
	}

	if($('#commentinput').size() > 0){
		var TplData  = $('.ask').attr('data');
		$('.ask-comment-answer').click(function(){
			if($('.login').size() > 0){
				$('.login').trigger('click');
				return false;
			}else{
				var that = $('#commentinput');
				if(that.is('.layui-hide-sm')){
					that.removeClass('layui-hide-sm');
					ue = getue_config('js-reply-editor-box');
				}else{
					that.addClass('layui-hide-sm');
				}
			}
		});
		$(document).on('click','.ask .contents .user ul li .view2',function(){
			if($('.login').size() > 0){
				$('.login').trigger('click');
				return false;
			}
			var that = $(this);
			var id = that.attr('id');
			if(TplData == 1){
				var url = '/article/good/';
			}else{
				var url = '/wenda/good/';
			}
			$.post(url,{id:id},function(result){
				if(result.code == 1){
					layer.msg(result.msg,{icon:1});
					var thisCount = parseInt(that.find('label').html()) + 1;
					that.find('label').html(thisCount);
				}else{
					layer.msg(result.msg,{icon:2});
				}
			});
		});
		$(document).on('click','.ask .contents .user ul li .reply',function(){
			if($(this).is('.is_open')){
				$(this).removeClass('is_open');
				$(this).parents('.ask_top_ul').find('.release-reply-con').hide();
			}else{
				$(this).addClass('is_open');
				$(this).parents('.ask_top_ul').find('.release-reply-con').show();
			}
		});
		$(document).on('click','.reply-list .reply-item .reply-btn',function(){
				$(this).parents('.ask_top_ul').find('.reply').trigger('click');
			})
		$(document).on('click',".do-reply-btn:not('.running')",function(){
			if($('.login').size() > 0){
				$('.login').trigger('click');
				return false;
			}
			var that = $(this);
			var id = that.data('id');
			var content = that.prev('.textarea-con').find('.release-reply').val();
			var reg = new RegExp("[\\u4e00-\\u9fa5]+","g");
			if(content == '' || !reg.test(content)){
				layer.msg('内容不可为纯英文',{icon:2});
				return false;
			}
			that.addClass('running');
			if(TplData == 1){
				var url = '/article/reply_answer/';
			}else{
				var url = '/wenda/reply_answer/';
			}
			$.post(url,{id:id,content:content},function(result){
				if(result.code == 1){
					layer.msg(result.msg,{icon:1});
					that.prev('.textarea-con').find('.release-reply').val('');
					var answer_str = result.str; 
					that.parents('.release-reply-con').before(answer_str);
					var count = parseInt($('.ask .contents .wrap ul .master span').html()) + 1;
					$('.ask .contents .wrap ul .master span').html('&nbsp（'+count+'）');
					that.removeClass('running');
				}else{
					layer.msg(result.msg,{icon:2});
					that.removeClass('running');
				}
			});
		});
		var IswendaPost = false;
		$(document).on('click','#js-wenda-ci-submit:not(.running)',function(){
			var that = $(this),uecontent = ue.getContent(); 
			var reg = new RegExp("[\\u4e00-\\u9fa5]+","g");
			if(uecontent == '' || !reg.test(uecontent)){
				layer.msg('内容不可纯英文');
				return false;
			}
			that.addClass('running').html('回复中...');
			if(TplData == 1){
				var url = '/article/reply/';
			}else{
				var url = '/wenda/reply/';
			}
			if(IswendaPost == true){
				return false;
			}
			IswendaPost = true;
			var PhpStudyReply = $("input[name='PhpStudyReply']").val();
			$.post(url,{id:that.data('qid'),reply_content:uecontent,PhpStudyReply:PhpStudyReply},function(result){
				that.removeClass('running').html('回复');
				if(result.status == 1){
					layer.msg(result.msg,{time:2000,skin: 'layui-layer-molv',icon:1});
					reply_data(result.str);
				}else{
					layer.msg(result.msg,{icon:2});
				}
				IswendaPost = false;
			});
		});
		$('pre').each(function(){
			var theclass=$(this).attr('class');
			if("undefined"==typeof(theclass) || theclass.indexOf("brush:")<0){
				if("undefined"==typeof(theclass)){
					$(this).attr('class','brush:php;toolbar:false;');
				}else{
					$(this).attr('class',$(this).attr('class')+'toolbar:false;');
				}
			}
			if("undefined"==typeof(theclass)){theclass='';}
			if(theclass.indexOf("toolbar:")<0){
				$(this).attr('class',$(this).attr('class')+'toolbar:false;');
			}
		});
		SyntaxHighlighter.all();
	}
	if($('.publish-send-every').size() > 0){
		ue = getue_config('container','92%');
	}
	$('.ask_accept').click(function(){
		var id = $(this).data('id');
		var id1 = $(this).data('id1');
		$.post('/wenda/accept/',{id:id,id1:id1},function(res){
			if(res.code == 1){
				layer.msg(res.msg,{icon:1,time:1200},function(){
					location.reload();
				});
			}else{
				layer.msg(res.msg,{icon:2});
			}
		});
	});
	$(document).on('click','.isAct-attr img',function(){
		var that = $(this).attr('src');
		layer.open({
			type: 1,
			title: false,
			closeBtn: 1,
			shadeClose: true,
			area: ['80%', '70%'],
			skin: '',
			content: "<img src='"+that+"' style='max-width: 100%;text-align: center;margin:auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0; '>"
		});
	});
	$('.ask_detail_luck_draw').click(function(){
		var id = $(this).data('id');
		$.post('/setsolve/',{id:id},function(res){
			if(res.code==1){
				layer.msg(res.msg,{icon:1,time:1000},function(){
					location.reload();
				});
			}else{
				layer.msg(res.msg,{icon:2,time:1200});
			}
		},'json');
	});
	//<div class="ad-ask ad-image bg-fff layui-main mt-10"><ul class="layui-clear dp-f"><li>  <a href="tencent://message/?uin=88526&Site=www.xp.cn&Menu=yes " target="_blank">广告联系QQ:88526</a></li><li>  <a href="https://www.xp.cn/download.html" target="_blank">服务器防火墙</a></li><li>  <a href="https://www.xp.cn/linux.html" target="_blank">服务器linux面板</a></li><li>  <a href="https://www.xp.cn/download.html" target="_blank">服务器windows版本</a></li> <li>  <a href=" tencent://message/?uin=88526&Site=www.xp.cn&Menu=yes" class="on" target="_blank">广告联系QQ:88526</a></li><li>  <a href="https://cloud.baidu.com/" target="_blank">百度云服务器3折起</a></li> <li>  <a href="https://www.php.cn/k.html?t=12" class="on" target="_blank">php线上培训班</a></li><li>  <a href="tencent://message/?uin=88526&Site=www.xp.cn&Menu=yes " target="_blank">广告联系QQ:88526</a></li><li>  <a href="https://www.pigcms.com" target="_blank">小猪cms教育云（源码出售）</a></li><li>  <a href="tencent://message/?uin=88526&Site=www.xp.cn&Menu=yes " target="_blank">广告联系QQ:88526</a></li></ul><span></span></div>
	if($('.wenda_top').size() > 0) {
		$.post('/asktopad/', '', function (res) {
			if (res.code == 0) {
				var str = '<div class="ad-ask ad-image bg-fff layui-main mt-10">';
				str += '<ul class="layui-clear dp-f">';
				str += res.data;
				str += '</ul>';
				str += '<span></span>';
				str += '</div>';
				$('.wenda_top').append(str);
			}
		}, 'json');
	}
	if($('.linux-ads').size() > 0) {
		$.post('/asktopads/', '', function (res) {
			if (res.code == 0 && res.data) {
				var str = res.data;
				$('.linux-ads').append(str);
			}
		}, 'json');
	}
	$('.windows-module-nav').find('li').click(function(){
	   var index = $(".windows-module-nav li").index(this);
	   $('.windows-module-nav').find('li').removeClass('l-active');
	   $(this).addClass('l-active');
	   $('.windows-module-centent').find('dd').hide();
	   $('.windows-module-centent dd').eq(index).show();
	});

	$('.xp_panel_slider li').click(function(){
		$('.xp_panel_slider').find('li').removeClass('docker-active');
		if(!$(this).is('.docker-active')){
			$(this).addClass('docker-active');
		}
		var slider_con = $(this).attr('con');console.log('.lockquote-con'+slider_con);
		$('.xp_panel_slider_con blockquote').removeClass('layui-hide');
		$('.blockquote-con'+slider_con).addClass('layui-hide');
	});

	if($('.vipNewData').size() > 0){
    	form.on("radio(level)", function (data) {
			layer.msg('内测中，敬请期待',{icon:2,time:1200});return false;
    		var id = data.value;
    		var time = $("input[name='time']:checked").val();
    		$.post('/newVipPrice/',{id:id,time:time},function(res){
    			if(res.code == 0){
    				$('.vipNewMoney').text(res.msg);
    			}else{
    				layer.msg(res.msg,{icon:2,time:1200});
    			}
    		},'json');
    	});
    	form.on("radio(time)", function (data) {
    		var time = data.value;
    		var id = $("input[name='level']:checked").val();
    		$.post('/newVipPrice/',{id:id,time:time},function(res){
    			if(res.code == 0){
    				$('.vipNewMoney').text(res.msg);
    			}else{
    				layer.msg(res.msg,{icon:2,time:1200});
    			}
    		},'json');
    	});
    }
    $(".newvipCourseName").click(function () {
		if(!$(this).is('.active')){
			layer.msg('内测中，敬请期待',{icon:2,time:1200});return;
		}
		var id = $(this).attr("data-id");
		$(".newvipCourseName").removeClass("active");
		$(this).addClass("active");
		$("#tagid" + id).show().siblings().hide();
	});
	if($('.newvip-header').size() > 0){
		var swiper = new Swiper('.swiper-container', {
			slidesPerView: 4,
			spaceBetween: 30,
			slidesPerGroup: 4,
			loop: true,
			loopFillGroupWithBlank: true,
			pagination: {
			el: '.swiper-pagination',
			clickable: true,
			},
			navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			},
		});
	}
	$('.vipDataVideoSet').click(function(){
		layer.open({
			  type: 2,
			  area: ['600px', '650px'],
			  title: false,
			  closeBtn: true,
			  shadeClose: false,
			  content: '/user/videoset/'
		});
	});
	$(document).on('click','.order_alipay_five_layer',function(){
		var order = $(this).data('data');
		if(!order){window.location.reload();return;}
		$.post('/weipay_data_status.html',{order:order},function(res){
			if(res.code == 1){
				layer.msg(res.msg,{icon:1,time:2000},function(){
					window.location.href = res.url;
				});
			}else{
				layer.msg(res.msg,{icon:2,time:2000});
			}
		},'json');
	});
	$(document).on('click','.order_alipay_sex_layer',function(){
		$('.order_alipay_layer').hide();
	});
});
function change_login(){
	$('#qcode').click(function(){
		var flag = $('#login').attr('flag');
		if($('#'+flag).css('display')=='none'){
			$('#'+flag).show();
			$('#code-img').hide();
			$('#qrcode-desc').hide();
			$('#qcode').removeClass('qcode');
			$('#qcode').addClass('qcode2');
			$('.js-change-account-type').text('点击切换二维码登陆');
			_login($('.a-register-login'));
		}else{
			$('#qcode').removeClass('qcode2');
			$('#qcode').addClass('qcode');
			$('#code-img').show();
			$('#qrcode-desc').show();
			$('#'+flag).hide();
			$('.js-change-account-type').text('点击切换帐号登陆');
			getQrcode();
		}
	});
}
var ticket_login = '';
function getQrcode(){
	var timestamp_version = new Date().getTime();
	$.get('/account/login_weixin/?'+timestamp_version,function(res){
		if(res.code>0){
			layer.msg(res.msg,{icon:2});
		}else{
			if(res.msg){
				var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+res.msg;
				ticket_login = res.msg;
				$('#code-img img').attr('src',url);
				checklogin();
			}
		}
	},'json');
}
var time = null;
function checklogin(){
	try{
		clearInterval(time);
	}catch(e){}
	$.ajaxSettings.async = false;
	time = setInterval(function(){
		$.get('/account/checkLogin/?'+new Date().getTime(),{'ticket':ticket_login},function(res){
			if($('#login').is(':hidden')){
				clearInterval(time);
			}
			if(res.code==2){// 二维码已失效
				getQrcode();
			}
			if(res.code == 3){
				clearInterval(time);
				layer.msg(res.msg,{icon:2},function(){
					setTimeout(function(){window.location.reload();},1000);
				});
			}
			if(res.code==0){
				clearInterval(time);
				layer.msg('登录成功');
				if(location.href=='http://phpstudy.php.cn/wenda/401.html' && this_type>0){
					$('.login').remove();
					phpstudy_down(this_type);
					setInterval(function(){
						if(is_login == 1){
							window.location.reload();
						}
					},1000);
				}else{
					setTimeout(function(){window.location.reload();},1000);
				}
			}
		},'json');
	},3000);
}
function reg(obj){
	$('#regform').show();
	$('#from').hide();
	$(obj).hide().siblings('a').show();
	$('#login').attr('flag','regform');
	$('#code-img').hide();
	$('#qrcode-desc').hide();
}
// 已有帐号，立即登录
function _login(obj){
	$('#regform').hide();
	$('#from').show();
	$(obj).hide().siblings('a').show();
	$('#login').attr('flag','from');
	$('.js-change-account-type').text('点击切换二维码登陆');
	$('#code-img').hide();
	$('#qrcode-desc').hide();
}
// 短信验证码
phone_code_function = function sms_code(){
	var phone = $('input[name="phone"]').val();
	if(phone == '' || !/^1[3456789]\d{9}$/.test(phone)){
		layer.msg('手机号格式错误',{icon:2});
		$('input[name="phone"]').focus();
		return false;
	}
	$.post('/getPhoneCode/',{phone:phone},function(res){
		if(res.code==1){
			layer.msg(res.msg,{icon:1});
			settime($('.get-code'));
		}else{
			layer.msg(res.msg,{icon:2});
		}
	},'json');
}
var countdown = 60;
function settime(obj){
	if (countdown == 0) {
		$('.get-code').css({'background':'#22ac38','cursor':'pointer'});
		$(".get-code").bind("click", phone_code_function);
		obj.html("获取验证码");
		countdown = 60;
		return;
	}else{
		$('.get-code').css({'background':'#999','cursor':'default'});
		$('.get-code').unbind('click',phone_code_function);
		obj.html("重新发送(" + countdown + ")");
		countdown--;
	}
	setTimeout(function(){settime(obj)},1000);
}
function btn_login(){
	$('#login').attr('flag','from');
	$('#login-bg,#login').show();
	$('#code-img').show();
	$('#qrcode-desc').show();
	$('#from').hide();
	$('#regform').hide();
	getQrcode();
}
function btn_reg(){
	$('#login-bg,#login').show();
	reg($('#a-register'));
}
function doreg(obj){
	var that = $(obj);
	var loginphone = $.trim($('input[name="phone"]').val());
	if(loginphone == '' || !/^1[3456789]\d{9}$/.test(loginphone)){
		layer.msg('手机号格式错误',{icon:2});
		$('input[name="phone"]').focus();
		return false;
	}
	var pwdVal = $('input[name="reg-pwd"]').val();
	var repwdVal = $('input[name="repwd"]').val();
	if(pwdVal == '' || pwdVal.length < 6 || pwdVal.length > 16 || !/^\s*(\S+)\s*$/.test(pwdVal)){
		layer.msg('请输入6-16位密码,不能使用空格',{icon:2});
		$('input[name="pwd"]').focus();
		return false;
	}
	if(pwdVal != repwdVal){
		layer.msg('两次密码输入不一致',{icon:2});
		$('input[name="repwd"]').focus();
		return false;
	}
	var phoneCode = $('input[name="phoneCode"]').val();
	if(phoneCode == '' || phoneCode.length < 4){
		layer.msg('请输入4位的短信验证码',{icon:2});
		$('input[name="phoneCode"]').focus();
		return false;
	}
	var verifyVal = $('input[name="verify"]').val();
	if(verifyVal == '' || verifyVal.length < 4){
		layer.msg('请输入4位的验证码',{icon:2});
		$('input[name="verify"]').focus();
		return false;
	}
	if(that.is(".running")){return false;}
	that.addClass("running");
	$(obj).text('注册中...');
	$.post('/account/reg/',{phone:loginphone,repwd:repwdVal,pwd:pwdVal,code:verifyVal,phoneCode:phoneCode},function(result){
		that.removeClass("running");
		if(result.code == 0){
			layer.msg('注册成功',{icon:1,time:1500},function(){
				window.location.reload();
			});
		}else{
			$(obj).text('注册');
			layer.msg(result.msg,{icon:2});
			$("#regform .verify-img").attr("src",'/captcha'+'?t='+(new Date().getTime()));
			that.removeClass("running");
		}
	},'json');
}
function login(){
	var username = $.trim($('input[name="username"]').val());
	var pwd = $.trim($('input[name="pwd"]').val());
	var veriry_code = $.trim($('input[name="veriry_code"]').val());
	$.post('/account/login_email/',{account:username,pwd:pwd,code:veriry_code},function(res){
		if(res.code>0){
			layer.msg(res.msg,{icon:2});
			$('.veriry-code').attr('src','/captcha.html?v='+Math.random());
		}else{
			layer.msg(res.msg,{icon:1});
			setTimeout(function(){window.location.reload();},1000);
		}
	},'json');
}
var newviplayer;
function newvip_pay(time){
	if($('.login').size() > 0){
		$('.login').trigger('click');
		return false;
	}
	var url = '/newVipOpen/';
	if(time){
		url += '?time='+time;
	}
	newviplayer = layer.open({
		type: 2,
		title: 'VIP会员开通',
		shadeClose: false,
		shade: 0.8,
		area: ['740px', '560px'],
		content: url
	});
}
function newVipNowPay(isType){
	if($('.login').size() > 0){
		$('.login').trigger('click');
		return false;
	}
	var type = parseInt($('input[name="level"]:checked').val()) + 30000;
	var time = parseInt($('input[name="time"]:checked').val());
	var pay_type = $('input[name="pay_type"]:checked').val();
	if(!type){
		layer.msg('请选择会员类型',{icon:2});return false;
	}
	if(!time){
		layer.msg('请选择会员时长',{icon:2});return false;
	}
	if(pay_type == 2){
		window.open('/alipay/pay_pc.html?time='+time+'&type='+type);
		parent.layer.closeAll();
		if($(".order_alipay_five_layer",parent.document).size() > 0){
			$(".order_alipay_five_layer",parent.document).show();
			$(".order_alipay_layer",parent.document).show();
		}
		return;
	}
	parent.layer.open({
		type: 2,
		title: '微信扫一扫支付',
		shadeClose: false,
		shade: 0.8,
		area: ['400px', '470px'],
		content: '/weipay/'+type+'.html?time='+time
	});
	layer.close(newviplayer);
}
var mypublish_layer;
function publish_(){
	if($('.login').size() > 0){
		$('.login').trigger('click');
		return false;
	}
	var url = '/wenda/publish/';
	mypublish_layer = layer.open({
		type:2,
		title: '发布话题',
		shade: 0.5,
		area: ['680px', '600px'],
		content: url
	});
}
function publish(){
	var isArticlePublishPost = false;
	var title = $.trim($('#ques-title').val());//标题
	var content = ue.getContent();//内容
	var verify = $('#verifycode').val();
	var catId = $('#category option:selected').val();
	var pic = $('#art-face').val();
	var task_id = $('#task_id').val();
	var phpcn = $("input[name='phpcn']").val();
	//匹配合法内容
	var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	if(!reg.test(content) || content.length < 20){
		layer.msg('内容不可纯英文，且至少20字以上',{icon:2});
		return false;
	}
	if(!new RegExp("[\\u4E00-\\u9FFF]+","g").test(title)){
		layer.msg('标题不可为纯英文',{icon:2});
		return false;
	}
	if(title.length < 6){
		layer.msg('标题不可少于6个字',{icon:2});
		return false;
	}

	if(verify == ''){
		layer.msg('验证码不能为空',{icon:2});
		return false;
	}
	if(catId == ''){
		layer.msg('请选择分类',{icon:2});
		return false;
	}

	if(isArticlePublishPost == true){
		return false;
	}
	isArticlePublishPost = true;
	$.post('/wenda/add/',{title:title,content:content,catid:catId,verify:verify,pic:pic,phpcn:phpcn},function(result){
		if(result.status == 1){
			parent.layer.closeAll();
			parent.layer.alert("<div style='text-align:center;font-size:16px;'><p style='color:green;font-size:20px;'>问题提交成功！</p><p>问题比较着急？请联系QQ：<br/><br/><a href='tencent://message/?uin=46242650&Site=www.xp.cn&Menu=yes'><img src=\"https://img.php.cn/upload/article/000/000/003/5b5814914439e896.png\" alt='QQ咨询'></a></p> </div>");
		}else{
			refreshVerify('.js-verify-refresh');
			layer.msg(result.msg,{icon:2});
			isArticlePublishPost = false;
		}
	});
}
function getue_config(id,widths){
	ue = UE.getEditor(id,{
		toolbars:[['insertcode','Bold','italic','underline','snapscreen','simpleupload','spechars','blockquote','link','unlink']],
		wordCount:false,
		elementPathEnabled:false,
		pasteplain:true,
		enableContextMenu:false,
		allowDivTransToP:false,
		initialFrameWidth:widths,
		initialFrameHeight:200,
		iframeCssUrl:'/static/ueditor/plugin/js/user_code.css'
	});
	return ue;
}
function ask_comment_good(id){
	if($('.login').size() > 0){
		$('.login').trigger('click');
		return false;
	}
	var is_ask_good_post = false;
	if(id == ''){
		return false;
	}
	if(is_ask_good_post == true){
		return false;
	}
	is_ask_good_post = true;
	$.post('/wenda/follow/',{id:id},function(result){
		if(result.code == 1){
			layer.msg(result.msg,{icon:1,time:1200},function(){
				window.location.reload();
			});
		}else{
			layer.msg(result.msg,{icon:2});
			is_ask_good_post = false;
		}
	});
}
function reply_data(str){
	if($('.no-data-tips').size() > 0){
		$('.no-data-tips').hide();
	}
	$('.ask .contents .user').prepend(str);
	ue.setContent('');
	var count = parseInt($('.ask .contents .wrap ul .master span').html()) + 1;
	$('.ask .contents .wrap ul .master span').html(count);
}
function refreshVerify(classname) {
	var ts = Date.parse(new Date())/1000;
	$(classname).attr("src", "/captcha.html?id="+ts);
}
function baidu_share(){
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdPic":"","bdStyle":"0","bdSize":"16"},"share":{}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
}
function init_city(){
	$.each(province, function (k, p) {
		var option = "<option value='" + p.ProID + "'>" + p.ProName + "</option>";
		$("#selProvince").append(option);
	});
	$("#selProvince").change(function () {
		var selValue = $(this).val();
		$("#selCity option:gt(0)").remove();
		$("#selDistrict option:gt(0)").remove();
		$.each(city, function (k, p) {
			if (p.ProID == selValue) {
				var option = "<option value='" + p.CityID + "'>" + p.CityName + "</option>";
				$("#selCity").append(option);
			}
		});
	});
	$("#selCity").change(function () {
		var selValue = $(this).val();
		$("#selDistrict option:gt(0)").remove();
		$.each(District, function (k, p) {
			if (p.CityID == selValue) {
				var option = "<option value='" + p.Id + "'>" + p.DisName + "</option>";
				$("#selDistrict").append(option);
			}
		});
	});
	$("#selProvince option").each(function(){
		if($(this).html() == provinces){
			$(this).attr('selected','selected');
			$("#selProvince").trigger('change');
		}
	});
	$("#selCity option").each(function(){
		if($(this).html() == citys){
			$(this).attr('selected','selected');
			$("#selCity").trigger('change');
		}
	});
	$("#selDistrict option").each(function(){
		if($(this).html() == districts){
			$(this).attr('selected','selected');
		}
	});
}
function function_msg(msg){
	if(!msg || msg == undefined){
		msg = '功能未开放';
	}
	layer.msg(msg,{icon:2,offset: 't'});
}
function phpstudy_down(type){
	this_type = type;
	if($('.login').size() > 0){
		layer.msg('请先登录，登录后即可下载',{icon:2,offset:'t'});
		$('.login').trigger('click');
		return false;
	}
	if(!type){
		layer.msg('参数错误，刷新重试',{icon:2});
		return false;
	}
	layer.msg('即将转入下载，请耐心等待', {
	  icon: 16
	  ,shade: [0.45,'#000']
	},function(){
		$.get('/phpStudy_down/?t='+new Date().getTime(),{type:type},function(res){
			layer.closeAll();
			if(res.code == 1){
				is_login = 1;
				window.location.href = res.msg;
			}else{
				layer.msg(res.msg,{icon:2});
			}
		},'json');
	});
}
function phpstudy_down_confirm(data,v){
	var down_href = $(data).html();
	if(!v){
		v = 2016;
	}
	layer.confirm('推荐使用phpstudy最新V8版本', {
	  title:'php版本下载提示',
	  btn: ['下载V8版本','我只要phpstudy'+v+'版本'],
	  // skin: 'layui-layer-molv'
	}, function(){
	  layer.msg('即将转入下载，请耐心等待', {icon: 16,time:1800},function(){
	  	window.location.href = "http://public.xp.cn/upgrades/phpStudy_64.7z";
	  });
	}, function(){
		if(!down_href){
			layer.msg('网络错误，请手动复制链接下载',{icon:2});return;
		}

		layer.msg('即将转入下载，请耐心等待', {icon: 16,time:1800},function(){
			window.location.href = down_href;
		});
	});
}
function phpstudy_down_version(){
	layer.confirm('请选择PhpStudy V8版本位数', {
	  title:'PhpStudy V8版本下载提示',
	  btn: ['64位下载','32位下载'],
	  skin: 'layui-layer-molv'
	}, function(){
	  layer.msg('即将转入下载，请耐心等待', {icon: 16,time:1300},function(){
	  	window.location.href = "https://public.xp.cn/upgrades/phpStudy_64.zip";
	  });
	}, function(){
		layer.msg('即将转入下载，请耐心等待', {icon: 16,time:1300},function(){
	  	window.location.href = "https://public.xp.cn/upgrades/phpStudy_32.zip";
	  });
	});
}