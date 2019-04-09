Vue.component("hello", {
	data : function(){
		return {
			data : vue.global.pages.hello, //数据流载入
			ctrl : vue.global.common.controllers.actions, //工具注入
		}
	},
	methods : {
		//页面启动瞬间就要进入这个里面去了
		init : function(){
			var scope = vue.global.pages.hello;
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
					that.ctrl.alert({
						message : '支付成功'
					})
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
				scope.panels.pay.form.total_fee = 5000;
				scope.panels.pay.form.name = '';
				scope.panels.pay.form.email = '';
				scope.panels.pay.form.message = '';
				scope.panels.pay.show = true;
			} else {
				scope.panels.pay.show = false;
			}
		},

		changePay : function(total_fee){
			var scope = vue.global.pages.hello;
			scope.panels.pay.form.total_fee = total_fee;
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

		<v-flex xs12>
			<v-data-table
				dark
				hide-actions
				rows-per-page-items="10"
				:headers="data.datas.itemHeader" 
				:items="data.datas.list"
				:total-items="data.datas.count"
				:loading=data.datas.loading>
				<v-progress-linear slot="progress" color="red" indeterminate></v-progress-linear>
				<template slot="items" slot-scope="props">
					<td>
						{{props.item.name}}
					</td>
					<td>
						{{props.item.message}}
					</td>
					<td>
						{{props.item.total_fee}}
					</td>
				</template>
			</v-data-table>
		</v-flex>

		<v-flex xs12>
			<v-dialog 
				dark
				scrollable=true
				hide-overlay="true"
				v-model="data.panels.pay.show"
				>
				<v-card>
					<v-card-title
					  class="headline red lighten-1"
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

						<v-layout flex wrap>
							<v-flex xs3 class="pay-btn">
								<div
									class="checkbox"
									@click="changePay(1)">
									1分
								</div>
								<div
									v-if="data.panels.pay.form.total_fee==1"
									class="actived">
									√
								</div>
							</v-flex>
							<v-flex xs3 class="pay-btn">
								<div
									class="checkbox"
									@click="changePay(5000)">
									5元
								</div>
								<div
									v-if="data.panels.pay.form.total_fee==5000"
									class="actived">
									√
								</div>
							</v-flex>
							<v-flex xs3 class="pay-btn">
								<div
									class="checkbox"
									@click="changePay(10000)">
									10元
								</div>
								<div
									v-if="data.panels.pay.form.total_fee==10000"
									class="actived">
									√
								</div>
							</v-flex>
							<v-flex xs3 class="pay-btn">
								<div
									class="checkbox"
									@click="changePay(50000)">
									50元
								</div>
								<div
									v-if="data.panels.pay.form.total_fee==50000"
									class="actived">
									√
								</div>
							</v-flex>
						</v-layout>
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
							color="red">
							确定
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-flex>
	</v-layout>
</v-container>
`
})