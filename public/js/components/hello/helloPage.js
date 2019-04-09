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
			alert('check pay')
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
				//废置
				// that.checkPay(options, function(){
				// 	callback();
				// })

				callback();
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
					callback(res);
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
				if(result.status != 2000){
					scope.waitting = false;
					return ;
				}
				//调用微信支付
				that.openWechatPay(result.data, function(){
					alert('支付成功！');
					//todo 刷新列表
					that.switchPayPanel();
					scope.waitting = false;
				});
			})
		},

		switchPayPanel : function(){
			var scope = vue.global.pages.hello;
			var that = this;

			if(!scope.panels.pay.show) {
				scope.panels.pay.form.total_fee = 0;
				scope.panels.pay.form.name = '';
				scope.panels.pay.form.email = '';
				scope.panels.pay.form.message = '';
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
						@click="switchPayPanel"
						style="width:100%"
						src="/pay/res/lizhiqizhuang.png" />
				</v-flex>
			</v-layout>
		</v-flex>
	</v-layout>

	<v-dialog 
		dark
		scrollable=true
		hide-overlay="true"
		v-model="data.panels.pay.show"
		>
		<v-card>
			<v-card-title
			  class="headline lighten-1"
			  primary-title
			>
				一健践踏
			</v-card-title>

			<v-form
				style="padding:16px 16px 16px 16px">
				<v-text-field
					required
					v-model=data.panels.pay.form.name
					label="您的大名">
				</v-text-field>
				<v-text-field
					required
					v-model=data.panels.pay.form.email
					label="留个联系方式呗">
				</v-text-field>
				<v-text-field
					required
					v-model=data.panels.pay.form.message
					label="留言">
				</v-text-field>

				<v-text-field
					required
					v-model=data.panels.pay.form.total_fee
					label="践踏金额">
				</v-text-field>
			</v-form>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn
					@click="switchPayPanel">
					取消
				</v-btn>
				<v-btn
					v-if="!data.waitting"
					@click="onPay"
					color="blue">
					确定
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</v-container>
`
})