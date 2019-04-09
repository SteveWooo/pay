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

		openWechatPay : function(options){
			WeixinJSBridge.invoke('getBrandWCPayRequest', options.jsapi, function success(res){
				if (res.err_msg == "get_brand_wcpay_request:ok") {
                    WeixinJSBridge.call('closeWindow');
                }
			})
		},

		getPaySign : function(callback){
			var that = this;
			this.ctrl.ajax({
				url : keke.config.baseUrl + '/pay/api/p/pay/get_sign?mchid=' + 
					keke.config.mchid + '&total_fee=1&openid=' + 
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
		pay : function(){
			var scope = vue.global.pages.hello;
			var that = this;
			var openid = keke.getQuery('openid');
			if(!openid){
				return ;
			}

			this.getPaySign(function(result){
				if(result.data.return_code != '1'){
					that.ctrl.alert({
						message : result.data.return_msg
					});
					return ;
				}
				that.openWechatPay(result.data);
			})
		}
	},
	mounted : function(){
		this.init();
	},
	template : 
`
<v-container>
	<v-layout row wrap>
		<v-flex xs12>
			<button color="red" @click="pay">
				支付
			</button>
		</v-flex>

		<v-flex xs12>
			{{data.openid}}
		</v-flex>
	</v-layout>
</v-container>
`
})