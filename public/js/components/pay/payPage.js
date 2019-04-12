Vue.component('pay', {
	data : function(){
		return {
			data : vue.global.pages.pay, //数据流载入
			ctrl : vue.global.common.controllers.actions, //工具注入
		}
	},
	methods : {
		backPage : function(){
			location.href = '/pay/me/index.html';
		},
		init : function(){
			vue.global.common.initHandle();
		},
		
		openWechatPay : function(options, callback){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			WeixinJSBridge.invoke('getBrandWCPayRequest', options.jsapi, function success(res){
				callback();
			})
		},

		getPaySign : function(callback){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			this.ctrl.ajax({
				url : keke.config.baseUrl + '/pay/api/p/pay/get_sign?mchid=' + 
					keke.config.mchid + '&total_fee=' +
					keke.getQuery('total_fee') + '&openid=' + 
					keke.getQuery('openid') + "&name=" + 
					keke.getQuery('name') + "&email=" + 
					keke.getQuery('email') + "&message=" +
					keke.getQuery('message'),
				successFunction : function(res){
					if(res.status == '2000'){
						callback(res);
						return ;
					}

					that.ctrl.alert({
						message : res.error_message
					})
					callback(res);
				}
			})
		},

		//支付调用接口
		onPay : function(){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			//锁住
			if(scope.datas.loading){
				return ;
			}
			scope.datas.loading = true;
			var that = this;
			var openid = keke.getQuery('openid');
			var total_fee = keke.getQuery('total_fee');
			if(!openid){
				alert('参数错误');
				that.backPage();
				return ;
			}

			if(parseFloat(total_fee) != total_fee){
				alert('参数错误:total_fee');
				that.backPage();
				return ;
			}

			//拿签名 生成支付订单
			this.getPaySign(function(result){
				if(result.status != 2000){
					scope.datas.loading = false;
					return ;
				}
				//调用微信支付
				that.openWechatPay(result.data, function(){
					that.ctrl.alert({
						message : '支付完成'
					})
					//todo 刷新列表
					// that.getPaylistData();
					// that.switchPayPanel();
					that.backPage();
					scope.datas.loading = false;
				});
			})
		},
	},
	mounted : function(){
		this.init();
	},
	template : 
`
<v-container>
	<v-layout row wrap>
		<div>
			<button @click="onPay">
				确认支付
			</button>
		</div>
	</v-layout>
</v-container>
`
})