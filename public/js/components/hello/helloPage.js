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
			this.getPaylistData();
		},

		getPaylistData : function(){
			var that = this;
			var scope = vue.global.pages.hello;

			that.ctrl.ajax({
				url : keke.config.baseUrl + '/pay/api/p/paylist/get?item_per_page=' + 
					scope.datas.itemPerPage + '&page=' + 
					scope.datas.pageNow,
				successFunction : function(res){
					if(res.status != 2000){
						return ;
					}

					scope.datas.list = res.data.rows;
				}
			})
		},

		openWechatPay : function(options, callback){
			var that = this;
			WeixinJSBridge.invoke('getBrandWCPayRequest', options.jsapi, function success(res){
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
		<v-flex xs12 style="margin-top : 10px">
			<v-layout row wrap>
				<v-flex xs2>
					<v-img
						style="width:100%"
						src="/pay/res/lizhiqizhuang.png" />
				</v-flex>
				<v-flex xs10>
					<div 
						style="border : 1px solid #ef5350;
						padding : 5px 5px 5px 5px;
						border-radius:10px">
						老子就是有钱人，但老子想变得更有钱
						<br>
						如果你想羞辱有钱人，请
					</div>
				</v-flex>
			</v-layout>
		</v-flex>

		<v-flex xs12>
			<div
				style="width : 60%;
				margin-left : 20%;
				margin-top : 30px;
				margin-bottom:30px;
				border : 1px solid #ef5350;
				border-radius : 10px;
				text-align:center;
				background-color : #ef5350;
				color : #fff;
				font-size : 25px;
				height : 50px;
				line-height : 50px;"

				@click="switchPayPanel">
				一健羞辱
			</div>
		</v-flex>

		<v-flex xs12 style="margin-top:10px;">
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
						{{props.item.name == '' ? '无名大爷' : props.item.name}}
					</td>
					<td>
						{{props.item.message}}
					</td>
					<td>
						{{(props.item.total_fee / 100) + ' 元'}}
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
						请开始你的表演
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
						<div style="height : 30px;line-height : 30px;margin-bottom : 10px">
							羞辱金额
						</div>
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