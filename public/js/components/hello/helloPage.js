Vue.component("hello", {
	data : function(){
		return {
			data : vue.global.pages.hello, //数据流载入
			ctrl : vue.global.common.controllers.actions, //工具注入
		}
	},
	methods : {
		init : function(){
			var scope = vue.global.pages.hello;

			// this.ctrl.ajax({
			// 	url : keke.config.baseUrl + '/pay/api/p/pay/get_sign',
			// 	successFunction : function(res){
			// 		console.log(res);
			// 	}
			// })
			var openid = keke.getQuery('openid');
			if(!openid){
				location.href = 'https://payjs.cn/api/openid?mchid='+keke.config.mchid+'&callback_url=https://deadfishcrypto.com/pay/public/index.html#hello';
			} else {
				scope.openid = openid;
			}
			
		},

		pay : function(){

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