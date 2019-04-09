Vue.component("hello", {
	data : function(){
		return {
			data : vue.global.pages.hello, //数据流载入
			ctrl : vue.global.common.controllers.actions, //工具注入
		}
	},
	methods : {
		//页面启动瞬间就要进入这个里面去了
		getOpenid : function(){
			var scope = vue.global.pages.hello;
			var openid = keke.getQuery('openid');
			if(!openid){
				location.href = 'https://payjs.cn/api/openid?mchid='+keke.config.mchid+'&callback_url=https://deadfishcrypto.com/pay/public/index.html#hello';
			} else {
				scope.openid = openid;
			}
		},
		init : function(){
			var scope = vue.global.pages.hello;
			this.getOpenid();
		},

		checkPay : function(options, callback){
			var that = this;
			this.ctrl.ajax({
				url : keke.config.baseUrl + '/pay/api/p/pay/checkPay?out_trade_id=' +
					options.out_trade_id,
				successFunction : function(res){
					alert(res.data.payed);
					if(res.status != 2000){
						that.ctrl.alert({
							message : res.error_message
						});
						return ;
					}
					if(res.data.payed == 1){
						callback();
						return ;
					}

					setTimeout(function(){
						that.checkPay(options, callback);
					}, 1000)
				}
			})
		},

		openWechatPay : function(options, callback){
			var that = this;
			WeixinJSBridge.invoke('getBrandWCPayRequest', options.jsapi, function success(res){
				//开始轮询后台
				// that.checkPay(options, function(){
				// 	callback();
				// })
			})
		},

		getPaySign : function(callback){
			var that = this;
			this.ctrl.ajax({
				url : keke.config.baseUrl + '/pay/api/p/pay/get_sign?mchid=' + 
					keke.config.mchid + '&total_fee=' +
					that.data.panels.pay.form.total_fee + '&openid=' + 
					keke.getQuery('openid'),
				successFunction : function(res){
					if(res.status == '2000'){
						callback(res);
						return ;
					}

					that.ctrl.alert({
						message : res.error_message
					})
				}
			})
		},

		//支付调用接口
		onPay : function(){
			var scope = vue.global.pages.hello;
			//锁住
			if(scope.waitting){
				return ;
			}
			scope.waitting = true;
			var that = this;
			var openid = keke.getQuery('openid');
			if(!openid){
				return ;
			}

			//拿签名 生成支付订单
			this.getPaySign(function(result){
				if(result.data.return_code != '1'){
					that.ctrl.alert({
						message : result.data.return_msg
					});
					return ;
				}
				//调用微信支付
				that.openWechatPay(result.data, function(){
					alert('支付成功！');
					scope.waitting = false;
				});
			})
		},

		switchPayPanel : function(){
			var scope = vue.global.pages.hello;
			var that = this;

			if(!scope.panels.pay.show) {
				scope.panels.pay.form.total_fee = 0;
				scope.panels.pay.show = true;
			} else {
				scope.panels.pay.show = false;
			}
		}
	},
	mounted : function(){
		this.init();
	},
	template : 
`
<v-container>
	<v-layout row wrap>
		<v-flex xs12 style="margin-top : 50px">
			<v-layout row wrap>
				<v-flex xs1>
				</v-flex>
				<v-flex xs2>
					<v-img
						@click="onPay"
						style="width:100%"
						src="/pay/res/lizhiqizhuang.png" />
				</v-flex>
			</v-layout>
		</v-flex>
	</v-layout>
</v-container>
`
})