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

			this.ctrl.ajax({
				url : keke.config.baseUrl + '/pay/api/p/pay/get_sign',
				successFunction : function(res){
					console.log(res);
				}
			})
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
			<button @click="pay">
				支付
			</button>
		</v-flex>
	</v-layout>
</v-container>
`
})